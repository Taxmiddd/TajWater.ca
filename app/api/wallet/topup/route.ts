import { NextRequest, NextResponse } from 'next/server'
import { getSquareClient } from '@/lib/square'
import { createServerClient } from '@/lib/supabase'
import { createServerClient as createSsrClient } from '@supabase/ssr'
import { rateLimit } from '@/lib/ratelimit'
import crypto from 'crypto'

// Fixed recharge packages: [CAD charged, credits added to wallet]
const RECHARGE_PACKAGES: Record<number, number> = {
  100: 107,
  200: 220,
  300: 330,
  400: 450,
  500: 600,
}

export async function POST(req: NextRequest) {
  // Rate limit
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(`wallet-topup:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
  }

  try {
    const { amount } = await req.json()

    // Validate that amount is exactly one of the allowed package values
    if (typeof amount !== 'number' || !RECHARGE_PACKAGES[amount]) {
      return NextResponse.json(
        { error: 'Invalid package. Please choose one of: $100, $200, $300, $400, or $500.' },
        { status: 400 }
      )
    }

    const creditsToAdd = RECHARGE_PACKAGES[amount]

    const ssrClient = createSsrClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: () => { },
        },
      }
    )
    const { data: { session } } = await ssrClient.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id
    
    const db = createServerClient()

    // Fetch user profile for Square details
    const { data: profile } = await db
      .from('profiles')
      .select('wallet_balance, square_customer_id, square_card_id')
      .eq('id', userId)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    if (!profile.square_card_id || !profile.square_customer_id) {
      return NextResponse.json(
        { error: 'No saved card found. Please make a regular purchase to save a card first.' },
        { status: 400 }
      )
    }

    // Charge the CAD amount via Square
    const square = getSquareClient()
    const amountCents = Math.round(amount * 100)
    const idempotencyKey = crypto.randomUUID()

    const response = await square.payments.create({
      sourceId: profile.square_card_id,
      customerId: profile.square_customer_id,
      idempotencyKey,
      amountMoney: {
        amount: BigInt(amountCents),
        currency: 'CAD',
      },
      locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!,
      note: `TajWater Wallet Recharge — $${amount} package (${creditsToAdd} credits)`,
    })

    const payment = response.payment
    if (!payment || (payment.status !== 'COMPLETED' && payment.status !== 'APPROVED')) {
      return NextResponse.json({ error: 'Payment was declined. Please try again.' }, { status: 400 })
    }

    // Add the bonus credits (not just the raw dollar amount)
    const newBalance = (profile.wallet_balance ?? 0) + creditsToAdd
    const { error: updateError } = await db
      .from('profiles')
      .update({ wallet_balance: newBalance })
      .eq('id', userId)

    if (updateError) {
      console.error('Failed to update wallet balance:', updateError)
      return NextResponse.json(
        { error: 'Payment succeeded but balance update failed. Contact support.' },
        { status: 500 }
      )
    }

    // Log Transaction
    await db.from('wallet_transactions').insert({
      user_id: userId,
      amount: creditsToAdd,
      balance_after: newBalance,
      transaction_type: 'top_up',
      reason: `Wallet Recharge — $${amount} package (${creditsToAdd} credits)`,
      created_by: 'Customer',
    })

    return NextResponse.json({ success: true, newBalance, creditsAdded: creditsToAdd })

  } catch (err: unknown) {
    console.error('wallet-topup error:', err)
    const sqError = err as { errors?: Array<{ detail?: string; code?: string }> }
    let message = 'Failed to process recharge'
    if (sqError.errors && sqError.errors.length > 0) {
      message = sqError.errors[0].detail || sqError.errors[0].code || message
    } else if (err instanceof Error) {
      message = err.message
    }
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
