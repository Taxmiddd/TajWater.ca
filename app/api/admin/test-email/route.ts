import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient as createSsrClient } from '@supabase/ssr'
import { createServerClient } from '@/lib/supabase'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // 1. Auth check (Admin only)
    const cookieStore = await cookies()
    const ssrClient = createSsrClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    )
    const { data: { session } } = await ssrClient.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const db = createServerClient()
    const { data: adminRow } = await db
      .from('admin_users')
      .select('id')
      .eq('email', session.user.email)
      .single()
    if (!adminRow) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // 2. Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY)
    const fromEmail = 'TajWater <billing@tajwater.ca>'
    const toEmail = session.user.email ?? 'info@tajwater.ca'

    console.log(`Sending diagnostic email from ${fromEmail} to ${toEmail}...`)

    // 3. Attempt Send
    const result = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'TajWater Email Diagnostic Test',
      html: `
        <div style="font-family:sans-serif;padding:20px;color:#0c2340;">
          <h2>Diagnostic Test Successful!</h2>
          <p>This email confirms that your Resend configuration is working correctly for the domain <strong>tajwater.ca</strong>.</p>
          <hr/>
          <p style="font-size:12px;color:#64748b;">
            Sent at: ${new Date().toISOString()}<br/>
            From: ${fromEmail}<br/>
            Environment: ${process.env.NODE_ENV}
          </p>
        </div>
      `,
    })

    if (result.error) {
      console.error('Resend Diagnostic Error:', result.error)
      return NextResponse.json({ 
        success: false, 
        error: result.error,
        help: "Check if billing@tajwater.ca is verified in your Resend Dashboard."
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Diagnostic email sent to ${toEmail}`,
      resendId: result.data?.id 
    })

  } catch (err) {
    console.error('Diagnostic API Error:', err)
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 })
  }
}
