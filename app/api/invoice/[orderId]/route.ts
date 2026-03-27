import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { createServerClient as createSsrClient } from '@supabase/ssr'
import { generateInvoicePDF, type InvoiceOrderData } from '@/lib/generateInvoice'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params

  // Auth check — user must own the order or be an admin
  const ssrClient = createSsrClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: () => {},
      },
    }
  )
  const { data: { session } } = await ssrClient.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createServerClient()

  // Check if user is admin
  const { data: adminRow } = await db
    .from('admin_users')
    .select('id')
    .eq('email', session.user.email ?? '')
    .maybeSingle()

  // 1. Fetch order with related data (excluding profiles join which fails in schema cache)
  const { data: order, error: orderError } = await db
    .from('orders')
    .select(`
      id, user_id, total, payment_status, payment_method, delivery_address, customer_name, customer_phone, created_at,
      tax_amount, discount_amount, notes,
      zones ( name ),
      order_items ( id, quantity, price, products ( name ) )
    `)
    .eq('id', orderId)
    .single()

  if (orderError || !order) {
    console.error('Invoice API Order Error:', orderError)
    return NextResponse.json({ error: 'Order not found', details: orderError?.message }, { status: 404 })
  }

  // 2. Fetch profile separately if user_id exists
  let profileData = null
  const anyOrder = order as any
  if (anyOrder.user_id) {
    const { data: p } = await db
      .from('profiles')
      .select('name, email')
      .eq('id', anyOrder.user_id)
      .maybeSingle()
    profileData = p
  }

  const orderData: InvoiceOrderData = {
    ...(order as any),
    profiles: profileData
  }

  if (!adminRow && anyOrder.user_id && anyOrder.user_id !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Fetch company info from site_content
  const { data: contentRows } = await db
    .from('site_content')
    .select('key, value')
    .in('key', ['settings_company', 'settings_address', 'settings_phone', 'settings_email'])

  const content: Record<string, string> = {}
  for (const row of (contentRows ?? [])) {
    content[row.key] = row.value
  }

  const companyInfo = {
    name:    content['settings_company'] ?? 'Taj Water LTD.',
    address: content['settings_address'] ?? '1770 McLean Ave, Port Coquitlam, BC V3C 4K8, Canada',
    phone:   content['settings_phone']   ?? process.env.NEXT_PUBLIC_COMPANY_PHONE ?? '',
    email:   content['settings_email']   ?? 'billing@tajwater.ca',
    website: 'tajwater.ca',
  }

  const pdfBuffer = await generateInvoicePDF(orderData as InvoiceOrderData, companyInfo)
  const invoiceNum = 'INV-' + orderId.slice(-8).toUpperCase()

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type':        'application/pdf',
      'Content-Disposition': `attachment; filename="${invoiceNum}.pdf"`,
    },
  })
}
