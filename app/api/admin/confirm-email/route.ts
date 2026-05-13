import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { userId, adminEmail } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 })

    const db = createServerClient()

    // Verify caller is an admin
    const { data: admin } = await db.from('admin_users').select('email').eq('email', adminEmail).single()
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    const { error } = await db.auth.admin.updateUserById(userId, { email_confirm: true })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('confirm-email error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
