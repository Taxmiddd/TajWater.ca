import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buildWalletAdjustmentEmail, resend } from '@/lib/email'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN


async function sendTelegramMessage(chatId: string | number, text: string) {
  if (!TELEGRAM_BOT_TOKEN) return
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })
  } catch (error) {
    console.error('Error sending telegram message:', error)
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message = body.message

    if (!message || !message.text) {
      return NextResponse.json({ ok: true })
    }

    const chatId = message.chat.id.toString()
    const text = message.text.trim()



    // 2. Parse the message (Regex to keep it 100% free)
    // Looking for an email and a number of bottles
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    const bottlesMatch = text.match(/(\d+)\s*(bottle|bottles|refill|refills|jug|jugs)/i)

    if (!emailMatch) {
      await sendTelegramMessage(chatId, `❌ Error: Could not find an email address in your message. Please include the customer's email.`)
      return NextResponse.json({ ok: true })
    }

    const customerEmail = emailMatch[0].toLowerCase()
    const quantity = bottlesMatch ? parseInt(bottlesMatch[1], 10) : 0

    if (quantity <= 0) {
      await sendTelegramMessage(chatId, `❌ Error: Could not detect the number of bottles. Example format: "2 bottles for ${customerEmail}"`)
      return NextResponse.json({ ok: true })
    }

    // 3. Find customer in database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, name, email, wallet_balance')
      .eq('email', customerEmail)
      .single()

    if (profileError || !profile) {
      await sendTelegramMessage(chatId, `❌ Error: Could not find a customer with email ${customerEmail}.`)
      return NextResponse.json({ ok: true })
    }

    // 4. Get product price (Assumes there is a product named '5 Gallon Water Refill' or similar)
    // To be safe, we'll search for 'refill' and take the first active one, or fallback to $10.
    const { data: product } = await supabase
      .from('products')
      .select('id, name, price')
      .ilike('name', '%refill%')
      .eq('active', true)
      .limit(1)
      .single()

    const pricePerBottle = product ? product.price : 10 // fallback to 10 if not found
    const totalCost = pricePerBottle * quantity

    if ((profile.wallet_balance || 0) < totalCost) {
      await sendTelegramMessage(chatId, `❌ Error: ${profile.name} does not have enough wallet balance. Needed: $${totalCost.toFixed(2)}, Available: $${(profile.wallet_balance || 0).toFixed(2)}`)
      return NextResponse.json({ ok: true })
    }

    // 5. Deduct balance
    const newBalance = (profile.wallet_balance || 0) - totalCost
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ wallet_balance: newBalance })
      .eq('id', profile.id)

    if (updateError) {
      await sendTelegramMessage(chatId, `❌ Error: Failed to update wallet balance in the database.`)
      return NextResponse.json({ ok: true })
    }

    // 7. Send Email to Customer
    try {
      const emailHtml = buildWalletAdjustmentEmail({
        customerName: profile.name,
        type: 'deduct',
        amount: totalCost,
        newBalance: newBalance,
        reason: `Product Purchase: ${quantity}x ${product ? product.name : 'Water Refill'}`,

        dateStr: new Date().toLocaleString()
      })
      
      await resend.emails.send({
        from: `TajWater <${process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@tajwater.ca'}>`,

        to: profile.email,
        subject: 'TajWater Wallet Deduction Receipt',
        html: emailHtml
      })
    } catch (e) {
      console.error('Failed to send email:', e)
    }

    // 8. Send success confirmation to driver
    await sendTelegramMessage(chatId, `✅ Success! Deducted $${totalCost.toFixed(2)} for ${quantity} bottles from ${profile.name} (${profile.email}).\nNew Balance: $${newBalance.toFixed(2)}`)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ ok: true })
  }
}
