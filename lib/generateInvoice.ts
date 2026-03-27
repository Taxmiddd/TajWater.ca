import { renderToBuffer, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import React from 'react'

export type InvoiceOrderItem = { id: string; quantity: number; price: number; products: { name: string } | null }
export type InvoiceOrderData = {
  id: string
  total: number
  payment_status: string | null
  payment_method?: string | null
  delivery_address: string | null
  customer_name: string | null
  customer_phone: string | null
  created_at: string
  zones: { name: string } | null
  order_items: InvoiceOrderItem[]
  profiles: { name: string; email: string } | null
  tax_amount?: number | null
  discount_amount?: number | null
  notes?: string | null
}
export type CompanyInfo = { name: string; address: string; phone: string; email: string; website: string }

const styles = StyleSheet.create({
  page:           { fontFamily: 'Times-Roman', fontSize: 10, color: '#101828', padding: 48, backgroundColor: '#ffffff' },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, paddingBottom: 24, borderBottomWidth: 2, borderBottomColor: '#0c2340' },
  companyBlock:   { flexDirection: 'column' },
  logoText:       { fontSize: 14, fontFamily: 'Times-Bold', color: '#008080', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 2 },
  companyName:    { fontSize: 24, fontFamily: 'Times-Bold', color: '#008080', letterSpacing: 0.5 },
  companyDetail:  { fontSize: 9, color: '#667085', marginTop: 1 },
  
  invoiceLabelArea: { alignItems: 'flex-end' },
  invoiceLabel:   { fontSize: 40, fontFamily: 'Times-Bold', color: '#0c2340', letterSpacing: -1 },
  invoiceNumber:  { fontSize: 11, fontFamily: 'Times-Bold', color: '#008080', marginTop: 4 },
  invoiceDate:    { fontSize: 9, color: '#667085', marginTop: 2 },
  
  billingRow:     { flexDirection: 'row', marginBottom: 32 },
  billingBox:     { flex: 1, backgroundColor: '#f0f9f9', padding: 16, borderLeftWidth: 4, borderLeftColor: '#008080' },
  billingBoxRight: { flex: 1, backgroundColor: '#f0f9f9', padding: 16, borderLeftWidth: 4, borderLeftColor: '#008080', marginLeft: 32 },
  billingTitle:   { fontSize: 8, fontFamily: 'Times-Bold', color: '#0c2340', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  billingName:    { fontSize: 12, fontFamily: 'Times-Bold', color: '#0c2340', marginBottom: 4 },
  billingText:    { fontSize: 9, color: '#344054', lineHeight: 1.5 },
  
  tableHeader:      { flexDirection: 'row', backgroundColor: '#0c2340', paddingTop: 10, paddingBottom: 10, paddingLeft: 16, paddingRight: 16, marginBottom: 4 },
  tableHeaderText:  { fontSize: 8, fontFamily: 'Times-Bold', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 1 },
  tableRow:         { flexDirection: 'row', paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16, borderBottomWidth: 1, borderBottomColor: '#eaecf0', alignItems: 'center' },
  tableRowAlt:      { flexDirection: 'row', paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16, borderBottomWidth: 1, borderBottomColor: '#eaecf0', backgroundColor: '#f9fafb', alignItems: 'center' },
  
  colProduct:     { flex: 4 },
  colQty:         { flex: 1, textAlign: 'center' },
  colPrice:       { flex: 1.5, textAlign: 'right' },
  colTotal:       { flex: 1.5, textAlign: 'right' },
  
  productName:    { fontSize: 10, fontFamily: 'Times-Bold', color: '#0c2340' },
  productSub:     { fontSize: 8, color: '#667085', marginTop: 1, fontStyle: 'italic' },
  cellText:       { fontSize: 10, color: '#344054' },
  
  bottomArea:     { flexDirection: 'row', justifyContent: 'space-between', marginTop: 32 },
  notesBox:       { flex: 1, marginRight: 40 },
  notesTitle:     { fontSize: 8, fontFamily: 'Times-Bold', color: '#0c2340', textTransform: 'uppercase', marginBottom: 6 },
  notesText:      { fontSize: 9, color: '#667085', fontStyle: 'italic', lineHeight: 1.5 },
  
  totalsBox:      { width: 220 },
  totalRow:       { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 2, paddingBottom: 2 },
  totalLabel:     { fontSize: 9, color: '#667085' },
  totalValue:     { fontSize: 9, color: '#0c2340', fontFamily: 'Times-Bold' },
  taxRow:         { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 2, paddingBottom: 2, color: '#667085' },
  
  grandRow:       { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, paddingBottom: 12, borderTopWidth: 2, borderTopColor: '#008080', marginTop: 8 },
  grandLabel:     { fontSize: 14, fontFamily: 'Times-Bold', color: '#0c2340' },
  grandValue:     { fontSize: 18, fontFamily: 'Times-Bold', color: '#008080' },
  
  statusWrapper:  { marginTop: 24, alignItems: 'flex-end' },
  statusBadge:    { paddingTop: 6, paddingBottom: 6, paddingLeft: 12, paddingRight: 12, borderLeftWidth: 4 },
  statusText:     { fontSize: 10, fontFamily: 'Times-Bold', textTransform: 'uppercase', letterSpacing: 1.5 },
  
  footer:         { position: 'absolute', bottom: 40, left: 48, right: 48, borderTopWidth: 1, borderTopColor: '#eaecf0', paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between' },
  footerText:     { fontSize: 8, color: '#98a2b3' },
})

export function InvoicePDF({ order, companyInfo }: { order: InvoiceOrderData; companyInfo: CompanyInfo }) {
  const invoiceNum   = 'INV-' + order.id.slice(-8).toUpperCase()
  const issueDate    = new Date(order.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
  const customerName = order.profiles?.name ?? order.customer_name ?? 'Guest Customer'
  
  const subtotal     = order.order_items.reduce((s, i) => s + i.price * i.quantity, 0)
  const discountAmt  = Number(order.discount_amount ?? 0)
  const taxAmt       = Number(order.tax_amount ?? 0)
  
  const gstAmt = (taxAmt / 12) * 5
  const pstAmt = (taxAmt / 12) * 7
  
  const deliveryFee  = Math.max(0, parseFloat((order.total - subtotal + discountAmt - taxAmt).toFixed(2)))
  
  const methodMap: Record<string, string> = {
    'square_online': 'Royal Online Payment',
    'cash_on_delivery': 'Royal Cash on Delivery',
    'card_on_delivery': 'Royal Card on Delivery (POS)',
  }
  const paymentMethodName = methodMap[order.payment_method ?? ''] ?? 'Royal Order'
  
  const statusConfig: Record<string, { bg: string; text: string; border: string }> = { 
    paid:     { bg: '#f0fdf4', text: '#16a34a', border: '#16a34a' }, 
    pending:  { bg: '#fffbeb', text: '#d97706', border: '#d97706' }, 
    failed:   { bg: '#fef2f2', text: '#dc2626', border: '#dc2626' }, 
    refunded: { bg: '#f8fafc', text: '#64748b', border: '#64748b' } 
  }
  const payStatus = order.payment_status?.toLowerCase() ?? 'pending'
  const currentStatus = statusConfig[payStatus] ?? statusConfig.pending

  return React.createElement(Document, { title: invoiceNum },
    React.createElement(Page, { size: 'A4', style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(View, { style: styles.companyBlock },
          React.createElement(Text, { style: styles.companyName }, "Taj Water LTD."),
          React.createElement(Text, { style: styles.companyDetail }, "1770 McLean Ave"),
          React.createElement(Text, { style: styles.companyDetail }, "Port Coquitlam, BC V3C 4K8, Canada"),
          React.createElement(Text, { style: styles.companyDetail }, companyInfo.email),
          React.createElement(Text, { style: styles.companyDetail }, companyInfo.phone),
        ),
        React.createElement(View, { style: styles.invoiceLabelArea },
          React.createElement(Text, { style: styles.invoiceLabel }, 'INVOICE'),
          React.createElement(Text, { style: styles.invoiceNumber }, invoiceNum),
          React.createElement(Text, { style: styles.invoiceDate }, 'Issued: ' + issueDate),
        ),
      ),
      
      // Billing info
      React.createElement(View, { style: styles.billingRow },
        React.createElement(View, { style: styles.billingBox },
          React.createElement(Text, { style: styles.billingTitle }, 'Bill To:'),
          React.createElement(Text, { style: styles.billingName }, customerName),
          React.createElement(Text, { style: styles.billingText }, order.profiles?.email || '—'),
          React.createElement(Text, { style: styles.billingText }, order.customer_phone || '—'),
          React.createElement(Text, { style: { ...styles.billingText, marginTop: 4 } }, (order.zones as any)?.name ? `Region: ${(order.zones as any).name}` : ''),
          React.createElement(Text, { style: styles.billingText }, order.delivery_address || ''),
        ),
        React.createElement(View, { style: styles.billingBoxRight },
          React.createElement(Text, { style: styles.billingTitle }, 'Order Details:'),
          React.createElement(Text, { style: styles.billingName }, paymentMethodName),
          React.createElement(Text, { style: styles.billingText }, 'Ref: ' + order.id.toUpperCase().slice(0, 12)),
          React.createElement(View, { style: { ...styles.statusBadge, backgroundColor: currentStatus.bg, borderLeftColor: currentStatus.border, marginTop: 12, alignSelf: 'flex-start' } },
            React.createElement(Text, { style: { ...styles.statusText, color: currentStatus.text } }, payStatus.toUpperCase())
          ),
        ),
      ),
      
      // Items
      React.createElement(View, { style: styles.tableHeader },
        React.createElement(Text, { style: { ...styles.tableHeaderText, ...styles.colProduct } }, 'Description'),
        React.createElement(Text, { style: { ...styles.tableHeaderText, ...styles.colQty } }, 'Qty'),
        React.createElement(Text, { style: { ...styles.tableHeaderText, ...styles.colPrice } }, 'Rate'),
        React.createElement(Text, { style: { ...styles.tableHeaderText, ...styles.colTotal } }, 'Amount'),
      ),
      
      ...order.order_items.map((item, idx) =>
        React.createElement(View, { key: item.id, style: idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt },
          React.createElement(View, { style: styles.colProduct },
            React.createElement(Text, { style: styles.productName }, item.products?.name ?? 'Premium Hydration'),
            React.createElement(Text, { style: styles.productSub }, 'TajWater Quality Guaranteed'),
          ),
          React.createElement(Text, { style: { ...styles.cellText, ...styles.colQty } }, String(item.quantity)),
          React.createElement(Text, { style: { ...styles.cellText, ...styles.colPrice } }, `$${item.price.toFixed(2)}`),
          React.createElement(Text, { style: { ...styles.cellText, ...styles.colTotal, fontFamily: 'Times-Bold' } }, `$${(item.price * item.quantity).toFixed(2)}`),
        )
      ),
      
      // Bottom
      React.createElement(View, { style: styles.bottomArea },
        React.createElement(View, { style: styles.notesBox },
          order.notes && React.createElement(React.Fragment, null,
            React.createElement(Text, { style: styles.notesTitle }, 'Special Instructions:'),
            React.createElement(Text, { style: styles.notesText }, order.notes)
          ),
        ),
        React.createElement(View, { style: styles.totalsBox },
          React.createElement(View, { style: styles.totalRow },
            React.createElement(Text, { style: styles.totalLabel }, 'Subtotal'),
            React.createElement(Text, { style: styles.totalValue }, `$${subtotal.toFixed(2)}`),
          ),
          discountAmt > 0 && React.createElement(View, { style: styles.totalRow },
            React.createElement(Text, { style: { ...styles.totalLabel, color: '#16a34a' } }, 'Royal Discount'),
            React.createElement(Text, { style: { ...styles.totalValue, color: '#16a34a' } }, `−$${discountAmt.toFixed(2)}`),
          ),
          deliveryFee > 0.01 && React.createElement(View, { style: styles.totalRow },
            React.createElement(Text, { style: styles.totalLabel }, 'Delivery Fee'),
            React.createElement(Text, { style: styles.totalValue }, `$${deliveryFee.toFixed(2)}`),
          ),
          taxAmt > 0 && React.createElement(React.Fragment, null,
            React.createElement(View, { style: styles.taxRow },
              React.createElement(Text, { style: styles.totalLabel }, 'GST (5%)'),
              React.createElement(Text, { style: styles.totalValue }, `$${gstAmt.toFixed(2)}`),
            ),
            React.createElement(View, { style: styles.taxRow },
              React.createElement(Text, { style: styles.totalLabel }, 'PST (7%)'),
              React.createElement(Text, { style: styles.totalValue }, `$${pstAmt.toFixed(2)}`),
            ),
          ),
          React.createElement(View, { style: styles.grandRow },
            React.createElement(Text, { style: styles.grandLabel }, 'GRAND TOTAL'),
            React.createElement(Text, { style: styles.grandValue }, `$${order.total.toFixed(2)}`),
          ),
        ),
      ),
      
      // Footer
      React.createElement(View, { style: styles.footer },
        React.createElement(View, null,
          React.createElement(Text, { style: styles.footerText }, 'Thank you for choosing Taj Water.'),
        ),
        React.createElement(View, { style: { alignItems: 'flex-end' } },
          React.createElement(Text, { style: styles.footerText }, 'tajwater.ca'),
          React.createElement(Text, { style: { ...styles.footerText, marginTop: 2 } }, 'GST# 84157 2639 RT0001'),
        ),
      ),
    )
  )
}

export async function generateInvoicePDF(order: InvoiceOrderData, companyInfo: CompanyInfo): Promise<Buffer> {
  return renderToBuffer(
    React.createElement(InvoicePDF, { order, companyInfo }) as any
  )
}
