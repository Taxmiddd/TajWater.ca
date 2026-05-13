import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient as createSsrClient } from '@supabase/ssr'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    // Auth check — admin only
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

    const body = await req.json()
    const {
      user_id,
      product_id,
      plan_name,
      frequency,
      quantity,
      price,
      zone_id,
      custom_delivery_address,
      next_delivery,
      admin_notes,
    } = body

    if (!user_id || !product_id || !frequency || !quantity || price == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await db
      .from('subscriptions')
      .insert({
        user_id,
        product_id,
        frequency,
        quantity: Number(quantity),
        price: Number(price),
        zone_id: zone_id || null,
        status: 'active',
        next_delivery: next_delivery || null,
        custom_plan: true,
        plan_name: plan_name || null,
        custom_delivery_address: custom_delivery_address || null,
        admin_notes: admin_notes || null,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Create custom plan error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error('Create custom plan API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
