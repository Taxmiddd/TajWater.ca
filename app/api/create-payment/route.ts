import { NextRequest, NextResponse } from 'next/server'
import { getSquareClient } from '@/lib/square'
import { SquareClient, Country } from 'square'
import { createServerClient } from '@/lib/supabase'
import { rateLimit } from '@/lib/ratelimit'
import { resend, buildOrderConfirmationEmail, buildAdminOrderNotificationEmail } from '@/lib/email'
import { generateInvoicePDF, type InvoiceOrderData } from '@/lib/generateInvoice'

function parseSquareCustomerName(fullName: string | null | undefined) {
  const cleaned = typeof fullName === 'string' ? fullName.trim() : ''
  const parts = cleaned.split(/\s+/).filter(Boolean)
  return {
    givenName: parts[0] || undefined,
    familyName: parts.slice(1).join(' ') || undefined,
  }
}

function buildSquareAddress(address: { street?: string | null; zone?: string | null; postal?: string | null } | null | undefined) {
  if (!address?.street) return undefined
  return {
    addressLine1: address.street,
    locality: address.zone,
    administrativeDistrictLevel1: 'BC',
    postalCode: address.postal ?? undefined,
    country: Country.Ca,
  }
}


async function createSquareCustomer(square: SquareClient, profile: Record<string, string | null>, userId: string, address: Record<string, string | null> | null) {
  const { givenName, familyName } = parseSquareCustomerName(profile.name ?? address?.name)
  const response = await square.customers.create({
    givenName,
    familyName,
    emailAddress: profile.email ?? address?.email ?? undefined,
    phoneNumber: profile.phone ?? address?.phone ?? undefined,
    address: buildSquareAddress(address),
    referenceId: userId,
    note: 'TajWater subscription customer',
  })
  const customer = response.customer
  if (!customer?.id) throw new Error('Unable to create Square customer')
  return customer.id
}

async function saveSquareCard(square: SquareClient, userId: string, sourceId: string, customerId: string, billingName: string | undefined, address: Record<string, string | null> | null) {
  const response = await square.cards.create({
    idempotencyKey: crypto.randomUUID(),
    sourceId,
    card: {
      customerId,
      cardholderName: billingName,
      billingAddress: buildSquareAddress(address),
      referenceId: userId,
    },
  })
  const card = response.card
  if (!card?.id) throw new Error('Unable to save card on file')
  return card
}

