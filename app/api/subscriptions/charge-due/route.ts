import { NextRequest, NextResponse } from 'next/server'
import { getSquareClient } from '@/lib/square'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const AUTH_HEADER = 'x-recurring-charge-secret'

function addNextInterval(dateString: string, frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly') {
  const date = new Date(dateString)
  const days =
    frequency === 'daily'    ? 1  :
    frequency === 'weekly'   ? 7  :
    frequency === 'biweekly' ? 14 : 30
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get(AUTH_HEADER)
  if (!secret || secret !== process.env.RECURRING_SUBSCRIPTION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createServerClient()
  const now = new Date().toISOString()

  const { data: subscriptions, error: subsError } = await db
    .from('subscriptions')
    .select('id, user_id, product_id, quantity, frequency, next_delivery, price, zone_id')
    .eq('status', 'active')
    .lte('next_delivery', now)

  if (subsError) {
    console.error('Subscription charge lookup failed:', subsError)
    return NextResponse.json({ error: 'Failed to load due subscriptions' }, { status: 500 })
  }

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ message: 'No subscriptions are due for billing', processed: [] })
  }

  const userIds = Array.from(new Set(subscriptions.map((sub: any) => sub.user_id).filter(Boolean)))
  const productIds = Array.from(new Set(subscriptions.map((sub: any) => sub.product_id).filter(Boolean)))
  const zoneIds = Array.from(new Set(subscriptions.map((sub: any) => sub.zone_id).filter(Boolean)))

  const [{ data: profiles }, { data: products }, { data: zones }] = await Promise.all([
    db.from('profiles').select('id, name, email, phone, delivery_address, zone_id, square_customer_id, square_card_id').in('id', userIds),
    db.from('products').select('id, name, price, active').in('id', productIds),
    db.from('zones').select('id, delivery_fee').in('id', zoneIds),
  ])

  const profileMap = new Map((profiles ?? []).map((profile: any) => [profile.id, profile]))
  const productMap = new Map((products ?? []).map((product: any) => [product.id, product]))
  const zoneMap = new Map((zones ?? []).map((zone: any) => [zone.id, zone.delivery_fee ?? 0]))
  const square = getSquareClient()
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!

  const processed: Array<{ subscription_id: string; success: boolean; reason?: string; order_id?: string }> = []

  for (const subscription of subscriptions as any[]) {
    const profile = profileMap.get(subscription.user_id)
    const product = productMap.get(subscription.product_id)

    if (!profile) {
      processed.push({ subscription_id: subscription.id, success: false, reason: 'No profile found' })
      continue
    }

    if (!product || !product.active) {
      processed.push({ subscription_id: subscription.id, success: false, reason: 'Product unavailable' })
      continue
    }

    if (!profile.square_customer_id || !profile.square_card_id) {
      processed.push({ subscription_id: subscription.id, success: false, reason: 'No saved payment method' })
      continue
    }

    const zoneFee = zoneMap.get(subscription.zone_id) ?? 0
    const subtotal = Number(subscription.price) * Number(subscription.quantity)
    const taxAmount = Math.round(subtotal * 0.12 * 100) / 100
    const serverTotal = Math.round((subtotal + zoneFee + taxAmount) * 100) / 100

    const trackingToken = crypto.randomUUID()
    const { data: order, error: orderError } = await db.from('orders').insert({
      user_id: profile.id,
      status: 'pending',
      payment_status: 'pending',
      total: serverTotal,
      delivery_address: profile.delivery_address ?? null,
      zone_id: subscription.zone_id ?? null,
      customer_name: profile.name ?? null,
      customer_email: profile.email ?? null,
      customer_phone: profile.phone ?? null,
      notes: `Automated recurring charge for subscription ${subscription.id}`,
      tax_amount: taxAmount,
      discount_code_id: null,
      discount_amount: 0,
      payment_method: 'square_online',
      tracking_token: trackingToken,
    }).select('id').single()

    if (orderError || !order) {
      console.error('Failed to create recurring order:', orderError)
      processed.push({ subscription_id: subscription.id, success: false, reason: 'Order creation failed' })
      continue
    }

    const { error: itemsError } = await db.from('order_items').insert({
      order_id: order.id,
      product_id: subscription.product_id,
      quantity: subscription.quantity,
      price: subscription.price,
    })
    if (itemsError) {
      console.error('Failed to insert recurring order item:', itemsError)
    }

    const amountCents = Math.round(serverTotal * 100)
    let paymentFailed = false

    try {
      const response = await square.payments.create({
        sourceId: profile.square_card_id,
        customerId: profile.square_customer_id,
        idempotencyKey: crypto.randomUUID(),
        amountMoney: {
          amount: BigInt(amountCents),
          currency: 'CAD',
        },
        locationId,
        referenceId: order.id,
        note: `TajWater recurring subscription ${subscription.id}`,
      })
      const payment = response.payment
      if (!payment || (payment.status !== 'COMPLETED' && payment.status !== 'APPROVED')) {
        paymentFailed = true
      } else {
        await db.from('orders').update({ square_payment_id: payment.id, payment_status: 'paid', status: 'processing' }).eq('id', order.id)
      }
    } catch (err) {
      console.error('Recurring payment error for subscription', subscription.id, err)
      paymentFailed = true
    }

    if (paymentFailed) {
      await db.from('orders').update({ payment_status: 'failed' }).eq('id', order.id)
      processed.push({ subscription_id: subscription.id, success: false, reason: 'Payment failed', order_id: order.id })
      continue
    }

    const { data: stockItems } = await db.from('order_items').select('product_id, quantity').eq('order_id', order.id)
    if (stockItems) {
      await Promise.all(stockItems.map((item: { product_id: string; quantity: number }) =>
        db.rpc('decrement_stock', { product_id: item.product_id, amount: item.quantity })
      ))
    }

    const nextDelivery = addNextInterval(subscription.next_delivery, subscription.frequency)
    await db.from('subscriptions').update({ next_delivery: nextDelivery, next_payment_at: nextDelivery }).eq('id', subscription.id)

    processed.push({ subscription_id: subscription.id, success: true, order_id: order.id })
  }

  return NextResponse.json({ processed })
}
