import { NextRequest, NextResponse } from 'next/server'
import { getSquareClient } from '@/lib/square'
import { createServerClient } from '@/lib/supabase'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { sourceId } = await req.json()
    const upperId = id.toUpperCase()

    if (!sourceId) {
      return NextResponse.json({ error: 'Payment source token is required' }, { status: 400 })
    }

    const db = createServerClient()
    
    // 1. Fetch link
    const { data: link, error: linkError } = await db
      .from('payment_links')
      .select('*')
      .eq('id', upperId)
      .single()

    if (linkError || !link) {
      return NextResponse.json({ error: 'Payment link not found' }, { status: 404 })
    }

    // 2. Validate status
    if (link.status === 'paid') {
      return NextResponse.json({ error: 'This payment has already been processed.' }, { status: 400 })
    }

    // 3. Process Square payment
    const square = getSquareClient()
    const amountCents = Math.round(link.amount * 100)
    const idempotencyKey = crypto.randomUUID()

    const response = await square.payments.create({
      sourceId,
      idempotencyKey,
      amountMoney: {
        amount: BigInt(amountCents),
        currency: 'CAD',
      },
      locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!,
      referenceId: link.id,
      note: `TajWater Custom Payment ${link.id}`,
    })

    const payment = response.payment
    if (!payment || (payment.status !== 'COMPLETED' && payment.status !== 'APPROVED')) {
      return NextResponse.json({ error: 'Payment was declined by the card issuer.' }, { status: 400 })
    }

    // 4. Update status in DB
    const { error: updateError } = await db
      .from('payment_links')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        square_payment_id: payment.id,
      })
      .eq('id', link.id)

    if (updateError) {
      console.error('Failed to update DB after successful Square charge:', updateError)
      // Even if DB update fails, charge went through. Return success with warning.
    }

    // 5. Send emails via Resend
    try {
      const { resend, buildPaymentReceiptEmail } = await import('@/lib/email')
      
      const receiptHtml = buildPaymentReceiptEmail({
        paymentId: link.id,
        amount: link.amount,
        description: link.description,
        customerName: link.customer_name || undefined,
        paidAt: new Date().toISOString()
      })

      // Send to customer if email exists
      if (link.customer_email) {
        await resend.emails.send({
          from: 'TajWater Billing <billing@tajwater.ca>',
          to: link.customer_email,
          subject: `Payment Receipt — $${link.amount.toFixed(2)} CAD (Ref: ${link.id})`,
          html: receiptHtml
        })
      }

      // Send to admin team
      await resend.emails.send({
        from: 'TajWater System <billing@tajwater.ca>',
        to: ['billing@tajwater.ca', 'tajwaterca@gmail.com'],
        subject: `Paid: Custom Payment ${link.id} for $${link.amount.toFixed(2)} CAD`,
        html: receiptHtml // Admins can just receive the receipt copy
      })

    } catch (e) {
      console.error('Failed to send payment receipt/notifications:', e)
    }

    const receiptUrl = payment.receiptUrl
    return NextResponse.json({ success: true, receiptUrl })
  } catch (err) {
    console.error('Process payment error:', err)
    return NextResponse.json({ error: 'Internal server error while processing payment.' }, { status: 500 })
  }
}
