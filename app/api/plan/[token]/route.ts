import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const db = createServerClient()

  const { data, error } = await db
    .from('subscriptions')
    .select(`
      id, frequency, payment_cycle, quantity, price,
      plan_name, custom_delivery_address, charge_start_date, plan_link_status,
      product:products(name, price),
      profile:profiles(name, email, square_customer_id)
    `)
    .eq('plan_link_token', token)
    .single()

  if (error) {
    console.error('Plan fetch error:', error)
    return NextResponse.json({ error: error.message || 'Database error' }, { status: 500 })
  }
  if (!data) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })

  return NextResponse.json(data)
}
