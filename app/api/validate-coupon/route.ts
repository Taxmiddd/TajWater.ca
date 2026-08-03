import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    const db = createServerClient()

    const { data: dc } = await db
      .from('discount_codes')
      .select('id, type, value, min_order_amount, max_uses, uses_count, expires_at, active')
      .eq('code', code.toUpperCase().trim())
      .single()

    if (!dc) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 })
    }

    if (!dc.active) {
      return NextResponse.json({ error: 'This coupon code is no longer active' }, { status: 400 })
    }

    if (dc.expires_at && new Date(dc.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This coupon code has expired' }, { status: 400 })
    }

    if (dc.max_uses !== null && dc.uses_count >= dc.max_uses) {
      return NextResponse.json({ error: 'This coupon code has reached its usage limit' }, { status: 400 })
    }

    const orderSubtotal = typeof subtotal === 'number' ? subtotal : 0
    if (dc.min_order_amount > 0 && orderSubtotal < dc.min_order_amount) {
      return NextResponse.json(
        { error: `This code requires a minimum order of $${dc.min_order_amount.toFixed(2)}` },
        { status: 400 }
      )
    }

    const discountAmount =
      dc.type === 'percent'
        ? Math.round(orderSubtotal * (dc.value / 100) * 100) / 100
        : Math.min(dc.value, orderSubtotal)

    return NextResponse.json({
      id: dc.id,
      code: code.toUpperCase().trim(),
      type: dc.type,
      value: dc.value,
      discountAmount,
    })
  } catch (err) {
    console.error('[validate-coupon]', err)
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 })
  }
}
