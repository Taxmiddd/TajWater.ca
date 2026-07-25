import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buildWalletAdjustmentEmail, resend } from '@/lib/email'

export const dynamic = 'force-dynamic'

async function sendTelegramMessage(chatId: string | number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) {
    console.error('[Telegram Bot] TELEGRAM_BOT_TOKEN is not set!')
    return
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
  const data = await res.json()
  if (!data.ok) {
    console.error('[Telegram Bot] sendMessage failed:', JSON.stringify(data))
  }
}

// ─── Product Matching ─────────────────────────────────────────────────────────
// Given the full message and a list of DB products, find all items delivered.
// Returns array of { product, quantity }
function matchProducts(
  text: string,
  products: { id: string; name: string; price: number }[]
) {
  const matched: { product: typeof products[0]; quantity: number }[] = []
  const lowerText = text.toLowerCase()

  // Build keyword map: for each product, build a set of search terms from its name
  for (const product of products) {
    const productName = product.name.toLowerCase()

    // Generate keyword variants from the product name
    // e.g. "5 Gallon Hot & Cold Dispenser" → ["hot", "cold", "dispenser", "hot cold", "hot & cold"]
    const words = productName
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2) // skip tiny words like "a", "of", "5"

    // Check if any meaningful word from the product name is in the message
    const productNameNoSpecial = productName.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()

    // Try to find a quantity near this product mention
    // Pattern: look for NUMBER + KEYWORD or KEYWORD + NUMBER
    let quantity = 0
    let found = false

    // Try multi-word match first (more specific), then single-word
    const searchTerms = [productNameNoSpecial, ...words].sort((a, b) => b.length - a.length)

    for (const term of searchTerms) {
      if (!lowerText.includes(term)) continue

      // Found the term — now look for a number near it
      // Pattern: (\d+)\s*TERM or TERM\s*(\d+)
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const beforeMatch = new RegExp(`(\\d+)\\s*(?:\\w+\\s*){0,3}${escapedTerm}`, 'i').exec(text)
      const afterMatch = new RegExp(`${escapedTerm}\\s*(?:\\w+\\s*){0,3}(\\d+)`, 'i').exec(text)

      if (beforeMatch) {
        quantity = parseInt(beforeMatch[1], 10)
        found = true
        break
      } else if (afterMatch) {
        quantity = parseInt(afterMatch[1], 10)
        found = true
        break
      } else {
        // Term found but no number — assume quantity 1
        quantity = 1
        found = true
        break
      }
    }

    if (found && quantity > 0) {
      // Don't double-count (if product already matched, skip)
      if (!matched.find((m) => m.product.id === product.id)) {
        matched.push({ product, quantity })
      }
    }
  }

  return matched
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message = body?.message

    if (!message || !message.text) {
      return NextResponse.json({ ok: true })
    }

    const chatId = message.chat.id
    const text = (message.text as string).trim()

    console.log(`[Telegram Bot] Message from chatId=${chatId}: "${text}"`)

    // Parse email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    if (!emailMatch) {
      await sendTelegramMessage(chatId, `❌ No email found.\n\nExample:\njohn@email.com 2 refills 1 dispenser`)
      return NextResponse.json({ ok: true })
    }
    const customerEmail = emailMatch[0].toLowerCase()

    // Init Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Find customer
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, name, email, wallet_balance')
      .eq('email', customerEmail)
      .single()

    if (profileError || !profile) {
      console.error('[Telegram Bot] Profile not found:', profileError)
      await sendTelegramMessage(chatId, `❌ No customer found with email: ${customerEmail}`)
      return NextResponse.json({ ok: true })
    }

    // Fetch ALL active products from DB
    const { data: allProducts, error: productsError } = await supabase
      .from('products')
      .select('id, name, price')
      .eq('active', true)

    if (productsError || !allProducts || allProducts.length === 0) {
      console.error('[Telegram Bot] Products error:', productsError)
      await sendTelegramMessage(chatId, `❌ Could not load products from database.`)
      return NextResponse.json({ ok: true })
    }

    // Match products from the message
    const matched = matchProducts(text, allProducts)

    if (matched.length === 0) {
      await sendTelegramMessage(
        chatId,
        `❌ Could not identify any products in your message.\n\nExamples:\n• john@email.com 2 refills\n• john@email.com 1 hot cold dispenser 3 refills 2 paper cups`
      )
      return NextResponse.json({ ok: true })
    }

    // Calculate total
    const totalCost = matched.reduce((sum, m) => sum + m.product.price * m.quantity, 0)
    const currentBalance = profile.wallet_balance ?? 0

    console.log(`[Telegram Bot] Matched products:`, matched.map(m => `${m.quantity}x ${m.product.name}`).join(', '))
    console.log(`[Telegram Bot] Total: $${totalCost.toFixed(2)}, Balance: $${currentBalance.toFixed(2)}`)

    if (currentBalance < totalCost) {
      await sendTelegramMessage(
        chatId,
        `❌ Insufficient balance for ${profile.name}.\nNeeded: $${totalCost.toFixed(2)} | Available: $${currentBalance.toFixed(2)}`
      )
      return NextResponse.json({ ok: true })
    }

    // Deduct balance — use .select() to verify the row was actually updated (catches silent RLS failures)
    const newBalance = currentBalance - totalCost
    const { data: updatedRows, error: updateError } = await supabase
      .from('profiles')
      .update({ wallet_balance: newBalance })
      .eq('id', profile.id)
      .select('id, wallet_balance')

    if (updateError) {
      console.error('[Telegram Bot] Update error:', JSON.stringify(updateError))
      await sendTelegramMessage(chatId, `❌ Failed to update wallet (DB error). Please try again.`)
      return NextResponse.json({ ok: true })
    }

    if (!updatedRows || updatedRows.length === 0) {
      console.error('[Telegram Bot] Update returned 0 rows — likely RLS blocking. Profile ID:', profile.id)
      await sendTelegramMessage(chatId, `❌ Could not update wallet for ${profile.name}. Permission error — please contact admin.`)
      return NextResponse.json({ ok: true })
    }

    console.log('[Telegram Bot] Wallet updated. New balance confirmed:', updatedRows[0]?.wallet_balance)

    // Build itemized list for email
    const itemsForEmail = matched.map((m) => ({
      name: m.product.name,
      qty: m.quantity,
      price: m.product.price,
    }))

    const reasonText = `Product Purchase: ` + matched.map(m => `${m.quantity}x ${m.product.name}`).join(', ')

    // Send receipt email
    try {
      const emailHtml = buildWalletAdjustmentEmail({
        customerName: profile.name,
        type: 'deduct',
        amount: totalCost,
        newBalance,
        reason: reasonText,
        dateStr: new Date().toLocaleString('en-CA'),
      })
      await resend.emails.send({
        from: `TajWater <${process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'info@tajwater.ca'}>`,
        to: profile.email,
        subject: 'TajWater – Delivery Receipt',
        html: emailHtml,
      })
      console.log(`[Telegram Bot] Receipt emailed to ${profile.email}`)
    } catch (emailErr) {
      console.error('[Telegram Bot] Email error:', emailErr)
    }

    // Build itemized confirmation for driver
    const itemLines = matched
      .map((m) => `  • ${m.quantity}x ${m.product.name} — $${(m.product.price * m.quantity).toFixed(2)}`)
      .join('\n')

    await sendTelegramMessage(
      chatId,
      `✅ Delivery logged!\n\nCustomer: ${profile.name}\n\nItems Delivered:\n${itemLines}\n\nTotal Charged: $${totalCost.toFixed(2)}\nNew Balance: $${newBalance.toFixed(2)}\n\nReceipt emailed to ${profile.email} ✉️`
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Telegram Bot] Unhandled error:', err)
    return NextResponse.json({ ok: true })
  }
}
