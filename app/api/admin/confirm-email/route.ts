import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { createServerClient as createSsrClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 })

    // Verify caller is a logged-in admin by reading their session from cookies
    // (Do NOT trust adminEmail from the request body — it can be spoofed)
    const ssrClient = createSsrClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: () => {},
        },
      }
    )

    const { data: { session } } = await ssrClient.auth.getSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized — not logged in' }, { status: 401 })
    }

    // Check the session user is in admin_users
    const db = createServerClient()
    const { data: admin } = await db
      .from('admin_users')
      .select('email')
      .eq('email', session.user.email)
      .maybeSingle()

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden — not an admin account' }, { status: 403 })
    }

    // Force-confirm the target user's email using the admin API (service role)
    const { error } = await db.auth.admin.updateUserById(userId, { email_confirm: true })
    if (error) {
      console.error('confirm-email updateUserById error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('confirm-email error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
