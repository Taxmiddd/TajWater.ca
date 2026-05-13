import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getSquareClient } from '@/lib/square'
import { Country } from 'square'

export const dynamic = 'force-dynamic'

const FREQ_DAYS: Record<string, number> = { daily: 1, weekly: 7, biweekly: 14, monthly: 30 }

function nextCycleDate(paymentCycle: string): string {
  const days = FREQ_DAYS[paymentCycle] ?? 30
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

function cycleAmountCents(price: number, quantity: number, frequency: string, paymentCycle: string): bigint {
  const deliveryDays = FREQ_DAYS[frequency] ?? 7
  const paymentDays = FREQ_DAYS[paymentCycle] ?? 30
  const deliveriesPerCycle = Math.max(1, Math.round(paymentDays / deliveryDays))
  return BigInt(Math.round(price * quantity * deliveriesPerCycle * 100))
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  try {
    const { sourceId } = await req.json()
    if (!sourceId) return NextResponse.json({ error: 'Missing payment source' }, { status: 400 })

    const db = createServerClient()

    // Fetch the plan
    const { data: plan, error: planErr } = await db
      .from('subscriptions')
      .select('id, user_id, frequency, payment_cycle, quantity, price, plan_link_status, charge_start_date, plan_name')
      .eq('plan_link_token', token)
      .single()

    if (planErr || !plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    if (plan.plan_link_status !== 'pending_card') {
      return NextResponse.json({ error: 'This plan link has already been used' }, { status: 409 })
    }

    // Fetch customer profile
    const { data: profile } = await db
      .from('profiles')
      .select('name, email, phone, delivery_address, square_customer_id')
      .eq('id', plan.user_id)
      .single()

    const square = getSquareClient()
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!

    // 1. Create Square customer if not exists
    let squareCustomerId = profile?.square_customer_id ?? null
    if (!squareCustomerId) {
      const nameParts = (profile?.name ?? '').trim().split(/\s+/)
      const custRes = await square.customers.create({
        givenName: nameParts[0] || undefined,
        familyName: nameParts.slice(1).join(' ') || undefined,
        emailAddress: profile?.email ?? undefined,
        phoneNumber: profile?.phone ?? undefined,
        address: profile?.delivery_address ? {
          addressLine1: profile.delivery_address,
          administrativeDistrictLevel1: 'BC',
          country: Country.Ca,
        } : undefined,
        referenceId: plan.user_id,
        note: 'TajWater custom plan customer',
      })
      squareCustomerId = custRes.customer?.id ?? null
      if (!squareCustomerId) return NextResponse.json({ error: 'Failed to create Square customer' }, { status: 500 })

      // Save Square customer ID to profile
      await db.from('profiles').update({ square_customer_id: squareCustomerId }).eq('id', plan.user_id)
    }

    // 2. Save card on file from the payment nonce
    const cardRes = await square.cards.create({
      idempotencyKey: crypto.randomUUID(),
      sourceId,
      card: {
        customerId: squareCustomerId,
        referenceId: plan.id,
      },
    })
    const savedCard = cardRes.card
    if (!savedCard?.id) return NextResponse.json({ error: 'Failed to save card' }, { status: 500 })

    const isChargeNow = !plan.charge_start_date

    if (isChargeNow) {
      // 3a. Charge the first full payment cycle amount
      const amountCents = cycleAmountCents(plan.price, plan.quantity, plan.frequency, plan.payment_cycle)
      const payRes = await square.payments.create({
        idempotencyKey: crypto.randomUUID(),
        sourceId: savedCard.id,
        customerId: squareCustomerId,
        locationId,
        amountMoney: { amount: amountCents, currency: 'CAD' },
        note: `First payment — ${plan.plan_name ?? 'Custom Plan'} subscription`,
        referenceId: plan.id,
      })
      if (payRes.payment?.status !== 'COMPLETED') {
        return NextResponse.json({ error: 'Payment failed. Please check your card details.' }, { status: 402 })
      }

      // 4a. Update subscription
      await db.from('subscriptions').update({
        square_customer_id: squareCustomerId,
        square_card_id: savedCard.id,
        payment_card_brand: savedCard.cardBrand ?? null,
        payment_card_last4: savedCard.last4 ?? null,
        plan_link_status: 'charged',
        next_payment_at: nextCycleDate(plan.payment_cycle),
      }).eq('id', plan.id)

      // Save card details to profile
      await db.from('profiles').update({
        square_card_id: savedCard.id,
        square_card_brand: savedCard.cardBrand ?? null,
        square_card_last4: savedCard.last4 ?? null,
        square_card_exp_month: savedCard.expMonth ? Number(savedCard.expMonth) : null,
        square_card_exp_year: savedCard.expYear ? Number(savedCard.expYear) : null,
      }).eq('id', plan.user_id)

      return NextResponse.json({ success: true, mode: 'charged' })

    } else {
      // 3b. Charge $0.99 CAD to verify the card
      const verifyRes = await square.payments.create({
        idempotencyKey: crypto.randomUUID(),
        sourceId: savedCard.id,
        customerId: squareCustomerId,
        locationId,
        amountMoney: { amount: BigInt(99), currency: 'CAD' },
        note: 'Card verification — will be refunded',
        referenceId: plan.id,
      })
      const verifyPayment = verifyRes.payment
      if (!verifyPayment?.id || verifyPayment.status !== 'COMPLETED') {
        return NextResponse.json({ error: 'Card verification charge failed. Please check your card details.' }, { status: 402 })
      }

      // 4b. Refund the $0.99 verification charge
      await square.refunds.refundPayment({
        idempotencyKey: crypto.randomUUID(),
        paymentId: verifyPayment.id,
        amountMoney: { amount: BigInt(99), currency: 'CAD' },
        reason: 'Card verification refund',
      })

      // 5b. Update subscription
      await db.from('subscriptions').update({
        square_customer_id: squareCustomerId,
        square_card_id: savedCard.id,
        payment_card_brand: savedCard.cardBrand ?? null,
        payment_card_last4: savedCard.last4 ?? null,
        plan_link_status: 'card_verified',
        next_payment_at: new Date(plan.charge_start_date!).toISOString(),
      }).eq('id', plan.id)

      await db.from('profiles').update({
        square_card_id: savedCard.id,
        square_card_brand: savedCard.cardBrand ?? null,
        square_card_last4: savedCard.last4 ?? null,
        square_card_exp_month: savedCard.expMonth ? Number(savedCard.expMonth) : null,
        square_card_exp_year: savedCard.expYear ? Number(savedCard.expYear) : null,
      }).eq('id', plan.user_id)

      return NextResponse.json({ success: true, mode: 'card_verified' })
    }

  } catch (err) {
    console.error('Plan setup error:', err)
    const msg = err instanceof Error ? err.message : 'Setup failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
