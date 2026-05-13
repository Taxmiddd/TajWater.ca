import { createServerClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import PlanSetupClient from './PlanSetupClient'

export const dynamic = 'force-dynamic'

type PlanData = {
  id: string
  frequency: string
  payment_cycle: string
  quantity: number
  price: number
  plan_name: string | null
  custom_delivery_address: string | null
  charge_start_date: string | null
  plan_link_status: string
  product: { name: string; price: number } | { name: string; price: number }[] | null
  profile: { name: string | null; email: string | null; square_customer_id: string | null } | null
}

export default async function PlanSetupPage({ params }: { params: Promise<{ token: string }> }) {
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

  if (error || !data) notFound()

  const plan = data as unknown as PlanData
  const product = Array.isArray(plan.product) ? plan.product[0] : plan.product
  const profile = Array.isArray(plan.profile) ? plan.profile[0] : plan.profile

  return (
    <PlanSetupClient
      token={token}
      plan={{
        id: plan.id,
        frequency: plan.frequency,
        payment_cycle: plan.payment_cycle,
        quantity: plan.quantity,
        price: plan.price,
        plan_name: plan.plan_name,
        custom_delivery_address: plan.custom_delivery_address,
        charge_start_date: plan.charge_start_date,
        plan_link_status: plan.plan_link_status,
        product_name: product?.name ?? 'Water Subscription',
        customer_name: profile?.name ?? null,
        customer_email: profile?.email ?? null,
      }}
    />
  )
}
