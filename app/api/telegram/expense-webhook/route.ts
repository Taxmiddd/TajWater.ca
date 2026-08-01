import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

async function sendTelegramMessage(chatId: string | number, text: string, options?: Record<string, any>) {
  const token = (process.env.TELEGRAM_EXPENSE_BOT_TOKEN || '').trim()
  
  if (!token) {
    console.error('[Expense Bot] TELEGRAM_EXPENSE_BOT_TOKEN not set!')
    return
  }

  const payload: any = { chat_id: chatId, text, ...options }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!data.ok) console.error('[Expense Bot] sendMessage failed:', JSON.stringify(data))
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message = body?.message
    const textRaw = message?.text
    
    if (!message || !textRaw) return NextResponse.json({ ok: true })

    const chatId = message.chat.id
    const text = textRaw.trim()

    if (text.startsWith('/start')) {
       await sendTelegramMessage(chatId, "Welcome to TajExpense Bot! 💸\n\nLog an expense using:\n`/expense 50 Gas Refilled truck 1`", { parse_mode: 'Markdown' })
       return NextResponse.json({ ok: true })
    }

    if (text.startsWith('/expense')) {
      const args = text.split(' ')
      if (args.length < 3) {
        await sendTelegramMessage(chatId, "❌ Invalid format. Use:\n`/expense 50 Gas Refilled truck 1`", { parse_mode: 'Markdown' })
        return NextResponse.json({ ok: true })
      }

      const amount = parseFloat(args[1])
      if (isNaN(amount) || amount <= 0) {
        await sendTelegramMessage(chatId, "❌ Invalid amount.")
        return NextResponse.json({ ok: true })
      }

      const category = args[2]
      const description = args.slice(3).join(' ')

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const { error } = await supabase.from('expenses').insert({
        amount: amount,
        category: category,
        description: description,
        logged_by: chatId.toString()
      })

      if (error) {
        console.error('[Expense Bot] DB Error:', error)
        await sendTelegramMessage(chatId, "❌ Failed to save expense to database.")
        return NextResponse.json({ ok: true })
      }

      await sendTelegramMessage(chatId, `✅ Expense Logged!\n\nAmount: $${amount.toFixed(2)}\nCategory: ${category}\nDesc: ${description}`)
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Expense Bot] Unhandled error:', err)
    return NextResponse.json({ ok: true })
  }
}
