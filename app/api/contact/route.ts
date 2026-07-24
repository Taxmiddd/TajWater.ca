import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: Request) {
  const { name, email, phone, subject, message } = await req.json()

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const db = createServerClient()

  // Format message with contact info header so admin sees who sent it
  const fullMessage = `**From:** ${name}\n**Email:** ${email}${phone ? `\n**Phone:** ${phone}` : ''}\n\n---\n\n${message}`

  // Try to find user_id by email (search profiles via auth)
  // We search auth.users via service-role — profiles doesn't store email directly
  let userId: string | null = null
  try {
    const { data: users } = await db.auth.admin.listUsers()
    const match = users?.users?.find((u) => u.email === email)
    if (match) userId = match.id
  } catch {
    // If lookup fails, just leave user_id null
  }

  const { error } = await db
    .from('tickets')
    .insert({
      user_id: userId,
      subject,
      message: fullMessage,
      status: 'open',
    })

  if (error) {
    console.error('Contact ticket insert error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }

  // Send Push Notification to Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const adminChatIds = (process.env.TELEGRAM_ADMIN_CHAT_IDS || '').split(',')

  if (botToken && adminChatIds.length > 0) {
    const notifyText = `🚨 *New Support Ticket* 🚨\n\n*From:* ${name} (${email})\n*Subject:* ${subject}\n\n*Message:*\n${message}`
    
    // Fire and forget telegram notification
    Promise.all(adminChatIds.map(async (chatId) => {
      if (!chatId.trim()) return
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId.trim(), text: notifyText, parse_mode: 'Markdown' }),
        })
      } catch (err) {
        console.error('Failed to notify telegram admin:', err)
      }
    }))
  }

  return NextResponse.json({ success: true })
}
