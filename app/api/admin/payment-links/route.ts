import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// ── List all payment links (admin) ────────────────────────────────────────────
export async function GET() {
  const db = createServerClient()
  const { data, error } = await db
    .from('payment_links')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(300)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

// ── Create a new payment link (admin) ─────────────────────────────────────────
function generateId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Omit ambiguous chars
  let suffix = ''
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)]
  }
  return `TW-${suffix}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { description, amount, customer_name, customer_phone, customer_email, internal_note, line_items } = body

    if (!description?.trim()) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 })
    }
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt < 0.5) {
      return NextResponse.json({ error: 'Amount must be at least $0.50' }, { status: 400 })
    }

    const db = createServerClient()

    // Generate a unique ID (retry up to 5 times on collision)
    let id = ''
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = generateId()
      const { data: existing } = await db.from('payment_links').select('id').eq('id', candidate).maybeSingle()
      if (!existing) { id = candidate; break }
    }
    if (!id) {
      return NextResponse.json({ error: 'Failed to generate unique ID. Please try again.' }, { status: 500 })
    }

    const { data, error } = await db
      .from('payment_links')
      .insert({
        id,
        description: description.trim(),
        amount: Math.round(amt * 100) / 100,
        currency: 'CAD',
        customer_name: customer_name?.trim() || null,
        customer_phone: customer_phone?.trim() || null,
        customer_email: customer_email?.trim() || null,
        internal_note: internal_note?.trim() || null,
        line_items: line_items && Array.isArray(line_items) ? line_items : null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Optionally send payment link email via Resend
    if (data.customer_email) {
      try {
        const { resend, buildPaymentLinkEmail } = await import('@/lib/email')
        const payUrl = `${process.env.NEXT_PUBLIC_PAY_URL || 'https://pay.tajwater.ca'}/${id}`
        await resend.emails.send({
          from: 'TajWater Billing <billing@tajwater.ca>',
          to: data.customer_email,
          subject: `Your TajWater Payment Request — $${data.amount.toFixed(2)} CAD`,
          html: buildPaymentLinkEmail({
            paymentId: id,
            amount: data.amount,
            description: data.description,
            customerName: data.customer_name || undefined,
            paymentUrl: payUrl,
          }),
        })
      } catch (emailErr) {
        console.error('Payment link email failed:', emailErr)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('Create payment link error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
