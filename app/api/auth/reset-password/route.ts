import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { resend, buildResetPasswordEmail } from '@/lib/email'
import { rateLimit } from '@/lib/ratelimit'

export async function POST(req: NextRequest) {
  // Rate limiting to prevent abuse
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(`reset-password:${ip}`, 3, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
  }

  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const db = createServerClient()
    
    // We need the admin role to generate a link directly
    // Ensure SUPABASE_SERVICE_ROLE_KEY is set in your env
    const supabaseAdmin = require('@supabase/supabase-js').createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Generate the reset password link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
      }
    })

    if (linkError) {
      console.error('generateLink error:', linkError)
      // We don't want to leak whether the email exists or not to prevent user enumeration
      // so we always return success even if the email doesn't exist.
      return NextResponse.json({ success: true })
    }

    // Try to get the user's name if they have a profile
    let customerName = ''
    if (linkData.user) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('name')
        .eq('id', linkData.user.id)
        .single()
      if (profile?.name) customerName = profile.name
    }

    // Build the email HTML
    const html = buildResetPasswordEmail({
      resetLink: linkData.properties.action_link,
      customerName: customerName || undefined
    })

    // Send the email via Resend
    const { error: emailError } = await resend.emails.send({
      from: `TajWater <${process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'info@tajwater.ca'}>`,
      to: [email],
      subject: 'Reset your TajWater password',
      html,
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Reset password api error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
