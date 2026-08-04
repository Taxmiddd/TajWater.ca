import { NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { buildWalletAdjustmentEmail, resend } from '@/lib/email'
import sharp from 'sharp'

export const dynamic = 'force-dynamic'

async function sendTelegramMessage(chatId: string | number, text: string, options?: Record<string, any>) {
  const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim()
  
  if (!token) {
    console.error('[TG Bot] TELEGRAM_BOT_TOKEN not set!')
    return
  }

  const payload: any = { chat_id: chatId, text, ...options }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!data.ok) console.error('[TG Bot] sendMessage failed:', JSON.stringify(data))
}

// ─── DB-based auth: look up registered Telegram user ─────────────────────────
async function getTelegramUser(supabase: SupabaseClient<any>, chatId: number) {
  const { data } = await supabase
    .from('profiles')
    .select('id, name, email, telegram_role, wallet_balance, empty_jars_held')
    .eq('telegram_chat_id', chatId)
    .single()
  return data ?? null
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
      const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim()
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
      } else if (data === 'stock_truck') {
        await sendTelegramMessage(chatId, "To log bottles loaded onto your truck, send:\n`/stock 50`", { parse_mode: 'Markdown' })
      } else if (data === 'return_empties') {
        await sendTelegramMessage(chatId, "To log empty bottles returned from a customer, send:\n`/return john@email.com 5`", { parse_mode: 'Markdown' })
      } else if (data === 'customer_history') {
        await sendTelegramMessage(chatId, "To view a customer's last 5 transactions, send:\n`/history john@email.com`", { parse_mode: 'Markdown' })
      } else if (data === 'my_stats') {
        await sendTelegramMessage(chatId, "Please type `/stats` to view your current inventory and shift stats.", { parse_mode: 'Markdown' })
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
      const supabaseReply = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
      const replyUser = await getTelegramUser(supabaseReply, chatId)
      if (replyUser?.telegram_role === 'admin') {
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
                text: text,
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

    
    // Handle /register command — links Telegram account to a profile by email
    if (text.startsWith('/register')) {
      const args = text.split(' ')
      if (args.length < 2) {
        await sendTelegramMessage(chatId, "❌ Please provide your account email.\nExample: `/register your@email.com`", { parse_mode: 'Markdown' })
        return NextResponse.json({ ok: true })
      }
      const regEmail = args[1].toLowerCase()
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

      const { data: regProfile, error: regErr } = await supabase
        .from('profiles')
        .select('id, name, telegram_role, telegram_chat_id')
        .eq('email', regEmail)
        .single()

      if (regErr || !regProfile) {
        await sendTelegramMessage(chatId, `❌ No account found with email: ${regEmail}\nMake sure you use the email you signed up with.`)
        return NextResponse.json({ ok: true })
      }

      if (regProfile.telegram_chat_id && regProfile.telegram_chat_id !== chatId) {
        await sendTelegramMessage(chatId, `⚠️ This email is already linked to a different Telegram account. Contact your admin.`)
        return NextResponse.json({ ok: true })
      }

      // If the profile is in admin_users, force their role to 'admin'
      // Otherwise, default to 'driver' (or keep their existing role if already set)
      let newRole = regProfile.telegram_role

      const { data: adminEntry } = await supabase
        .from('admin_users')
        .select('role')
        .eq('email', regEmail)
        .single()
        
      if (adminEntry) {
        newRole = 'admin'
      } else if (!newRole) {
        newRole = 'driver'
      }

      await supabase.from('profiles').update({ telegram_chat_id: chatId, telegram_role: newRole }).eq('id', regProfile.id)

      const roleLabel = newRole === 'admin' ? '👑 Admin' : '🚚 Driver'
      await sendTelegramMessage(chatId,
        `✅ *Welcome, ${regProfile.name}!*\n\nYour Telegram account is now linked.\nRole: ${roleLabel}\n\nType /start to open the menu.`,
        { parse_mode: 'Markdown' }
      )
      return NextResponse.json({ ok: true })
    }


    // Handle /invoice command for manual invoicing (admin only)
    if (text.startsWith('/invoice')) {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
      const invoiceUser = await getTelegramUser(supabase, chatId)
      if (!invoiceUser || invoiceUser.telegram_role !== 'admin') {
        await sendTelegramMessage(chatId, "❌ Admin access required. Your Telegram account is not linked to a TajWater admin account. Contact your manager.")
        return NextResponse.json({ ok: true })
      }
      const args = text.split(' ')
      if (args.length < 4) {
        await sendTelegramMessage(chatId, "❌ Invalid format. Use: /invoice customer@email.com 50 Description")
        return NextResponse.json({ ok: true })
      }
      const email = args[1].toLowerCase()
      const amount = parseFloat(args[2])
      const description = args.slice(3).join(' ')

      if (isNaN(amount) || amount <= 0) {
        await sendTelegramMessage(chatId, "❌ Invalid amount.")
        return NextResponse.json({ ok: true })
      }

      const { data: profile } = await supabase.from('profiles').select('name').eq('email', email).single()

      // Generate a short ID for the payment link
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
      let suffix = ''
      for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
      const paymentId = `TW-${suffix}`

      // Create a payment link in the DB
      const { data: pLink, error: pErr } = await supabase.from('payment_links').insert({
        id: paymentId,
        customer_email: email,
        customer_name: profile?.name || null,
        amount: amount,
        description: description,
        status: 'pending',
        currency: 'CAD',
      }).select().single()

      if (pErr) {
        console.error('[TG Bot] Error creating payment link:', pErr)
        await sendTelegramMessage(chatId, "❌ Failed to create invoice.")
        return NextResponse.json({ ok: true })
      }

      // Send the email via Resend
      try {
        const { buildPaymentLinkEmail } = await import('@/lib/email')
        const payUrl = `${process.env.NEXT_PUBLIC_PAY_URL || 'https://pay.tajwater.ca'}/${paymentId}`
        await resend.emails.send({
          from: `TajWater Billing <${process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'billing@tajwater.ca'}>`,
          to: email,
          subject: `Your TajWater Payment Request — $${amount.toFixed(2)} CAD`,
          html: buildPaymentLinkEmail({
            paymentId: paymentId,
            amount: amount,
            description: description,
            customerName: profile?.name || undefined,
            paymentUrl: payUrl,
          }),
        })
        await sendTelegramMessage(chatId, `✅ Invoice generated & emailed to ${email} — $${amount.toFixed(2)}\n\nLink: ${payUrl}`)
      } catch (err) {
        console.error('[TG Bot] Failed to send invoice email:', err)
        await sendTelegramMessage(chatId, `✅ Invoice generated for ${email} — $${amount.toFixed(2)}, but failed to send email.\n\nLink: https://pay.tajwater.ca/${paymentId}`)
      }

      return NextResponse.json({ ok: true })
    }

    // Handle /lead command
    if (text.startsWith('/lead')) {
      const args = text.split(' ')
      if (args.length < 3) {
        await sendTelegramMessage(chatId, "❌ Invalid format. Use: /lead Name Contact Notes")
        return NextResponse.json({ ok: true })
      }
      const name = args[1]
      const contactInfo = args[2]
      const notes = args.slice(3).join(' ')

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      await supabase.from('leads').insert({
        name: name,
        contact_info: contactInfo,
        notes: notes,
        created_by: chatId.toString()
      })

      await sendTelegramMessage(chatId, `✅ Lead ${name} saved to CRM.`)
      return NextResponse.json({ ok: true })
    }

    // Handle /expense command
    if (text.startsWith('/expense')) {
      const args = text.split(' ')
      if (args.length < 4) {
        await sendTelegramMessage(chatId, "❌ Invalid format. Use: /expense 50 Gas Refilled truck")
        return NextResponse.json({ ok: true })
      }
      const amount = parseFloat(args[1])
      const category = args[2]
      const description = args.slice(3).join(' ')

      if (isNaN(amount) || amount <= 0) {
        await sendTelegramMessage(chatId, "❌ Invalid amount.")
        return NextResponse.json({ ok: true })
      }

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      await supabase.from('expenses').insert({
        amount: amount,
        category: category,
        description: description,
        logged_by: chatId.toString()
      })

      await sendTelegramMessage(chatId, `✅ Expense of $${amount.toFixed(2)} logged for ${category}.`)
      return NextResponse.json({ ok: true })
    }
    
    // Handle /crm command for customers
    if (text.startsWith('/crm')) {
      const args = text.split(' ')
      if (args.length < 2) {
        await sendTelegramMessage(chatId, "❌ Use: /crm customer@email.com")
        return NextResponse.json({ ok: true })
      }
      const email = args[1].toLowerCase()

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const { data: profile } = await supabase.from('profiles').select('*').eq('email', email).single()
      if (!profile) {
        await sendTelegramMessage(chatId, `❌ No customer found with email: ${email}`)
        return NextResponse.json({ ok: true })
      }

      const dispenserText = profile.dispenser_subscription_active 
        ? `Yes (${profile.dispenser_quantity || 1}x ${profile.dispenser_type || 'Standard'})`
        : 'No'

      await sendTelegramMessage(chatId, `👤 *Customer CRM: ${profile.name}*
Email: ${profile.email}
Balance: ${profile.wallet_balance}
Jars Held: ${profile.empty_jars_held || 0}
Dispenser Sub: ${dispenserText}
Notes: ${profile.customer_notes || 'None'}`, { parse_mode: 'Markdown' })
      return NextResponse.json({ ok: true })
    }

    // Handle /start command for interactive menu
    if (text.startsWith('/start')) {
      const supabaseStart = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
      const startUser = await getTelegramUser(supabaseStart, chatId)

      // Show menu even if not registered; soft-prompt registration
      if (!startUser) {
        await sendTelegramMessage(chatId,
          `👋 Welcome to TajWater Bot!\n\nYou can log deliveries, check customer history, and more.\n\n💡 *Optional:* Link your account to enable full features:\n\`/register your@email.com\``,
          { parse_mode: 'Markdown' }
        )
        // Still show the menu
        await sendTelegramMessage(chatId, `What would you like to do?`, {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "🚚 Start Shift", callback_data: "start_shift" },
                { text: "🛑 End Shift", callback_data: "end_shift" }
              ],
              [
                { text: "📦 Log Delivery", callback_data: "log_delivery" }
              ],
              [
                { text: "📥 Stock Truck", callback_data: "stock_truck" },
                { text: "🔄 Return Empties", callback_data: "return_empties" }
              ],
              [
                { text: "📜 Customer History", callback_data: "customer_history" },
                { text: "📊 My Stats", callback_data: "my_stats" }
              ]
            ]
          }
        })
        return NextResponse.json({ ok: true })
      }

      await sendTelegramMessage(chatId, `Welcome back, ${startUser.name}! What would you like to do?`, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🚚 Start Shift", callback_data: "start_shift" },
              { text: "🛑 End Shift", callback_data: "end_shift" }
            ],
            [
              { text: "📦 Log Delivery", callback_data: "log_delivery" }
            ],
            [
              { text: "📥 Stock Truck", callback_data: "stock_truck" },
              { text: "🔄 Return Empties", callback_data: "return_empties" }
            ],
            [
              { text: "📜 Customer History", callback_data: "customer_history" },
              { text: "📊 My Stats", callback_data: "my_stats" }
            ]
          ]
        }
      })
      return NextResponse.json({ ok: true })
    }

    // Handle /topup command for admins
    if (text.startsWith('/topup')) {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
      const topupUser = await getTelegramUser(supabase, chatId)
      if (!topupUser || topupUser.telegram_role !== 'admin') {
        await sendTelegramMessage(chatId, "❌ Admin access required. Your Telegram account is not linked to a TajWater admin account. Contact your manager.")
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

    if (text.startsWith('/assign_dispenser')) {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
      const assignUser = await getTelegramUser(supabase, chatId)
      if (!assignUser || assignUser.telegram_role !== 'admin') {
        await sendTelegramMessage(chatId, "❌ Admin access required. Your Telegram account is not linked to a TajWater admin account. Contact your manager.")
        return NextResponse.json({ ok: true })
      }
      const args = text.split(' ');
      if (args.length < 3) {
        await sendTelegramMessage(chatId, "❌ Invalid format. Use:\n`/assign_dispenser customer@email.com 2 Bottom Load`", { parse_mode: 'Markdown' })
        return NextResponse.json({ ok: true });
      }
      
      const email = args[1].toLowerCase();
      const qty = parseInt(args[2]);
      const type = args.slice(3).join(' ') || 'Standard';

      if (isNaN(qty) || qty <= 0) {
        await sendTelegramMessage(chatId, "❌ Invalid quantity.")
        return NextResponse.json({ ok: true })
      }

      await supabase.from('profiles').update({ 
        dispenser_subscription_active: true,
        dispenser_quantity: qty,
        dispenser_type: type
      }).eq('email', email);
      
      await sendTelegramMessage(chatId, `✅ Assigned ${qty}x ${type} dispenser(s) to ${email}`);
      return NextResponse.json({ ok: true });
    }

    // Handle /broadcast command for admins
    if (text.startsWith('/broadcast')) {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
      const broadcastUser = await getTelegramUser(supabase, chatId)
      if (!broadcastUser || broadcastUser.telegram_role !== 'admin') {
        await sendTelegramMessage(chatId, "❌ Admin access required. Your Telegram account is not linked to a TajWater admin account. Contact your manager.")
        return NextResponse.json({ ok: true })
      }

      const messageToBroadcast = text.replace('/broadcast', '').trim()
      if (!messageToBroadcast) {
        await sendTelegramMessage(chatId, "❌ Please provide a message. Example:\n`/broadcast Traffic delay on Main St.`", { parse_mode: 'Markdown' })
        return NextResponse.json({ ok: true })
      }

      // Fetch all registered Telegram users from DB
      const { data: registeredUsers } = await supabase
        .from('profiles')
        .select('telegram_chat_id')
        .not('telegram_chat_id', 'is', null)

      let sentCount = 0
      for (const user of registeredUsers ?? []) {
        if (user.telegram_chat_id && user.telegram_chat_id !== chatId) {
          await sendTelegramMessage(user.telegram_chat_id, `📢 *ADMIN BROADCAST*\n\n${messageToBroadcast}`, { parse_mode: 'Markdown' })
          sentCount++
        }
      }

      await sendTelegramMessage(chatId, `✅ Broadcast sent to ${sentCount} registered user(s).`)
      return NextResponse.json({ ok: true })
    }

    // Handle /history command
    if (text.startsWith('/history')) {
      const args = text.split(' ')
      if (args.length < 2) {
        await sendTelegramMessage(chatId, "❌ Please provide an email. Example:\n`/history customer@email.com`", { parse_mode: 'Markdown' })
        return NextResponse.json({ ok: true })
      }
      const email = args[1].toLowerCase()

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      let { data: profile } = await supabase.from('profiles').select('id, name, wallet_balance').eq('email', email).single()
      if (!profile) {
        const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({ perPage: 1000 })
        const authUser = authUsers?.find(u => u.email?.toLowerCase() === email)
        if (authUser) {
          const { data: profileById } = await supabase.from('profiles').select('id, name, wallet_balance').eq('id', authUser.id).single()
          if (profileById) profile = profileById
        }
      }
      if (!profile) {
        await sendTelegramMessage(chatId, `❌ No customer found with email: ${email}`)
        return NextResponse.json({ ok: true })
      }

      const { data: txs } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5)

      let txLines = ''
      if (txs && txs.length > 0) {
        txLines = txs.map(t => {
          const date = new Date(t.created_at).toLocaleDateString()
          const amountStr = t.amount > 0 ? `+${t.amount}` : `${t.amount}`
          return `• ${date}: $${amountStr} (${t.transaction_type})`
        }).join('\n')
      } else {
        txLines = 'No recent transactions.'
      }

      await sendTelegramMessage(chatId, `📜 *History for ${profile.name}*\nBalance: $${profile.wallet_balance?.toFixed(2) ?? '0.00'}\n\n*Last 5 Transactions:*\n${txLines}`, { parse_mode: 'Markdown' })
      return NextResponse.json({ ok: true })
    }

    // Handle /return command
    if (text.startsWith('/return')) {
      const args = text.split(' ')
      if (args.length < 3) {
        await sendTelegramMessage(chatId, "❌ Invalid format. Use:\n`/return customer@email.com 5`", { parse_mode: 'Markdown' })
        return NextResponse.json({ ok: true })
      }
      const email = args[1].toLowerCase()
      const qty = parseInt(args[2])

      if (isNaN(qty) || qty <= 0) {
        await sendTelegramMessage(chatId, "❌ Invalid quantity.")
        return NextResponse.json({ ok: true })
      }

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      
      // Decrement jars
      let { data: prof } = await supabase.from('profiles').select('id, empty_jars_held').eq('email', email).single()
      if (!prof) {
        const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({ perPage: 1000 })
        const authUser = authUsers?.find(u => u.email?.toLowerCase() === email)
        if (authUser) {
          const { data: profileById } = await supabase.from('profiles').select('id, empty_jars_held').eq('id', authUser.id).single()
          if (profileById) prof = profileById
        }
      }
      if (prof) {
         await supabase.from('profiles').update({ empty_jars_held: Math.max(0, (prof.empty_jars_held || 0) - qty) }).eq('id', prof.id)
      }

      await supabase.from('inventory_logs').insert({
        driver_id: chatId.toString(),
        action_type: 'picked_up_empty',
        quantity: qty,
        customer_email: email
      })

      await sendTelegramMessage(chatId, `✅ Logged ${qty} empty bottles returned from ${email}.`)
      return NextResponse.json({ ok: true })
    }

    // Handle /stock command
    if (text.startsWith('/stock')) {
      const args = text.split(' ')
      if (args.length < 2) {
        await sendTelegramMessage(chatId, "❌ Please provide a quantity. Example:\n`/stock 50`", { parse_mode: 'Markdown' })
        return NextResponse.json({ ok: true })
      }
      const qty = parseInt(args[1])
      if (isNaN(qty) || qty <= 0) {
        await sendTelegramMessage(chatId, "❌ Invalid quantity.")
        return NextResponse.json({ ok: true })
      }

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      await supabase.from('inventory_logs').insert({
        driver_id: chatId.toString(),
        action_type: 'loaded_full',
        quantity: qty
      })

      await sendTelegramMessage(chatId, `✅ Added ${qty} full bottles to your truck inventory.`)
      return NextResponse.json({ ok: true })
    }

    // Handle /stats command
    if (text.startsWith('/stats')) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Fetch driver inventory for today
      const { data: inv } = await supabase
        .from('inventory_logs')
        .select('*')
        .eq('driver_id', chatId.toString())
        .gte('created_at', today.toISOString())

      let loaded = 0
      let delivered = 0
      let empties = 0
      if (inv) {
        for (const log of inv) {
          if (log.action_type === 'loaded_full') loaded += log.quantity
          if (log.action_type === 'delivered_full') delivered += log.quantity
          if (log.action_type === 'picked_up_empty') empties += log.quantity
        }
      }
      const currentStock = loaded - delivered

      await sendTelegramMessage(chatId, `📊 *Your Daily Stats*\n\nTruck Stock:\n- Loaded Today: ${loaded}\n- Delivered: ${delivered}\n- Current Full: ${currentStock}\n- Empties Picked Up: ${empties}`, { parse_mode: 'Markdown' })
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
    let locationData = null
    if (message.location) {
      locationData = message.location
    }
    if (message.photo && message.photo.length > 0) {
      const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim()
      // Get the largest photo size
      const photo = message.photo[message.photo.length - 1]
      const fileRes = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${photo.file_id}`)
      const fileData = await fileRes.json()
      if (fileData.ok && fileData.result.file_path) {
         // Upload to Supabase Storage
         const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
         const imgRes = await fetch(`https://api.telegram.org/file/bot${token}/${fileData.result.file_path}`);
         const imgArrayBuffer = await imgRes.arrayBuffer();
         const imgBuffer = Buffer.from(imgArrayBuffer);
         
         // Compress to webp using sharp
         const webpBuffer = await sharp(imgBuffer).webp({ quality: 80 }).toBuffer();
         
         const fileName = `${Date.now()}-${photo.file_id}.webp`;
         await supabase.storage.from('delivery-proofs').upload(fileName, webpBuffer, { contentType: 'image/webp' });
         const { data: publicUrlData } = supabase.storage.from('delivery-proofs').getPublicUrl(fileName);
         proofUrl = publicUrlData.publicUrl;
  
         console.log(`[TG Bot] Received and compressed proof of delivery photo: ${proofUrl}`)
      }
    }

    // Init Supabase with service role
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Find customer profile — first try by profiles.email, then fall back to auth.users
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, name, email, wallet_balance, empty_jars_held')
      .eq('email', customerEmail)
      .single()

    // Fallback: some profiles have no email field set — look up via auth.users instead
    if (profileError || !profile) {
      const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({ perPage: 1000 })
      const authUser = authUsers?.find(u => u.email?.toLowerCase() === customerEmail)
      if (authUser) {
        const { data: profileById } = await supabase
          .from('profiles')
          .select('id, name, email, wallet_balance, empty_jars_held')
          .eq('id', authUser.id)
          .single()
        if (profileById) {
          profile = { ...profileById, email: profileById.email ?? customerEmail }
          profileError = null
        }
      }
    }

    if (profileError || !profile) {
      console.error('[TG Bot] Profile not found for:', customerEmail, profileError)
      await sendTelegramMessage(chatId, `❌ No customer found with email: ${customerEmail}`)
      return NextResponse.json({ ok: true })
    }


    // Fetch all active products
    const { data: allProducts, error: productsError } = await supabase
      .from('products')
      .select('id, name, price')
      .eq('active', true)

    // Fetch delivery zones
    const { data: allZones, error: zonesError } = await supabase
      .from('delivery_zones')
      .select('id, name, price')
      .eq('active', true)
      
    // Fallback if delivery_zones doesn't exist or errors (we can also check 'zones')
    let zonesToUse = allZones || [];
    if (zonesError) {
      const { data: altZones } = await supabase.from('zones').select('id, name, delivery_fee');
      if (altZones) {
        zonesToUse = altZones.map(z => ({ id: z.id, name: `Delivery ${z.name}`, price: z.delivery_fee }));
      }
    }

    if (productsError || !allProducts?.length) {
      console.error('[TG Bot] Products error:', productsError)
      await sendTelegramMessage(chatId, `❌ Could not load products from database.`)
      return NextResponse.json({ ok: true })
    }

    // Match each parsed item to a product or zone
    const matched: { product: { id: string, name: string, price: number }; quantity: number }[] = []
    const unmatched: string[] = []

    for (const item of parsedItems) {
      let match: any = null;
      const kw = item.keyword.toLowerCase();

      // If the keyword contains "delivery", try matching a zone first
      if (kw.includes('delivery') && zonesToUse.length > 0) {
        let zoneMatch = zonesToUse.find(z => kw.includes(z.name.toLowerCase()));
        if (!zoneMatch) {
           const words = kw.split(/\s+/).filter(w => w.length > 3 && w !== 'delivery');
           for (const w of words) {
              zoneMatch = zonesToUse.find(z => z.name.toLowerCase().includes(w));
              if (zoneMatch) break;
           }
        }
        if (zoneMatch) {
           match = { id: zoneMatch.id, name: zoneMatch.name.startsWith('Delivery') ? zoneMatch.name : `Delivery ${zoneMatch.name}`, price: zoneMatch.price };
        }
      }

      // If no zone match, try matching as a regular product
      if (!match) {
        match = findProduct(item.keyword, allProducts);
      }

      if (match) {
        // Merge duplicates
        const existing = matched.find((m) => m.product.id === match!.id)
        if (existing) existing.quantity += item.qty
        else matched.push({ product: match, quantity: item.qty })
      } else {
        unmatched.push(`"${item.keyword}"`)
      }
    }

    if (matched.length === 0) {
      await sendTelegramMessage(chatId,
        `❌ None of the items matched any products or zones in the database.\nUnrecognized: ${unmatched.join(', ')}\n\nTry using names like: refill, dispenser, paper cups, Delivery Burnaby`)
      return NextResponse.json({ ok: true })
    }

    // Calculate total
    const totalCost = matched.reduce((sum, m) => sum + m.product.price * m.quantity, 0)
    const currentBalance = profile.wallet_balance ?? 0

    console.log(`[TG Bot] Matched:`, matched.map(m => `${m.quantity}x ${m.product.name} @ $${m.product.price}`).join(', '))
    console.log(`[TG Bot] Total: $${totalCost.toFixed(2)}, Balance: $${currentBalance.toFixed(2)}`)

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
    if (proofUrl) insertData.proof_url = proofUrl;
    if (locationData) insertData.location = locationData;

    await supabase.from('wallet_transactions').insert(insertData)

    // Log to inventory if they delivered bottles
    const bottleMatch = matched.find(m => m.product.name.toLowerCase().includes('bottle'))
    if (bottleMatch) {
      // Increment jars held by customer
      await supabase.from('profiles').update({ empty_jars_held: (profile.empty_jars_held || 0) + bottleMatch.quantity }).eq('id', profile.id)
      // Log inventory movement for driver stats
      await supabase.from('inventory_logs').insert({
        driver_id: chatId.toString(),
        action_type: 'delivered_full',
        quantity: bottleMatch.quantity,
        customer_email: customerEmail
      })
    }

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
    
    // Smart Jars Reminder — use post-delivery count
    const updatedJarsHeld = (profile.empty_jars_held || 0) + (bottleMatch?.quantity ?? 0)
    if (updatedJarsHeld > 5) {
      unmatchedNote += `\n\n⚠️ *JARS WARNING*\nCustomer is now holding ${updatedJarsHeld} empty jars! Please collect them.`
    }
    
    // Low balance warning
    if (newBalance < 0) {
      unmatchedNote += `\n\n🚨 *NEGATIVE BALANCE WARNING*\nCustomer balance is $${newBalance.toFixed(2)}. This account is in the negative. Please remind them to top up immediately!`
    } else if (newBalance < 15) {
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
