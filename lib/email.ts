import { Resend } from 'resend'

// Lazy initialization — prevents build failures when RESEND_API_KEY is absent
let _resend: Resend | undefined
export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    if (!_resend) {
      _resend = new Resend(process.env.RESEND_API_KEY)
    }
    return (_resend as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export function buildOrderConfirmationEmail(order: {
  id: string
  trackingToken?: string | null
  customerName: string
  items: { name: string; qty: number; price: number }[]
  total: number
  deliveryAddress: string | null
  zone: string | null
  greeting?: string
  taxAmount?: number
  deliveryFee?: number
  discountAmount?: number
}): string {
  const shortId   = 'TW-' + order.id.slice(-8).toUpperCase()
  const subtotal   = order.items.reduce((s, i) => s + i.qty * i.price, 0)
  const discount   = order.discountAmount ?? 0
  const tax        = order.taxAmount ?? 0
  const delivery   = order.deliveryFee ?? Math.max(0, parseFloat((order.total - subtotal + discount - tax).toFixed(2)))
  const greetText = order.greeting ?? `Dear ${order.customerName},\n\nWe are pleased to confirm that your order **${shortId}** has been successfully received and is now being processed by our team. Thank you for choosing TajWater for your premium hydration needs.`
  const formalGreet = greetText
    .replace(/\{\{customer_name\}\}/g, order.customerName)
    .replace(/\{\{order_id\}\}/g, shortId)
    .replace(/\{\{total\}\}/g, `$${order.total.toFixed(2)}`)
    .replace(/\n/g, '<br/>')

  const _co = {
    email: process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'info@tajwater.ca',
    url:   process.env.NEXT_PUBLIC_SITE_URL      ?? 'https://tajwater.ca',
    phone: process.env.NEXT_PUBLIC_COMPANY_PHONE ?? '',
    year:  new Date().getFullYear(),
  }

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Order Confirmation - TajWater</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<div style="display:none;overflow:hidden;max-height:0;">Order ${shortId} Confirmation &middot; $${order.total.toFixed(2)}&nbsp;&zwnj;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;"><tr><td style="padding:40px 16px;" align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.05);border:1px solid #e2e8f0;">
  <tr><td style="padding:40px 48px 32px;text-align:center;background-color:#0c4a6e;background-image:linear-gradient(135deg,#0c4a6e 0%,#075985 100%);">
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.7);letter-spacing:3px;text-transform:uppercase;">TajWater Premium</p>
    <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Order Confirmation</h1>
  </td></tr>
  <tr><td style="padding:48px 48px 32px;">
    <p style="margin:0 0 24px;font-size:16px;color:#334155;line-height:1.6;">${formalGreet}</p>

    <div style="background:#f1f5f9;border-radius:12px;padding:24px;margin-bottom:32px;border:1px solid #e2e8f0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <p style="margin:0;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Reference Number</p>
            <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#0c4a6e;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">${shortId}</p>
          </td>
          <td style="text-align:right;vertical-align:middle;">
            <a href="${_co.url}/track/${order.id}${order.trackingToken ? `?token=${order.trackingToken}` : ''}" style="display:inline-block;background:#0c4a6e;color:#ffffff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">Track Your Order &rarr;</a>
          </td>
        </tr>
      </table>
    </div>

    <h3 style="margin:0 0 16px;font-size:14px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:1px;">Order Summary</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f1f5f9;border-radius:12px;overflow:hidden;margin-bottom:32px;">
      <thead>
        <tr style="background:#f8fafc;">
          <th style="padding:12px 16px;text-align:left;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;border-bottom:1px solid #f1f5f9;">Description</th>
          <th style="padding:12px 16px;text-align:center;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;border-bottom:1px solid #f1f5f9;">Qty</th>
          <th style="padding:12px 16px;text-align:right;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;border-bottom:1px solid #f1f5f9;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(i => `
          <tr>
            <td style="padding:14px 16px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#1e293b;">${i.name}</td>
            <td style="padding:14px 16px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#64748b;text-align:center;">${i.qty}</td>
            <td style="padding:14px 16px;border-bottom:1px solid #f1f5f9;font-size:14px;font-weight:600;color:#1e293b;text-align:right;">$${(i.qty * i.price).toFixed(2)}</td>
          </tr>`).join('')}
        ${discount > 0 ? `<tr><td colspan="2" style="padding:10px 16px;text-align:right;font-size:13px;color:#059669;">Discount</td><td style="padding:10px 16px;text-align:right;font-size:13px;font-weight:600;color:#059669;">&#8722;$${discount.toFixed(2)}</td></tr>` : ''}
        ${delivery > 0.01 ? `<tr><td colspan="2" style="padding:10px 16px;text-align:right;font-size:13px;color:#64748b;">Delivery Fee</td><td style="padding:10px 16px;text-align:right;font-size:13px;font-weight:600;color:#1e293b;">$${delivery.toFixed(2)}</td></tr>` : ''}
        ${tax > 0 ? `<tr><td colspan="2" style="padding:10px 16px;text-align:right;font-size:13px;color:#64748b;">Tax (GST + PST)</td><td style="padding:10px 16px;text-align:right;font-size:13px;font-weight:600;color:#1e293b;">$${tax.toFixed(2)}</td></tr>` : ''}
        <tr style="background:#f8fafc;">
          <td colspan="2" style="padding:16px;text-align:right;font-size:15px;font-weight:700;color:#0f172a;border-top:1px solid #e2e8f0;">Total Amount</td>
          <td style="padding:16px;text-align:right;font-size:20px;font-weight:800;color:#0c4a6e;border-top:1px solid #e2e8f0;">$${order.total.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    ${order.deliveryAddress ? `
    <h3 style="margin:0 0 12px;font-size:14px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:1px;">Delivery Details</h3>
    <div style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:32px;border:1px solid #f1f5f9;">
      <p style="margin:0;font-size:14px;color:#334155;line-height:1.6;">${order.deliveryAddress}${order.zone ? `<br/><span style="font-size:12px;color:#64748b;">Region: ${order.zone}</span>` : ''}</p>
      <p style="margin:12px 0 0;font-size:13px;color:#64748b;">Estimated delivery: <strong>1&ndash;2 business days</strong></p>
    </div>` : ''}

    <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;">If you have any questions, please contact our support team at <a href="mailto:support@tajwater.ca" style="color:#0c4a6e;font-weight:600;text-decoration:none;">support@tajwater.ca</a>.</p>
  </td></tr>
  <tr><td style="background:#f1f5f9;padding:32px 48px;text-align:center;border-top:1px solid #e2e8f0;">
    <p style="margin:0 0 8px;font-size:12px;color:#64748b;font-weight:600;"><a href="${_co.url}" style="color:#0c4a6e;text-decoration:none;">tajwater.ca</a>&nbsp;&middot;&nbsp;<a href="mailto:${_co.email}" style="color:#64748b;text-decoration:none;">Support</a></p>
    <p style="margin:0;font-size:11px;color:#94a3b8;letter-spacing:0.5px;">&copy; ${_co.year} TajWater &middot; Metro Vancouver, BC</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`
}

// ─── Shared email shell ───────────────────────────────────────────────────────
function shell(bodyHtml: string, preview = '', coEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'info@tajwater.ca', coUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tajwater.ca', coPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE ?? ''): string {
  const yr = new Date().getFullYear()
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>TajWater Premium</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
${preview ? `<div style="display:none;overflow:hidden;max-height:0;">${preview}&nbsp;&zwnj;</div>` : ''}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;"><tr><td style="padding:40px 16px;" align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.05);border:1px solid #e2e8f0;">
  <tr><td style="padding:40px 48px 32px;text-align:center;background-color:#0c4a6e;background-image:linear-gradient(135deg,#0c4a6e 0%,#075985 100%);">
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.7);letter-spacing:3px;text-transform:uppercase;">TajWater Premium</p>
    <p style="margin:0;font-size:32px;">💧</p>
  </td></tr>
  <tr><td style="padding:48px 48px 32px;">${bodyHtml}</td></tr>
  <tr><td style="background:#f1f5f9;padding:32px 48px;text-align:center;border-top:1px solid #e2e8f0;">
    <p style="margin:0 0 8px;font-size:12px;color:#64748b;font-weight:600;"><a href="${coUrl}" style="color:#0c4a6e;text-decoration:none;">tajwater.ca</a>&nbsp;&middot;&nbsp;<a href="mailto:${coEmail}" style="color:#64748b;text-decoration:none;">Support</a>${coPhone ? `&nbsp;&middot;&nbsp;<a href="tel:${coPhone}" style="color:#64748b;text-decoration:none;">Contact</a>` : ''}</p>
    <p style="margin:0;font-size:11px;color:#94a3b8;letter-spacing:0.5px;">&copy; ${yr} TajWater &middot; Metro Vancouver, BC</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`
}

// ─── Welcome ──────────────────────────────────────────────────────────────────
export function buildWelcomeEmail({ customerName, message }: { customerName: string; message?: string }): string {
  const coEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'info@tajwater.ca'
  const coUrl   = process.env.NEXT_PUBLIC_SITE_URL      ?? 'https://tajwater.ca'
  const msgText = (message ?? `Dear ${customerName},\n\nWelcome to TajWater. Your account is now active, and you are ready to experience Metro Vancouver's premium water delivery service.`)
    .replace(/\{\{customer_name\}\}/g, customerName)
    .replace(/\n/g, '<br/>')

  return shell(`
<h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">Welcome to TajWater Premium</h1>
<p style="margin:0 0 32px;font-size:16px;color:#334155;line-height:1.6;">${msgText}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
  <tr><td style="padding-bottom:12px;">
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;display:flex;align-items:start;gap:16px;">
      <div style="font-size:24px;line-height:1;">🛒</div>
      <div><p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#0f172a;">Premium Selection</p><p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Access our full range of jugs, dispensers, and accessories.</p></div>
    </div>
  </td></tr>
  <tr><td style="padding-bottom:12px;">
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;display:flex;align-items:start;gap:16px;">
      <div style="font-size:24px;line-height:1;">🔄</div>
      <div><p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#0f172a;">Seamless Subscriptions</p><p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Automate your hydration with flexible weekly or monthly plans.</p></div>
    </div>
  </td></tr>
</table>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
  <tr><td style="border-radius:8px;background:#0c4a6e;">
    <a href="${coUrl}/shop" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Explore Collections &rarr;</a>
  </td></tr>
</table>
<p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;">Our team is here to assist you. Should you have any inquiries, please contact us at <a href="mailto:${coEmail}" style="color:#0c4a6e;font-weight:600;text-decoration:none;">${coEmail}</a>.</p>
`, `Welcome to TajWater, ${customerName}. Your account is ready.`, coEmail, coUrl)
}

// ─── Out for Delivery ─────────────────────────────────────────────────────────
export function buildOutForDeliveryEmail({ orderId, trackingToken, customerName, zone, message }: {
  orderId: string; trackingToken?: string | null; customerName: string; zone?: string | null; message?: string
}): string {
  const coEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'info@tajwater.ca'
  const coUrl   = process.env.NEXT_PUBLIC_SITE_URL      ?? 'https://tajwater.ca'
  const coPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE ?? ''
  const shortId = 'TW-' + orderId.slice(-8).toUpperCase()
  const msgText = message
    ? message.replace(/\{\{customer_name\}\}/g, customerName).replace(/\{\{order_id\}\}/g, shortId).replace(/\n/g, '<br/>')
    : `Dear ${customerName},\n\nWe are pleased to inform you that your order **${shortId}** is now out for delivery${zone ? ` to the **${zone}** region` : ''}. Our driver will be arriving shortly.`
  
  return shell(`
<h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">Delivery Update</h1>
<p style="margin:0 0 32px;font-size:16px;color:#334155;line-height:1.6;">${msgText.replace(/\n/g, '<br/>')}</p>

<div style="background:#f1f5f9;border-radius:12px;padding:24px;margin-bottom:32px;border:1px solid #e2e8f0;">
  <div style="display:flex;justify-content:space-between;align-items:center;">
    <div>
      <p style="margin:0;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Now Delivering</p>
      <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#0c4a6e;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">${shortId}</p>
    </div>
    <div style="font-size:32px;">🚚</div>
  </div>
  <div style="margin-top:16px;text-align:center;">
    <a href="${coUrl}/track/${orderId}${trackingToken ? `?token=${trackingToken}` : ''}" style="display:inline-block;background:#0c4a6e;color:#ffffff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">View Real-time Map &rarr;</a>
  </div>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:32px;">
  <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#0f172a;">Delivery Progress</p>
  <div style="font-size:13px;line-height:2.2;">
    <div style="color:#059669;">● Order Received</div>
    <div style="color:#059669;">● Dispatched for Delivery</div>
    <div style="color:#0c4a6e;font-weight:700;">● Out for Delivery &larr; <i>Current Status</i></div>
    <div style="color:#cbd5e1;">○ Delivered</div>
  </div>
</div>

<div style="background:#fffbeb;border:1px solid #fef3c7;border-radius:12px;padding:20px;margin-bottom:32px;">
  <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#92400e;">Driver Notification</p>
  <p style="margin:0;font-size:13px;color:#b45309;line-height:1.6;">Our driver will typically provide a courtesy call approximately 30 minutes prior to arrival. Please ensure the delivery location is accessible.</p>
</div>

<p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;">${coPhone ? `Should you need to reach us, please call <a href="tel:${coPhone}" style="color:#0c4a6e;font-weight:600;text-decoration:none;">${coPhone}</a> or email ` : 'Should you need to reach us, please email '}<a href="mailto:${coEmail}" style="color:#0c4a6e;font-weight:600;text-decoration:none;">${coEmail}</a>.</p>
`, `Delivery Update: Order ${shortId} is on its way.`, coEmail, coUrl, coPhone)
}

// ─── Delivered ────────────────────────────────────────────────────────────────
export function buildDeliveredEmail({ orderId, trackingToken, customerName, message }: {
  orderId: string; trackingToken?: string | null; customerName: string; message?: string
}): string {
  const coEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'info@tajwater.ca'
  const coUrl   = process.env.NEXT_PUBLIC_SITE_URL      ?? 'https://tajwater.ca'
  const shortId = 'TW-' + orderId.slice(-8).toUpperCase()
  const msgText = message
    ? message.replace(/\{\{customer_name\}\}/g, customerName).replace(/\{\{order_id\}\}/g, shortId).replace(/\n/g, '<br/>')
    : `Dear ${customerName},\n\nWe are pleased to inform you that your order **${shortId}** has been successfully delivered. We hope you enjoy our premium water services.`

  return shell(`
<div style="text-align:center;margin-bottom:32px;">
  <div style="font-size:48px;margin-bottom:16px;">✅</div>
  <h1 style="margin:0;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">Delivery Successful</h1>
</div>
<p style="margin:0 0 32px;font-size:16px;color:#334155;line-height:1.6;text-align:center;">${msgText.replace(/\n/g, '<br/>')}</p>

<div style="background:#f0fdf4;border:1px solid #dcfce7;border-radius:12px;padding:20px;margin-bottom:32px;text-align:center;">
  <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:1px;">Order Status</p>
  <p style="margin:0;font-size:18px;font-weight:700;color:#14532d;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">DELIVERED &middot; ${shortId}</p>
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
  <tr>
    <td style="padding-right:10px;width:50%;">
      <a href="${coUrl}/track/${orderId}${trackingToken ? `?token=${trackingToken}` : ''}" style="display:block;padding:12px;background:#0c4a6e;color:#ffffff;font-size:13px;font-weight:600;text-decoration:none;border-radius:8px;text-align:center;">View Final Status</a>
    </td>
    <td style="padding-left:10px;width:50%;">
      <a href="${coUrl}/shop" style="display:block;padding:12px;background:#f8fafc;color:#0c4a6e;font-size:13px;font-weight:600;text-decoration:none;border-radius:8px;text-align:center;border:1px solid #e2e8f0;">Place New Order</a>
    </td>
  </tr>
</table>

<div style="background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1px solid #bae6fd;border-radius:12px;padding:24px;margin-bottom:32px;">
  <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#0c4a6e;">Maintain Your Hydration</p>
  <p style="margin:0 0 16px;font-size:13px;color:#075985;line-height:1.6;">Ensure regular supply with our priority subscription service and save up to 15% on every delivery.</p>
  <a href="${coUrl}/shop" style="font-size:13px;font-weight:700;color:#0c4a6e;text-decoration:none;">View Subscription Plans &rarr;</a>
</div>

<p style="margin:0;font-size:14px;color:#64748b;line-height:1.7;text-align:center;">Thank you for your continued patronage of TajWater.</p>
`, `Confirmation: Order ${shortId} has been delivered.`, coEmail, coUrl)
}

// ─── Ticket Reply ─────────────────────────────────────────────────────────────
export function buildTicketReplyEmail({ ticketSubject, adminReply, customerName }: {
  ticketSubject: string; adminReply: string; customerName: string
}): string {
  const coEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'info@tajwater.ca'
  const coUrl   = process.env.NEXT_PUBLIC_SITE_URL      ?? 'https://tajwater.ca'
  const safeReply = adminReply
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>')
  return shell(`
<h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">Support Update</h1>
<p style="margin:0 0 32px;font-size:16px;color:#334155;line-height:1.6;">Dear ${customerName}, our support team has provided a response to your inquiry regarding <strong>${ticketSubject}</strong>.</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:32px;border-left:4px solid #0c4a6e;">
  <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;">TajWater Support Response</p>
  <p style="margin:0;font-size:15px;color:#1e293b;line-height:1.7;">${safeReply}</p>
</div>

<table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
  <tr><td style="border-radius:8px;background:#0c4a6e;">
    <a href="${coUrl}/dashboard/support" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">View Ticket History &rarr;</a>
  </td></tr>
</table>
<p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;text-align:center;">Should you require further assistance, please reply to this message or contact us at <a href="mailto:${coEmail}" style="color:#0c4a6e;font-weight:600;text-decoration:none;">${coEmail}</a>.</p>
`, `Support Update regarding: ${ticketSubject}`, coEmail, coUrl)
}

// ─── Admin Order Notification ─────────────────────────────────────────
export function buildAdminOrderNotificationEmail(order: {
  id: string
  customerName: string
  items: { name: string; qty: number; price: number }[]
  total: number
  deliveryAddress: string | null
  zone: string | null
  taxAmount?: number
  discountAmount?: number
}): string {
  const shortId = 'TW-' + order.id.slice(-8).toUpperCase()
  const coUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tajwater.ca'
  
  const rows = order.items.map(i => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#1e293b;">${i.name}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#64748b;text-align:center;">&times;${i.qty}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;font-weight:600;color:#1e293b;text-align:right;">$${(i.qty * i.price).toFixed(2)}</td>
    </tr>`).join('')

  return shell(`
<h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">New Order Notification 🔔</h1>
<p style="margin:0 0 24px;font-size:16px;color:#334155;line-height:1.6;">A new premium hydration order has been placed through the platform.</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:32px;">
  <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Customer Details</p>
  <p style="margin:0;font-size:16px;font-weight:700;color:#0c4a6e;">${order.customerName}</p>
  <p style="margin:6px 0 0;font-size:14px;color:#334155;">${order.deliveryAddress ?? 'No address provided'}</p>
  ${order.zone ? `<p style="margin:8px 0 0;font-size:12px;color:#0c4a6e;font-weight:700;">Region: ${order.zone}</p>` : ''}
</div>

<div style="margin-bottom:32px;">
  <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Manifest (${shortId})</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${rows}
    <tr>
      <td colspan="2" style="padding:16px 0;font-size:16px;font-weight:700;color:#0f172a;">Total Amount</td>
      <td style="padding:16px 0;font-size:18px;font-weight:800;color:#0c4a6e;text-align:right;">$${order.total.toFixed(2)}</td>
    </tr>
  </table>
</div>

<table role="presentation" cellpadding="0" cellspacing="0">
  <tr><td style="border-radius:8px;background:#0c4a6e;">
    <a href="${coUrl}/admin/orders/${order.id}" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Open in Management Panel &rarr;</a>
  </td></tr>
</table>
`, `Admin: New Order from ${order.customerName} (${shortId})`, undefined, coUrl)
}

// ─── Payment Link Request ───────────────────────────────────────────────────────
export function buildPaymentLinkEmail({ paymentId, amount, description, customerName, paymentUrl }: {
  paymentId: string; amount: number; description: string; customerName?: string; paymentUrl: string
}): string {
  const coEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'billing@tajwater.ca'
  const coUrl   = process.env.NEXT_PUBLIC_SITE_URL      ?? 'https://tajwater.ca'
  const greet = customerName ? `Dear ${customerName},` : 'Hello,'

  return shell(`
<h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">Payment Request</h1>
<p style="margin:0 0 32px;font-size:16px;color:#334155;line-height:1.6;">${greet}<br/><br/>TajWater has sent you a payment request for <strong>$${amount.toFixed(2)} CAD</strong>.</p>

<div style="background:#f1f5f9;border-radius:12px;padding:24px;margin-bottom:32px;border:1px solid #e2e8f0;">
  <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Description</p>
  <p style="margin:0 0 16px;font-size:15px;color:#1e293b;">${description}</p>
  
  <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Reference ID</p>
  <p style="margin:0 0 16px;font-size:15px;font-mono;color:#0097a7;font-weight:bold;">${paymentId}</p>

  <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Amount Due</p>
  <p style="margin:0;font-size:20px;font-weight:800;color:#0c4a6e;">$${amount.toFixed(2)} CAD</p>
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
  <tr><td align="center">
    <a href="${paymentUrl}" style="display:inline-block;background:#0c4a6e;color:#ffffff;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;text-decoration:none;">Pay Securely Online &rarr;</a>
  </td></tr>
</table>

<p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;text-align:center;">Payments are processed securely by Square. If you have any questions, please contact <a href="mailto:${coEmail}" style="color:#0c4a6e;text-decoration:none;">${coEmail}</a>.</p>
`, `Payment Request: $${amount.toFixed(2)} CAD for ${description}`, coEmail, coUrl)
}

// ─── Payment Receipt ───────────────────────────────────────────────────────────
export function buildPaymentReceiptEmail({ paymentId, amount, description, customerName, paidAt }: {
  paymentId: string; amount: number; description: string; customerName?: string; paidAt: string
}): string {
  const coEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'billing@tajwater.ca'
  const coUrl   = process.env.NEXT_PUBLIC_SITE_URL      ?? 'https://tajwater.ca'
  const greet = customerName ? `Dear ${customerName},` : 'Hello,'
  const dateStr = new Date(paidAt).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return shell(`
<div style="text-align:center;margin-bottom:24px;">
  <div style="font-size:48px;margin-bottom:16px;">✅</div>
  <h1 style="margin:0;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">Payment Receipt</h1>
</div>
<p style="margin:0 0 32px;font-size:16px;color:#334155;line-height:1.6;text-align:center;">${greet}<br/><br/>Thank you for your payment. Your transaction has been successfully completed.</p>

<div style="background:#f0fdf4;border:1px solid #dcfce7;border-radius:12px;padding:24px;margin-bottom:32px;">
  <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:1px;">Reference ID</p>
  <p style="margin:0 0 16px;font-size:15px;font-mono;color:#14532d;font-weight:bold;">${paymentId}</p>

  <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:1px;">Description</p>
  <p style="margin:0 0 16px;font-size:15px;color:#14532d;">${description}</p>

  <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:1px;">Paid On</p>
  <p style="margin:0 0 16px;font-size:15px;color:#14532d;">${dateStr}</p>

  <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:1px;">Total Paid</p>
  <p style="margin:0;font-size:20px;font-weight:800;color:#14532d;">$${amount.toFixed(2)} CAD</p>
</div>

<p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;text-align:center;">This email serves as your official receipt. Keep it for your records. If you have any questions, please contact <a href="mailto:${coEmail}" style="color:#0c4a6e;text-decoration:none;">${coEmail}</a>.</p>
`, `Receipt for Payment ${paymentId}`, coEmail, coUrl)
}
