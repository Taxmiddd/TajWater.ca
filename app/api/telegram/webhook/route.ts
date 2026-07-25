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
      await sendTelegramMessage(chatId, `❌ No email found in your message. Example: "john@email.com 3 bottles"`)
      return NextResponse.json({ ok: true })
    }
    const customerEmail = emailMatch[0].toLowerCase()

    // Parse quantity — allows "3refills", "3 bottles", "3 jugs" etc.
    const qtyMatch = text.match(/(\d+)\s*(bottle|bottles|refill|refills|jug|jugs)/i)
    const quantity = qtyMatch ? parseInt(qtyMatch[1], 10) : 0

    if (quantity <= 0) {
      await sendTelegramMessage(chatId, `❌ Could not detect quantity. Example: "john@email.com 3 bottles"`)
      return NextResponse.json({ ok: true })
    }

    console.log(`[Telegram Bot] Parsed: email=${customerEmail}, qty=${quantity}`)

    // Init Supabase with service role
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
      console.error('[Telegram Bot] Profile lookup error:', profileError)
      await sendTelegramMessage(chatId, `❌ No customer found with email: ${customerEmail}`)
      return NextResponse.json({ ok: true })
    }

    // Get product price
    const { data: product } = await supabase
      .from('products')
      .select('id, name, price')
      .ilike('name', '%refill%')
      .eq('active', true)
      .limit(1)
      .single()

    const pricePerUnit = product?.price ?? 10
    const totalCost = pricePerUnit * quantity
    const currentBalance = profile.wallet_balance ?? 0

    console.log(`[Telegram Bot] Customer: ${profile.name}, Balance: ${currentBalance}, Cost: ${totalCost}`)

    if (currentBalance < totalCost) {
      await sendTelegramMessage(chatId, `❌ Insufficient balance for ${profile.name}.\nNeeded: $${totalCost.toFixed(2)} | Available: $${currentBalance.toFixed(2)}`)
      return NextResponse.json({ ok: true })
    }

    // Deduct balance
    const newBalance = currentBalance - totalCost
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ wallet_balance: newBalance })
      .eq('id', profile.id)

    if (updateError) {
      console.error('[Telegram Bot] Update error:', updateError)
      await sendTelegramMessage(chatId, `❌ Failed to update wallet balance. Please try again.`)
      return NextResponse.json({ ok: true })
    }

    // Send receipt email to customer
    try {
      const emailHtml = buildWalletAdjustmentEmail({
        customerName: profile.name,
        type: 'deduct',
        amount: totalCost,
        newBalance,
        reason: `Product Purchase: ${quantity}x ${product?.name ?? 'Water Refill'}`,
        dateStr: new Date().toLocaleString('en-CA'),
      })
      await resend.emails.send({
        from: `TajWater <${process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'info@tajwater.ca'}>`,
        to: profile.email,
        subject: 'TajWater – Delivery Receipt',
        html: emailHtml,
      })
      console.log(`[Telegram Bot] Receipt email sent to ${profile.email}`)
    } catch (emailErr) {
      console.error('[Telegram Bot] Email error:', emailErr)
    }

    // Confirm to driver
    await sendTelegramMessage(
      chatId,
      `✅ Done!\n\nCustomer: ${profile.name}\nDelivered: ${quantity}x ${product?.name ?? 'Water Refill'}\nCharged: $${totalCost.toFixed(2)}\nNew Balance: $${newBalance.toFixed(2)}\n\nReceipt emailed to ${profile.email}`
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Telegram Bot] Unhandled error:', err)
    return NextResponse.json({ ok: true })
  }
}
