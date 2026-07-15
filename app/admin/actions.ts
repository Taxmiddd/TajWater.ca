'use server'

import { createServerClient as createAdminClient } from '@/lib/supabase'
import { createServerClient as createSSRClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { resend, buildWalletAdjustmentEmail } from '@/lib/email'

// Helper to get the logged-in admin's details
async function getAdminDetails() {
  const cookieStore = await cookies()
  const authClient = createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      }
    }
  )

  const { data: { session } } = await authClient.auth.getSession()
  const email = session?.user?.email || 'Unknown Admin'
  let name = 'Admin'

  if (email !== 'Unknown Admin') {
    const db = createAdminClient()
    const { data: admin } = await db.from('admin_users').select('name').eq('email', email).maybeSingle()
    if (admin?.name) name = admin.name
  }

  return { email, name, display: `${name} (${email})` }
}

export async function logAdminAction(action: string, entityType: string, entityId: string | null, details: Record<string, unknown> = {}) {
  const { display } = await getAdminDetails()
  const db = createAdminClient() // Service role bypasses RLS

  await db.from('audit_logs').insert({
    admin_email: display,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details
  })
}

export async function adjustCustomerWallet(userId: string, delta: number, newBalance: number, reason: string) {
  const { email, display } = await getAdminDetails()
  const db = createAdminClient()

  // 1. Update Profile Balance
  const { error: pError } = await db.from('profiles').update({ wallet_balance: newBalance }).eq('id', userId)
  if (pError) return { success: false, error: pError.message }

  // 2. Log Wallet Transaction
  const { error: txError } = await db.from('wallet_transactions').insert({
    user_id: userId,
    amount: delta,
    balance_after: newBalance,
    transaction_type: delta > 0 ? 'admin_credit' : 'admin_debit',
    reason,
    created_by: display,
  })
  if (txError) return { success: false, error: txError.message }

  // 3. Log to Audit
  await db.from('audit_logs').insert({
    admin_email: display,
    action: 'wallet_adjust',
    entity_type: 'wallet',
    entity_id: userId,
    details: { delta, newBalance, reason }
  })

  // 4. Send email receipt
  const { data: profile } = await db.from('profiles').select('name, email').eq('id', userId).single()
  if (profile?.email) {
    const html = buildWalletAdjustmentEmail({
      customerName: profile.name || undefined,
      type: delta > 0 ? 'add' : 'deduct',
      amount: Math.abs(delta),
      newBalance,
      reason,
      dateStr: new Date().toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    })

    const subject = `Wallet Update: ${delta > 0 ? '+' : '-'}$${Math.abs(delta).toFixed(2)} CAD`
    let resendId = null
    let emailStatus = 'sent'
    let emailError = null
    try {
      const result = await resend.emails.send({ from: 'TajWater <info@tajwater.ca>', to: profile.email, subject, html })
      resendId = result.data?.id
    } catch (e) {
      emailStatus = 'failed'
      emailError = String(e)
    }

    await db.from('email_logs').insert({
      user_id: userId,
      recipient_email: profile.email,
      email_type: 'wallet_adjustment',
      subject,
      status: emailStatus,
      resend_id: resendId,
      error_message: emailError,
      sent_by: display,
    })
  }

  return { success: true }
}

export async function bulkAdjustCustomerWallets(userIds: string[], amountToAdd: number, reason: string) {
  const db = createAdminClient()
  let successCount = 0
  let failCount = 0

  for (const userId of userIds) {
    const { data: profile } = await db.from('profiles').select('wallet_balance').eq('id', userId).single()
    if (!profile) { failCount++; continue }
    
    const currentBalance = profile.wallet_balance ?? 0
    const newBalance = Math.max(0, currentBalance + amountToAdd)
    const delta = newBalance - currentBalance

    if (delta === 0 && amountToAdd !== 0) { failCount++; continue } // E.g. deducting from 0

    const { success } = await adjustCustomerWallet(userId, delta, newBalance, reason)
    if (success) successCount++
    else failCount++
  }

  return { successCount, failCount }
}
