import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient as createSsrClient } from '@supabase/ssr'
import { createServerClient } from '@/lib/supabase'
import { resend, buildOutForDeliveryEmail, buildDeliveredEmail } from '@/lib/email'
import { generateInvoicePDF, type InvoiceOrderData } from '@/lib/generateInvoice'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Auth check
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

    const { orderId, newStatus } = await request.json()
    if (!orderId || !newStatus) return NextResponse.json({ error: 'orderId and newStatus required' }, { status: 400 })

    // Check notification preference
    const notifKey = newStatus === 'out_for_delivery' ? 'notif_delivery_reminder' : 'notif_delivery_completed'
    const { data: notifRow } = await db.from('site_content').select('value').eq('key', notifKey).single()
    if (notifRow?.value === 'false') {
      return NextResponse.json({ skipped: true, reason: 'notification disabled' })
    }

    // Fetch order + customer info via separate queries to avoid schema relationship errors
    const { data: fullOrder } = await db
      .from('orders')
      .select('id, total, delivery_address, customer_name, customer_email, payment_method, payment_status, user_id, tax_amount, discount_amount, created_at, tracking_token, zones(name), order_items(quantity, price, products(name))')
      .eq('id', orderId)
      .single()

    if (!fullOrder) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    let profile: { email: string, name: string } | null = null
    if (fullOrder.user_id) {
      const { data: p } = await db
        .from('profiles')
        .select('email, name')
        .eq('id', fullOrder.user_id)
        .single()
      profile = p ?? null
    }
    
    const recipientEmail = profile?.email ?? fullOrder.customer_email
    if (!recipientEmail) return NextResponse.json({ skipped: true, reason: 'no customer email' })

    const name = profile?.name || fullOrder.customer_name || 'Customer'
    const zoneName = Array.isArray((fullOrder as unknown as { zones?: { name: string }[] }).zones)
      ? ((fullOrder as unknown as { zones: { name: string }[] }).zones[0]?.name ?? null)
      : ((fullOrder as unknown as { zones: { name: string } | null }).zones?.name ?? null)

    let html: string
    let subject: string

    // Fetch email subject overrides
    const { data: tmplRows } = await db
      .from('site_content')
      .select('key, value')
      .in('key', ['email_delivery_subject', 'email_delivered_subject'])
    const tmpl: Record<string, string> = {}
    for (const r of (tmplRows ?? [])) tmpl[r.key] = r.value

    if (newStatus === 'out_for_delivery') {
      html = buildOutForDeliveryEmail({ orderId, trackingToken: fullOrder.tracking_token, customerName: name, zone: zoneName })
      subject = tmpl['email_delivery_subject'] || `Your TajWater order is on its way!`
    } else if (newStatus === 'delivered') {
      html = buildDeliveredEmail({ orderId, trackingToken: fullOrder.tracking_token, customerName: name })
      subject = tmpl['email_delivered_subject'] || `Your TajWater order has been delivered!`
    } else {
      return NextResponse.json({ skipped: true, reason: 'status not handled' })
    }

    // Generate invoice PDF if delivered
    let pdfAttachment: { filename: string; content: string } | undefined
    if (newStatus === 'delivered') {
      try {
        const { data: contentRows } = await db.from('site_content').select('key, value')
          .in('key', ['settings_company', 'settings_address', 'settings_phone', 'settings_email'])
        const contentMap: Record<string, string> = {}
        for (const r of (contentRows ?? [])) contentMap[r.key] = r.value

        const invoiceCompanyInfo = {
          name:    contentMap['settings_company'] || 'Taj Water LTD.',
          address: contentMap['settings_address'] || '1770 McLean Ave, Port Coquitlam, BC V3C 4K8, Canada',
          phone:   contentMap['settings_phone']   || process.env.NEXT_PUBLIC_COMPANY_PHONE || '',
          email:   contentMap['settings_email']   || 'billing@tajwater.ca',
          website: 'tajwater.ca'
        }

        type RawItem = { quantity: number; price: number; products: { name: string } | null }
        const invoiceOrder: InvoiceOrderData = {
          id: fullOrder.id,
          total: fullOrder.total,
          payment_status: fullOrder.payment_status,
          payment_method: fullOrder.payment_method,
          delivery_address: fullOrder.delivery_address ?? null,
          customer_name: fullOrder.customer_name ?? null,
          customer_phone: (fullOrder as any).customer_phone || null,
          created_at: fullOrder.created_at || new Date().toISOString(),
          zones: Array.isArray(fullOrder.zones) ? (fullOrder.zones[0] ?? null) : (fullOrder.zones as { name: string } | null) ?? null,
          order_items: ((fullOrder.order_items ?? []) as unknown as RawItem[]).map(i => ({
            id: crypto.randomUUID(),
            quantity: i.quantity,
            price: i.price,
            products: i.products ? { name: i.products.name } : null,
          })),
          profiles: profile ? { name: profile.name ?? '', email: profile.email ?? '' } : null,
          tax_amount: (fullOrder as { tax_amount?: number }).tax_amount ?? null,
          discount_amount: (fullOrder as { discount_amount?: number }).discount_amount ?? null,
        }

        const pdfBuf = await generateInvoicePDF(invoiceOrder, invoiceCompanyInfo)
        pdfAttachment = {
          filename: `INV-${fullOrder.id.slice(-8).toUpperCase()}.pdf`,
          content: pdfBuf.toString('base64'),
        }
      } catch (pdfErr) {
        console.error('Invoice PDF generation failed:', pdfErr)
      }
    }

    await (db as any).from('email_logs').insert({
      user_id: fullOrder.user_id ?? null,
      recipient_email: recipientEmail,
      email_type: newStatus === 'delivered' ? 'delivery_success' : 'out_for_delivery',
      subject,
      status: 'sending',
      sent_by: null,
      metadata: { order_id: orderId },
    })

    try {
      const emailResult = await (resend as any).emails.send({
        from: 'TajWater Billing <billing@tajwater.ca>',
        to: recipientEmail,
        subject,
        html,
        attachments: pdfAttachment ? [{ filename: pdfAttachment.filename, content: pdfAttachment.content }] : undefined,
      })
      
      if (emailResult.data?.id) {
        await db.from('email_logs').update({ status: 'sent', resend_id: emailResult.data.id })
          .match({ recipient_email: recipientEmail, metadata: { order_id: orderId }, status: 'sending' })
      }
    } catch (e) {
       await db.from('email_logs').update({ status: 'failed', error_message: String(e) })
          .match({ recipient_email: recipientEmail, metadata: { order_id: orderId }, status: 'sending' })
       console.error('Email send failed:', e)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('send-status-email error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
