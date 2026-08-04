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

export async function adjustCustomerWallet(
  userId: string,
  delta: number,
  newBalance: number,
  reason: string,
  notifyCustomer: boolean = true,
  internalNotes?: string,
  items?: { name: string; qty: number; unitPrice: number }[]
) {
  const { email, display } = await getAdminDetails()
  const db = createAdminClient()

  // 1. Update Profile Balance
  const { error: pError } = await db.from('profiles').update({ wallet_balance: newBalance }).eq('id', userId)
  if (pError) return { success: false, error: pError.message }

  // Construct full reason for database (including notes)
  const dbReason = internalNotes ? `${reason} | Notes: ${internalNotes}` : reason

  // 2. Log Wallet Transaction
  const { error: txError } = await db.from('wallet_transactions').insert({
    user_id: userId,
    amount: delta,
    balance_after: newBalance,
    transaction_type: delta > 0 ? 'admin_credit' : 'admin_debit',
    reason: dbReason,
    created_by: display,
  })
  if (txError) return { success: false, error: txError.message }

  // 3. Log to Audit
  await db.from('audit_logs').insert({
    admin_email: display,
    action: 'wallet_adjust',
    entity_type: 'wallet',
    entity_id: userId,
    details: { delta, newBalance, reason: dbReason, notifyCustomer }
  })

  // 4. Send email receipt (if enabled)
  if (notifyCustomer) {
    const { data: profile } = await db.from('profiles').select('name, email').eq('id', userId).single()
    if (profile?.email) {
      // NOTE: We pass the original `reason` without the internal notes to the email!
      const html = buildWalletAdjustmentEmail({
        customerName: profile.name || undefined,
        type: delta > 0 ? 'add' : 'deduct',
        amount: Math.abs(delta),
        newBalance,
        reason: reason,
        dateStr: new Date().toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        items,
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
  }

  return { success: true }
}

export async function bulkAdjustCustomerWallets(
  userIds: string[],
  amountToAdd: number,
  reason: string,
  notifyCustomer: boolean = true,
  internalNotes?: string
) {
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

    const { success } = await adjustCustomerWallet(userId, delta, newBalance, reason, notifyCustomer, internalNotes)
    if (success) successCount++
    else failCount++
  }

  return { successCount, failCount }
}

export async function getWalletTransactions(userId: string) {
  const db = createAdminClient() // Service role bypasses RLS
  const { data, error } = await db
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) return []
  return data ?? []
}

export async function getAllWalletTransactions(searchQuery?: string) {
  const db = createAdminClient()
  
  let query = db
    .from('wallet_transactions')
    .select('*, profiles!inner(name, email)')
    .order('created_at', { ascending: false })
    .limit(200)

  if (searchQuery) {
    const sq = `%${searchQuery}%`
    query = query.or(`reason.ilike.${sq},profiles.name.ilike.${sq},profiles.email.ilike.${sq}`)
  }

  const { data, error } = await query
  if (error) return []
  return data ?? []
}

// Leads CRM Actions
export async function getLeads() {
  const db = createAdminClient();
  const { data, error } = await db
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
  return data || [];
}

export async function updateLeadStatus(id: string, status: string) {
  const db = createAdminClient();
  const { error } = await db
    .from('leads')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating lead status:', error);
    return false;
  }
  return true;
}

export async function appendLeadNote(id: string, currentNotes: string | null, newNote: string) {
  const db = createAdminClient();
  const timestamp = new Date().toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
  const updatedNotes = currentNotes 
    ? `${currentNotes}\n\n[${timestamp}] - ${newNote}` 
    : `[${timestamp}] - ${newNote}`;

  const { error } = await db
    .from('leads')
    .update({ notes: updatedNotes })
    .eq('id', id);

  if (error) {
    console.error('Error appending lead note:', error);
    return null;
  }
  return updatedNotes;
}
