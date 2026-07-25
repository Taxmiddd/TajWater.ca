import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buildWalletAdjustmentEmail, resend } from '@/lib/email'

export const dynamic = 'force-dynamic'

async function sendTelegramMessage(chatId: string | number, text: string, replyMarkup?: any) {
  // Strip any accidental spaces or quotes from the env var
  const token = (process.env.TELEGRAM_BOT_TOKEN || '').replace(/['"]/g, '').trim()
  console.log(`[TG Bot] DEBUG TOKEN: Length=${token.length}, StartsWith=${token.substring(0, 5)}`)
  
  if (!token) {
    console.error('[TG Bot] TELEGRAM_BOT_TOKEN not set!')
    return
  }

  const payload: any = { chat_id: chatId, text }
  if (replyMarkup) {
    payload.reply_markup = replyMarkup
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!data.ok) console.error('[TG Bot] sendMessage failed:', JSON.stringify(data))
}

// ─── Parse items ─────────────────────────────────────────────
// Input:  "5 bottles, 2 paper cups. 1 dispenser"
// Output: [{ qty: 5, keyword: 'bottles' }, { qty: 2, keyword: 'paper cups' }, ...]
function parseItems(text: string, emailStr: string) {
  // Remove the email from text then split by comma, period, or semicolon
  const withoutEmail = text.replace(emailStr, '').trim()
  const segments = withoutEmail.split(/[,;.]/).map((s) => s.trim()).filter(Boolean)

  const items: { qty: number; keyword: string }[] = []
  for (const seg of segments) {
    // Each segment: optional number + description, e.g. "5 bottles" or "paper cups"
    const match = seg.match(/^(\d+)\s+(.+)$/)
    if (match) {
      items.push({ qty: parseInt(match[1], 10), keyword: match[2].toLowerCase().trim() })
    } else {
      // No number found — assume qty 1
      const cleaned = seg.replace(/^\d+\s*/, '').toLowerCase().trim()
      if (cleaned) items.push({ qty: 1, keyword: cleaned })
    }
  }
  return items
}

// ─── Match keyword against product list ──────────────────────────────────────
function findProduct(keyword: string, products: { id: string; name: string; price: number }[]) {
  const kw = keyword.toLowerCase()
  // Try exact substring match first (most specific)
  let match = products.find((p) => p.name.toLowerCase().includes(kw))
  if (match) return match

  // Try matching any word in the keyword against product name
  const kwWords = kw.split(/\s+/).filter((w) => w.length > 2)
  for (const word of kwWords) {
    match = products.find((p) => p.name.toLowerCase().includes(word))
    if (match) return match
  }
  return null
}

// ─── Webhook Handler ──────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json()

    // ─── Handle Callback Queries (Button Presses) ─────────────────────────
    if (body.callback_query) {
      const callbackQuery = body.callback_query
      const chatId = callbackQuery.message?.chat?.id
      const data = callbackQuery.data

      // Answer callback query to remove loading state
      const token = (process.env.TELEGRAM_BOT_TOKEN || '').replace(/['"]/g, '').trim()
      await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: callbackQuery.id })
      })

      if (!chatId) return NextResponse.json({ ok: true })

      if (data === 'log_delivery') {
        await sendTelegramMessage(chatId, "To log a delivery, simply send me a message in this format:\n`john@email.com, 5 bottles, 2 paper cups`", { parse_mode: 'Markdown' })
      } else if (data === 'start_shift') {
        await sendTelegramMessage(chatId, "Shift started! Drive safely. 🚚")
      } else if (data === 'end_shift') {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        // Init Supabase
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        
        const { data: txs } = await supabase
          .from('wallet_transactions')
          .select('amount')
          .eq('created_by', 'Driver (Telegram)')
          .gte('created_at', today.toISOString())
          
        const dailyTotal = txs ? txs.reduce((sum, t) => sum + Math.abs(t.amount), 0) : 0
        const dailyCount = txs ? txs.length : 0
          
        await sendTelegramMessage(chatId, `Shift ended! Have a good rest. 🛑\n\n📊 *Today's Stats (All Drivers):*\nDeliveries Logged: ${dailyCount}\nValue Deducted: $${dailyTotal.toFixed(2)}`, { parse_mode: 'Markdown' })
      }
      return NextResponse.json({ ok: true })
    }

    // ─── Handle Text Messages & Photos ────────────────────────────────────
    const message = body?.message
    // If it has a photo, the text is in the caption
    const textRaw = message?.text || message?.caption
    if (!message || (!textRaw && !message.location)) return NextResponse.json({ ok: true })

    const chatId = message.chat.id
    const text = (textRaw as string || '').trim()

    // ─── Handle Two-Way Admin Replies to Support Tickets ──────────────────
    if (message.reply_to_message) {
      const adminChatIds = (process.env.TELEGRAM_ADMIN_CHAT_IDS || '').split(',')
      if (adminChatIds.includes(chatId.toString())) {
        const originalText = message.reply_to_message.text || ''
        
        // If the original message was a support ticket
        if (originalText.includes('New Support Ticket')) {
          const emailMatch = originalText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
          if (emailMatch) {
            const customerEmail = emailMatch[0]
            try {
              await resend.emails.send({
                from: `TajWater Support <${process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'support@tajwater.ca'}>`,
                to: customerEmail,
                subject: 'Re: Your Support Ticket',
                text: text, // The admin's reply
              })
              await sendTelegramMessage(chatId, `✅ Reply sent to ${customerEmail}`)
              return NextResponse.json({ ok: true })
            } catch (err) {
              console.error('[TG Bot] Failed to send reply email:', err)
              await sendTelegramMessage(chatId, `❌ Failed to send reply to ${customerEmail}`)
              return NextResponse.json({ ok: true })
            }
          }
        }
      }
    }

    // Handle /start command for interactive menu
    if (text.startsWith('/start')) {
      await sendTelegramMessage(chatId, "Welcome to the TajWater Driver Hub! What would you like to do?", {
        inline_keyboard: [
          [
            { text: "🚚 Start Shift", callback_data: "start_shift" },
            { text: "🛑 End Shift", callback_data: "end_shift" }
          ],
          [
            { text: "📦 Log Delivery", callback_data: "log_delivery" }
          ]
        ]
      })
      return NextResponse.json({ ok: true })
    }

    // Handle /topup command for admins
    if (text.startsWith('/topup')) {
      const adminChatIds = (process.env.TELEGRAM_ADMIN_CHAT_IDS || '').split(',')
      if (!adminChatIds.includes(chatId.toString())) {
        await sendTelegramMessage(chatId, "❌ You do not have permission to use this command.")
        return NextResponse.json({ ok: true })
      }

      const args = text.split(' ')
      if (args.length < 3) {
        await sendTelegramMessage(chatId, "❌ Invalid format. Use: /topup customer@email.com 50")
        return NextResponse.json({ ok: true })
      }

      const email = args[1].toLowerCase()
      const amount = parseFloat(args[2])

      if (isNaN(amount) || amount <= 0) {
        await sendTelegramMessage(chatId, "❌ Invalid amount.")
        return NextResponse.json({ ok: true })
      }

      // Init Supabase
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      // Find profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email, wallet_balance')
        .eq('email', email)
        .single()

      if (profileError || !profile) {
        await sendTelegramMessage(chatId, `❌ No customer found with email: ${email}`)
        return NextResponse.json({ ok: true })
      }

      const newBalance = (profile.wallet_balance ?? 0) + amount
      const { error: updateError } = await supabase.from('profiles').update({ wallet_balance: newBalance }).eq('id', profile.id)

      if (updateError) {
        await sendTelegramMessage(chatId, `❌ Failed to update wallet.`)
        return NextResponse.json({ ok: true })
      }

      await supabase.from('wallet_transactions').insert({
        user_id: profile.id,
        amount: amount,
        balance_after: newBalance,
        transaction_type: 'admin_topup',
        reason: `Telegram Admin Top-up`,
        created_by: 'Admin (Telegram)',
      })

      await sendTelegramMessage(chatId, `✅ Success! Added $${amount.toFixed(2)} to ${profile.name}'s wallet. New balance: $${newBalance.toFixed(2)}`)
      return NextResponse.json({ ok: true })
    }

    // Handle /broadcast command for admins
    if (text.startsWith('/broadcast')) {
      const adminChatIds = (process.env.TELEGRAM_ADMIN_CHAT_IDS || '').split(',')
      if (!adminChatIds.includes(chatId.toString())) {
        await sendTelegramMessage(chatId, "❌ You do not have permission to use this command.")
        return NextResponse.json({ ok: true })
      }

      const messageToBroadcast = text.replace('/broadcast', '').trim()
      if (!messageToBroadcast) {
        await sendTelegramMessage(chatId, "❌ Please provide a message. Example:\n/broadcast Traffic delay on Main St.")
        return NextResponse.json({ ok: true })
      }

      const driverChatIds = (process.env.TELEGRAM_DRIVER_CHAT_IDS || '').split(',')
      let sentCount = 0
      for (const dChatId of driverChatIds) {
        if (dChatId.trim()) {
           await sendTelegramMessage(dChatId.trim(), `📢 *ADMIN BROADCAST*\n\n${messageToBroadcast}`, { parse_mode: 'Markdown' })
           sentCount++
        }
      }
      
      await sendTelegramMessage(chatId, `✅ Broadcast sent to ${sentCount} driver(s).`)
      return NextResponse.json({ ok: true })
    }

    console.log(`[TG Bot] Message from ${chatId}: "${text}"`)

    // Extract email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    if (!emailMatch) {
      await sendTelegramMessage(chatId,
        `❌ No email found.\n\nFormat:\njohn@email.com, 5 bottles, 2 paper cups, 1 dispenser`)
      return NextResponse.json({ ok: true })
    }
    const customerEmail = emailMatch[0].toLowerCase()

    // Parse items from comma-separated segments
    const parsedItems = parseItems(text, emailMatch[0])
    if (parsedItems.length === 0) {
      await sendTelegramMessage(chatId,
        `❌ No items found after the email.\n\nFormat:\njohn@email.com, 5 bottles, 2 paper cups`)
      return NextResponse.json({ ok: true })
    }

    console.log(`[TG Bot] Parsed items:`, parsedItems)

    // Handle Photo (Proof of Delivery)
    let proofUrl = null
    if (message.photo && message.photo.length > 0) {
      const token = (process.env.TELEGRAM_BOT_TOKEN || '').replace(/['"]/g, '').trim()
      // Get the largest photo size
      const photo = message.photo[message.photo.length - 1]
      const fileRes = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${photo.file_id}`)
      const fileData = await fileRes.json()
      if (fileData.ok && fileData.result.file_path) {
         // This is the direct Telegram URL for the file (temporary, ideally you'd download and upload to Supabase here)
         proofUrl = `https://api.telegram.org/file/bot${token}/${fileData.result.file_path}`
         console.log(`[TG Bot] Received proof of delivery photo: ${proofUrl}`)
      }
    }

    // Init Supabase with service role
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Find customer profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, name, email, wallet_balance')
      .eq('email', customerEmail)
      .single()

    if (profileError || !profile) {
      console.error('[TG Bot] Profile not found:', profileError)
      await sendTelegramMessage(chatId, `❌ No customer found with email: ${customerEmail}`)
      return NextResponse.json({ ok: true })
    }

    // Fetch all active products
    const { data: allProducts, error: productsError } = await supabase
      .from('products')
      .select('id, name, price')
      .eq('active', true)

    if (productsError || !allProducts?.length) {
      console.error('[TG Bot] Products error:', productsError)
      await sendTelegramMessage(chatId, `❌ Could not load products from database.`)
      return NextResponse.json({ ok: true })
    }

    // Match each parsed item to a product
    const matched: { product: typeof allProducts[0]; quantity: number }[] = []
    const unmatched: string[] = []

    for (const item of parsedItems) {
      const product = findProduct(item.keyword, allProducts)
      if (product) {
        // Merge duplicates
        const existing = matched.find((m) => m.product.id === product.id)
        if (existing) existing.quantity += item.qty
        else matched.push({ product, quantity: item.qty })
      } else {
        unmatched.push(`"${item.keyword}"`)
      }
    }

    if (matched.length === 0) {
      await sendTelegramMessage(chatId,
        `❌ None of the items matched any products in the database.\nUnrecognized: ${unmatched.join(', ')}\n\nTry using names like: refill, dispenser, paper cups`)
      return NextResponse.json({ ok: true })
    }

    // Calculate total
    const totalCost = matched.reduce((sum, m) => sum + m.product.price * m.quantity, 0)
    const currentBalance = profile.wallet_balance ?? 0

    console.log(`[TG Bot] Matched:`, matched.map(m => `${m.quantity}x ${m.product.name} @ $${m.product.price}`).join(', '))
    console.log(`[TG Bot] Total: $${totalCost.toFixed(2)}, Balance: $${currentBalance.toFixed(2)}`)

    if (currentBalance < totalCost) {
      await sendTelegramMessage(chatId,
        `❌ Insufficient balance for ${profile.name}.\nNeeded: $${totalCost.toFixed(2)} | Available: $${currentBalance.toFixed(2)}`)
      return NextResponse.json({ ok: true })
    }

    const newBalance = currentBalance - totalCost

    // Deduct wallet balance
    const { data: updatedRows, error: updateError } = await supabase
      .from('profiles')
      .update({ wallet_balance: newBalance })
      .eq('id', profile.id)
      .select('id, wallet_balance')

    if (updateError) {
      console.error('[TG Bot] Update error:', JSON.stringify(updateError))
      await sendTelegramMessage(chatId, `❌ Failed to update wallet (DB error). Please try again.`)
      return NextResponse.json({ ok: true })
    }

    if (!updatedRows || updatedRows.length === 0) {
      console.error('[TG Bot] 0 rows updated — RLS may be blocking. Profile ID:', profile.id)
      await sendTelegramMessage(chatId, `❌ Could not update wallet for ${profile.name}. Permission error.`)
      return NextResponse.json({ ok: true })
    }

    console.log('[TG Bot] Balance updated. Confirmed new balance:', updatedRows[0]?.wallet_balance)

    // Log transaction history
    const reasonText = matched.map(m => `${m.quantity}x ${m.product.name}`).join(', ')
    const insertData: any = {
      user_id: profile.id,
      amount: -totalCost,
      balance_after: newBalance,
      transaction_type: 'driver_deduction',
      reason: `Driver Delivery: ${reasonText}`,
      created_by: 'Driver (Telegram)',
    }
    
    // If you add a proof_url column to wallet_transactions in Supabase, uncomment this:
    // if (proofUrl) insertData.proof_url = proofUrl

    await supabase.from('wallet_transactions').insert(insertData)

    console.log('[TG Bot] Transaction logged.')

    // Send receipt email to customer
    try {
      const emailHtml = buildWalletAdjustmentEmail({
        customerName: profile.name,
        type: 'deduct',
        amount: totalCost,
        newBalance,
        reason: `Product Purchase: ${reasonText}`,
        dateStr: new Date().toLocaleString('en-CA'),
      })
      await resend.emails.send({
        from: `TajWater <${process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'info@tajwater.ca'}>`,
        to: profile.email,
        subject: 'TajWater – Delivery Receipt',
        html: emailHtml,
      })
      console.log(`[TG Bot] Receipt emailed to ${profile.email}`)
    } catch (emailErr) {
      console.error('[TG Bot] Email error:', emailErr)
    }

    // Build itemized reply for driver
    const itemLines = matched
      .map(m => `  • ${m.quantity}x ${m.product.name} — $${(m.product.price * m.quantity).toFixed(2)}`)
      .join('\n')

    let unmatchedNote = unmatched.length > 0 ? `\n\n⚠️ Not found in DB: ${unmatched.join(', ')}` : ''
    
    // Low balance warning
    if (newBalance < 15) {
      unmatchedNote += `\n\n⚠️ *LOW BALANCE WARNING*\nCustomer balance is $${newBalance.toFixed(2)}. Please remind them to top up!`
    }

    await sendTelegramMessage(chatId,
      `✅ Delivery logged!\n\nCustomer: ${profile.name}\n\nItems:\n${itemLines}\n\nTotal Charged: $${totalCost.toFixed(2)}\nNew Balance: $${newBalance.toFixed(2)}\n\nReceipt emailed ✉️${unmatchedNote}`, { parse_mode: 'Markdown' })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[TG Bot] Unhandled error:', err)
    return NextResponse.json({ ok: true })
  }
}