export async function POST(req: NextRequest) {
  // Rate limit: max 10 payment creations per IP per minute
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(`create-payment:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { amount, items, address, userId, notes, discountCodeId, discountAmount: clientDiscountAmount, sourceId, paymentMethod = 'square_online' } = await req.json()
    type CartItem = { product_id: string; quantity: number; subscribeFrequency?: 'weekly' | 'biweekly' | 'monthly'; category?: string; name?: string }

    const isOffline = paymentMethod === 'cash_on_delivery' || paymentMethod === 'card_on_delivery'

    const isSubscriptionOrder = Array.isArray(items) && (items as CartItem[]).some(i => !!i.subscribeFrequency || i.category === 'subscription')
    if (!sourceId && !isOffline && !isSubscriptionOrder) {
      return NextResponse.json({ error: 'Payment source token is required' }, { status: 400 })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    if (isSubscriptionOrder && !userId) {
      return NextResponse.json({ error: 'Subscription checkout requires a logged-in account' }, { status: 400 })
    }

    const db = createServerClient()

    // 1. Resolve zone and fetch delivery fee from DB (not from client)
    let zoneId: string | null = null
    let deliveryFee = 0
    if (address?.zone) {
      const { data: zoneRow } = await db
        .from('zones')
        .select('id, delivery_fee')
        .eq('name', address.zone)
        .single()
      zoneId = zoneRow?.id ?? null
      deliveryFee = zoneRow?.delivery_fee ?? 0
    }

    // 2. Fetch fresh product prices and details from DB — client-supplied data is untrusted
    const productIds = items.map((i: { product_id: string }) => i.product_id)
    const { data: products, error: productError } = await db
      .from('products')
      .select('id, price, active, category, subscription_interval, taxable')
      .in('id', productIds)

    if (productError || !products) {
      return NextResponse.json({ error: 'Failed to fetch product prices' }, { status: 500 })
    }

    const productMap: Record<string, { price: number; category: string; subscription_interval: string | null; taxable: boolean }> = {}
    for (const p of products) {
      if (!p.active) {
        return NextResponse.json({ error: `Product is no longer available` }, { status: 400 })
      }
      productMap[p.id] = {
        price: p.price,
        category: p.category,
        subscription_interval: p.subscription_interval ?? null,
        taxable: p.taxable !== false,
      }
    }

    // 3. Recalculate subtotal server-side using DB prices
    let subtotal = 0
    let taxableSubtotal = 0
    for (const item of items as CartItem[]) {
      const pInfo = productMap[item.product_id]
      if (!pInfo) {
        return NextResponse.json({ error: 'Invalid product in cart' }, { status: 400 })
      }
      const lineTotal = pInfo.price * item.quantity
      subtotal += lineTotal
      if (pInfo.taxable) taxableSubtotal += lineTotal
    }

    // 4. Validate discount code server-side if provided
    let discountAmt = 0
    let validatedDiscountCodeId: string | null = null
    if (discountCodeId) {
      const { data: dc } = await db
        .from('discount_codes')
        .select('id, type, value, min_order_amount, max_uses, uses_count, expires_at, active')
        .eq('id', discountCodeId)
        .single()
      if (
        dc && dc.active &&
        !(dc.expires_at && new Date(dc.expires_at) < new Date()) &&
        !(dc.max_uses !== null && dc.uses_count >= dc.max_uses) &&
        !(dc.min_order_amount > 0 && subtotal < dc.min_order_amount)
      ) {
        discountAmt = dc.type === 'percent'
          ? Math.round(subtotal * (dc.value / 100) * 100) / 100
          : Math.min(dc.value, subtotal)
        validatedDiscountCodeId = dc.id
      }
    }

    // 5. BC tax: GST 5% + PST 7% = 12% (applied only on taxable portion of discounted subtotal)
    const discountedSubtotal = Math.max(0, subtotal - discountAmt)
    // Scale taxable subtotal proportionally if discount was applied
    const taxablePortion = subtotal > 0 ? (taxableSubtotal / subtotal) * discountedSubtotal : 0
    const taxAmount = Math.round(taxablePortion * 0.12 * 100) / 100
    const serverTotal = Math.round((discountedSubtotal + deliveryFee + taxAmount) * 100) / 100

    // 6. Reject if client amount differs by more than $0.01
    if (typeof amount === 'number' && Math.abs(amount - serverTotal) > 0.01) {
      return NextResponse.json({ error: 'Price mismatch — please refresh and try again' }, { status: 400 })
    }

    if (serverTotal < 0.50) {
      return NextResponse.json({ error: 'Order total is too low' }, { status: 400 })
    }

    // 7. Build delivery address string
    const deliveryAddress = address
      ? [address.street, address.zone, `BC ${address.postal}`].filter(Boolean).join(', ')
      : null

    // 8. Create the order in Supabase (pending payment)
    const trackingToken = crypto.randomUUID()
    const { data: order, error: orderError } = await db
      .from('orders')
      .insert({
        user_id: userId ?? null,
        status: 'pending',
        payment_status: 'pending',
        total: serverTotal,
        delivery_address: deliveryAddress,
        zone_id: zoneId,
        customer_name: address?.name ?? null,
        customer_email: address?.email ?? null,
        customer_phone: address?.phone ?? null,
        notes: notes ?? null,
        tax_amount: taxAmount,
        discount_code_id: validatedDiscountCodeId,
        discount_amount: discountAmt,
        payment_method: paymentMethod,
        tracking_token: trackingToken,
      })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // 9. Create order_items using server-validated prices
    const orderItems = (items as CartItem[]).map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: productMap[item.product_id].price,
    }))
    const { error: itemsError } = await db.from('order_items').insert(orderItems)
    if (itemsError) console.error('Order items error:', itemsError)

    // 10. Process Square payment ONLY if online
    let squarePaymentId: string | null = null
    let squareCustomerId: string | null = null
    let squareCardId: string | null = null
    let squareCardBrand: string | null = null
    let squareCardLast4: string | null = null
    let squareCardExpMonth: number | null = null
    let squareCardExpYear: number | null = null

    const subscriptionItems = (items as CartItem[]).filter(i => productMap[i.product_id].category === 'subscription')
    if (!isOffline && subscriptionItems.length > 0 && userId) {
      const { data: profile, error: profileError } = await db
        .from('profiles')
        .select('name, email, phone, delivery_address, zone_id, square_customer_id, square_card_id, square_card_brand, square_card_last4, square_card_exp_month, square_card_exp_year')
        .eq('id', userId)
        .single()

      if (profileError || !profile) {
        return NextResponse.json({ error: 'Failed to fetch profile for subscription billing' }, { status: 500 })
      }

      squareCustomerId = profile.square_customer_id ?? await createSquareCustomer(getSquareClient(), profile, userId, address)

      if (sourceId) {
        const billingName: string | undefined = (address?.name || profile.name) || undefined
        const card = await saveSquareCard(getSquareClient(), userId, sourceId as string, squareCustomerId as string, billingName, address)
        squareCardId = card.id ?? null
        squareCardBrand = card.cardBrand ?? null
        squareCardLast4 = card.last4 ?? null
        squareCardExpMonth = card.expMonth ? Number(card.expMonth) : null
        squareCardExpYear = card.expYear ? Number(card.expYear) : null
      } else if (profile.square_card_id) {
        squareCardId = profile.square_card_id
        squareCardBrand = profile.square_card_brand ?? null
        squareCardLast4 = profile.square_card_last4 ?? null
        squareCardExpMonth = profile.square_card_exp_month ?? null
        squareCardExpYear = profile.square_card_exp_year ?? null
      } else {
        return NextResponse.json({ error: 'Subscription billing requires a saved card.' }, { status: 400 })
      }

      if (!squareCardId) {
        return NextResponse.json({ error: 'Failed to save payment card for subscription billing' }, { status: 500 })
      }

      await db.from('profiles').update({
        square_customer_id: squareCustomerId,
        square_card_id: squareCardId,
        square_card_brand: squareCardBrand,
        square_card_last4: squareCardLast4,
        square_card_exp_month: squareCardExpMonth,
        square_card_exp_year: squareCardExpYear,
      }).eq('id', userId)
    }

    if (!isOffline) {
      const square = getSquareClient()
      const amountCents = Math.round(serverTotal * 100)
      const idempotencyKey = crypto.randomUUID()
      const paymentSourceId = squareCardId ?? sourceId!

      const response = await square.payments.create({
        sourceId: paymentSourceId,
        customerId: squareCustomerId ?? undefined,
        idempotencyKey,
        amountMoney: {
          amount: BigInt(amountCents),
          currency: 'CAD',
        },
        locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!,
        referenceId: order.id,
        note: `TajWater order ${order.id.slice(-8).toUpperCase()}`,
      })

      const payment = response.payment
      if (!payment || (payment.status !== 'COMPLETED' && payment.status !== 'APPROVED')) {
        // Payment failed — update order status
        await db.from('orders').update({ payment_status: 'failed' }).eq('id', order.id)
        return NextResponse.json({ error: 'Payment was declined. Please try again.' }, { status: 400 })
      }
      squarePaymentId = payment.id ?? null
    }

    // 11. Store payment details and update status
    await db
      .from('orders')
      .update({
        square_payment_id: squarePaymentId,
        payment_status: isOffline ? 'pending' : 'paid',
        status: 'processing',
      })
      .eq('id', order.id)

    if (userId) {
      const subscribeItems = (items as CartItem[]).filter(i => productMap[i.product_id].category === 'subscription')
      if (subscribeItems.length > 0) {
        const now = new Date()
        const subRows = subscribeItems.map(item => {
          const pInfo = productMap[item.product_id]
          const freq = (pInfo.subscription_interval as string) || 'weekly'
          const nextDelivery = new Date(now)
          nextDelivery.setDate(now.getDate() + (freq === 'weekly' ? 7 : freq === 'biweekly' ? 14 : freq === 'daily' ? 1 : 30))
          return {
            user_id: userId,
            product_id: item.product_id,
            frequency: freq,
            quantity: item.quantity,
            zone_id: zoneId,
            price: pInfo.price,
            status: 'active',
            next_delivery: nextDelivery.toISOString(),
            next_payment_at: nextDelivery.toISOString(),
            square_customer_id: squareCustomerId,
            square_card_id: squareCardId,
            payment_card_brand: squareCardBrand,
            payment_card_last4: squareCardLast4,
          }
        })
        const { error: subError } = await db.from('subscriptions').insert(subRows)
        if (subError) {
          console.error('Subscription creation error:', subError)
          throw new Error('Failed to create subscription')
        }
      }
    }

    // 12. Increment discount code uses_count if applicable
    if (validatedDiscountCodeId) {
      await db.rpc('increment_discount_uses', { code_id: validatedDiscountCodeId })
    }

    // 13. Decrement stock for each item
    const { data: stockItems } = await db.from('order_items').select('product_id, quantity').eq('order_id', order.id)
    if (stockItems) {
      await Promise.all(stockItems.map((item: { product_id: string; quantity: number }) =>
        db.rpc('decrement_stock', { product_id: item.product_id, amount: item.quantity })
      ))
    }

    // 14. Send order confirmation email with invoice PDF
    try {
      const { data: fullOrder } = await db
        .from('orders')
        .select('id, total, delivery_address, customer_name, customer_email, payment_method, payment_status, user_id, tax_amount, discount_amount, created_at, tracking_token, zones(name), order_items(quantity, price, products(name))')
        .eq('id', order.id)
        .single()

      if (fullOrder) {
        let profile = null
        if (fullOrder.user_id) {
          const { data: p } = await db.from('profiles').select('name, email').eq('id', fullOrder.user_id).maybeSingle()
          profile = p
        }
        const toEmail = profile?.email ?? fullOrder.customer_email ?? address?.email ?? null

        // Check notification preference + fetch email templates + admin settings
        const { data: contentRows } = await db.from('site_content').select('key, value')
          .in('key', [
            'notif_order_confirmation', 'email_confirmation_subject', 'email_confirmation_greeting',
            'notif_admin_order', 'email_admin_order_subject', 'settings_email',
            'settings_company', 'settings_phone', 'settings_address'
          ])
        const contentMap: Record<string, string> = {}
        for (const r of (contentRows ?? [])) contentMap[r.key] = r.value
        const confirmNotifEnabled = contentMap['notif_order_confirmation'] !== 'false'
        const adminNotifEnabled = contentMap['notif_admin_order'] === 'true'
        const adminEmail = contentMap['settings_email'] || process.env.NEXT_PUBLIC_COMPANY_EMAIL

        const invoiceCompanyInfo = {
          name:    contentMap['settings_company'] || 'Taj Water LTD.',
          address: contentMap['settings_address'] || '1770 McLean Ave, Port Coquitlam, BC V3C 4K8, Canada',
          phone:   contentMap['settings_phone']   || process.env.NEXT_PUBLIC_COMPANY_PHONE || '',
          email:   contentMap['settings_email']   || 'billing@tajwater.ca',
          website: 'tajwater.ca'
        }

        if (toEmail && confirmNotifEnabled) {
          // resend proxy from @/lib/email is used here
          const fromEmail = 'TajWater Billing <billing@tajwater.ca>'
          type RawItem = { quantity: number; price: number; products: { name: string } | null }
          const subject = contentMap['email_confirmation_subject'] || `Your TajWater Order #${fullOrder.id.slice(0, 8).toUpperCase()} is Confirmed`
          const html = buildOrderConfirmationEmail({
            id: fullOrder.id,
            trackingToken: fullOrder.tracking_token,
            customerName: profile?.name ?? fullOrder.customer_name ?? 'Valued Customer',
            items: ((fullOrder.order_items ?? []) as unknown as RawItem[]).map(i => ({ name: i.products?.name ?? 'Product', qty: i.quantity, price: i.price })),
            total: fullOrder.total,
            deliveryAddress: fullOrder.delivery_address ?? null,
            zone: (fullOrder.zones as { name?: string } | null)?.name ?? null,
            greeting: contentMap['email_confirmation_greeting'] || undefined,
            taxAmount: (fullOrder as { tax_amount?: number }).tax_amount ?? undefined,
            discountAmount: (fullOrder as { discount_amount?: number }).discount_amount ?? undefined,
          })

          // Generate invoice PDF attachment
          let pdfAttachment: { filename: string; content: string } | undefined
          try {
            const invoiceOrder: InvoiceOrderData = {
              id: fullOrder.id,
              total: fullOrder.total,
              payment_status: fullOrder.payment_status,
              payment_method: fullOrder.payment_method,
              delivery_address: fullOrder.delivery_address ?? null,
              customer_name: fullOrder.customer_name ?? null,
              customer_phone: (fullOrder as { customer_phone?: string }).customer_phone || null,
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

          let resendId: string | undefined
          let emailStatus = 'sent'
          let emailError: string | undefined
          try {
            const emailResult = await resend.emails.send({
              from: fromEmail,
              to: toEmail,
              subject,
              html,
              attachments: pdfAttachment ? [{ filename: pdfAttachment.filename, content: pdfAttachment.content }] : undefined,
            })
            resendId = emailResult.data?.id
          } catch (e) {
            emailStatus = 'failed'
            emailError = String(e)
          }

          await db.from('email_logs').insert({
            user_id: fullOrder.user_id ?? null,
            recipient_email: toEmail,
            email_type: 'order_confirmation',
            subject,
            status: emailStatus,
            resend_id: resendId ?? null,
            error_message: emailError ?? null,
            sent_by: null,
            metadata: { order_id: fullOrder.id },
          })
          // 14b. Send admin notification email
          if (adminEmail && adminNotifEnabled) {
            try {
              const adminSubject = contentMap['email_admin_order_subject'] || `New TajWater Order Received! 🔔`
              const adminHtml = buildAdminOrderNotificationEmail({
                id: fullOrder.id,
                customerName: profile?.name ?? fullOrder.customer_name ?? 'Valued Customer',
                items: ((fullOrder.order_items ?? []) as unknown as RawItem[]).map(i => ({ name: i.products?.name ?? 'Product', qty: i.quantity, price: i.price })),
                total: fullOrder.total,
                deliveryAddress: fullOrder.delivery_address ?? null,
                zone: (fullOrder.zones as { name?: string } | null)?.name ?? null,
              })

              await resend.emails.send({
                from: fromEmail,
                to: adminEmail,
                subject: adminSubject,
                html: adminHtml,
              })
            } catch (adminEmailErr) {
              console.error('Admin order notification failed:', adminEmailErr)
            }
          }
        }
      }
    } catch (emailErr) {
      // Email errors should not fail the payment
      console.error('Post-payment email error:', emailErr)
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      serverTotal,
      taxAmount,
      deliveryFee,
      discountAmount: discountAmt,
    })
  } catch (err: unknown) {
    let message = 'Failed to create payment'
    const sqError = err as { errors?: Array<{ code?: string; detail?: string }> }
    // Handle Square API errors gracefully
    if (sqError.errors && Array.isArray(sqError.errors) && sqError.errors.length > 0) {
      const sqErr = sqError.errors[0]
      if (sqErr.code === 'INVALID_CARD_DATA') {
        message = 'Invalid card data. Please check your card details and try again.'
      } else if (sqErr.detail) {
        message = sqErr.detail
      }
    } else if (err instanceof Error && err.message.includes('INVALID_CARD_DATA')) {
      message = 'Invalid card data. Please check your card details and try again.'
    } else if (err instanceof Error) {
      message = err.message
    }
    
    console.error('create-payment error:', err)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
