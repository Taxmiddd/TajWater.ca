'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk'
import { CheckCircle2, AlertTriangle, User, Phone, Mail, Droplets, ShieldCheck, CreditCard as CreditCardIcon } from 'lucide-react'
import Link from 'next/link'
import type { PaymentLink } from '@/types'

type ScreenState = 'paying' | 'processing' | 'success' | 'error'
interface TokenResult { status: string; token?: string; errors?: Array<{ message: string }> }

// ── Invoice UI Component ──────────────────────────────────────────────────────
function InvoiceDetails({ link, isPaid = false }: { link: PaymentLink; isPaid?: boolean }) {
  const lineItems = link.line_items || [{ description: link.description, quantity: 1, unit_price: link.amount }]

  return (
    <div className="bg-white rounded-3xl border border-[#cce7f0] shadow-sm overflow-hidden mb-6 relative">
      {/* Paid Stamp */}
      {isPaid && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none opacity-10">
          <div className="border-8 border-green-500 text-green-500 text-6xl font-black uppercase tracking-widest px-8 py-4 rounded-xl">
            PAID
          </div>
        </div>
      )}

      {/* Invoice Header */}
      <div className="bg-gradient-to-r from-[#0c4a6e] to-[#0097a7] px-6 py-8 text-white flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">INVOICE</h1>
          <p className="font-mono text-sm opacity-80 uppercase tracking-widest">{link.id}</p>
        </div>
        <div className="text-left sm:text-right text-sm opacity-90 space-y-0.5">
          <p className="font-bold text-white opacity-100">TajWater LTD</p>
          <p>1770 McLean Ave</p>
          <p>Port Coquitlam, BC V3C 4K8</p>
          <p>info@tajwater.ca</p>
        </div>
      </div>

      <div className="p-6">
        {/* Bill To */}
        {(link.customer_name || link.customer_phone || link.customer_email) && (
          <div className="mb-8 border-l-4 border-[#0097a7] pl-4">
            <p className="text-[10px] font-bold text-[#4a7fa5] uppercase tracking-widest mb-2">Bill To</p>
            <div className="space-y-1">
              {link.customer_name && <p className="font-bold text-[#0c2340]">{link.customer_name}</p>}
              {link.customer_phone && <p className="text-sm text-[#4a7fa5]">{link.customer_phone}</p>}
              {link.customer_email && <p className="text-sm text-[#4a7fa5]">{link.customer_email}</p>}
            </div>
          </div>
        )}

        {/* Invoice Summary (if no explicit line items provided, description acts as summary) */}
        {!link.line_items && (
          <div className="mb-6">
            <p className="text-[10px] font-bold text-[#4a7fa5] uppercase tracking-widest mb-1">Summary</p>
            <p className="text-sm text-[#0c2340]">{link.description}</p>
          </div>
        )}

        {/* Line Items Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm text-left">
            <thead className="border-b-2 border-[#0c2340]">
              <tr>
                <th className="py-2 text-xs font-bold text-[#0c2340] uppercase">Description</th>
                <th className="py-2 text-xs font-bold text-[#0c2340] uppercase text-center w-16">Qty</th>
                <th className="py-2 text-xs font-bold text-[#0c2340] uppercase text-right w-24">Price</th>
                <th className="py-2 text-xs font-bold text-[#0c2340] uppercase text-right w-24">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f9ff]">
              {lineItems.map((item, i) => (
                <tr key={i}>
                  <td className="py-3 text-[#4a7fa5] pr-4">{item.description}</td>
                  <td className="py-3 text-[#0c2340] text-center">{item.quantity}</td>
                  <td className="py-3 text-[#4a7fa5] text-right">${item.unit_price.toFixed(2)}</td>
                  <td className="py-3 font-bold text-[#0c2340] text-right">${(item.quantity * item.unit_price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end pt-4 border-t-2 border-[#cce7f0]">
          <div className="w-48 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#4a7fa5]">Subtotal</span>
              <span className="font-medium text-[#0c2340]">${link.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#4a7fa5]">Tax</span>
              <span className="font-medium text-[#0c2340]">Incl.</span>
            </div>
            <div className="flex justify-between text-lg font-black border-t border-[#f0f9ff] pt-2">
              <span className="text-[#0c2340]">Total ({link.currency})</span>
              <span className="text-[#0097a7]">${link.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SuccessScreen({ link, receiptUrl }: { link: PaymentLink; receiptUrl?: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-10 max-w-2xl mx-auto w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-5">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#0c2340] mb-2">Payment Successful!</h2>
        <p className="text-[#4a7fa5] text-sm">
          A receipt has been sent to your email. Thank you for your business.
        </p>
      </div>

      <InvoiceDetails link={link} isPaid={true} />

      <div className="text-center space-y-4">
        {receiptUrl && (
          <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-bold text-[#0097a7] hover:underline bg-white px-6 py-3 rounded-xl border border-[#cce7f0] shadow-sm">
            View Square Receipt ↗
          </a>
        )}
        <br />
        <Link href="https://tajwater.ca" className="inline-flex items-center gap-2 text-sm font-medium text-[#4a7fa5] hover:text-[#0097a7]">
          ← Return to TajWater
        </Link>
      </div>
    </motion.div>
  )
}

export default function PaymentClient({ link, paymentId }: { link: PaymentLink; paymentId: string }) {
  const [screen, setScreen] = useState<ScreenState>('paying')
  const [errorMsg, setErrorMsg] = useState('')
  const [receiptUrl, setReceiptUrl] = useState<string | undefined>()

  const handleTokenize = async (token: TokenResult) => {
    if (!token.token || token.errors?.length) {
      setErrorMsg(token.errors?.[0]?.message || 'Card tokenization failed. Please check your card details.')
      setScreen('error')
      return
    }
    setScreen('processing')
    try {
      const res = await fetch(`/api/pay/${paymentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId: token.token }),
      })
      const json = await res.json()
      if (!res.ok) { setErrorMsg(json.error || 'Payment failed. Please try again.'); setScreen('error'); return }
      setReceiptUrl(json.receiptUrl)
      setScreen('success')
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.')
      setScreen('error')
    }
  }

  if (screen === 'success') return <SuccessScreen link={link} receiptUrl={receiptUrl} />

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          
          {/* Invoice View */}
          <InvoiceDetails link={link} />

          {/* Payment Section */}
          <div className="bg-white rounded-3xl border border-[#cce7f0] shadow-xl overflow-hidden p-6 relative">
            <h3 className="text-lg font-bold text-[#0c2340] mb-4">Secure Payment</h3>
            
            {/* Processing overlay */}
            <AnimatePresence>
              {screen === 'processing' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-3xl">
                  <svg className="w-10 h-10 animate-spin text-[#0097a7] mb-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-sm font-semibold text-[#0c2340]">Processing payment…</p>
                  <p className="text-xs text-[#4a7fa5] mt-1">Please don&apos;t close this tab</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error banner */}
            <AnimatePresence>
              {screen === 'error' && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  role="alert" className="flex items-start gap-3 p-4 mb-4 rounded-xl bg-red-50 border border-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-700">Payment Failed</p>
                    <p className="text-xs text-red-600 mt-0.5">{errorMsg}</p>
                  </div>
                  <button onClick={() => { setScreen('paying'); setErrorMsg('') }} className="text-xs font-semibold text-red-600 hover:text-red-800 underline">
                    Retry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Square form */}
            <PaymentForm
              applicationId={process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID!}
              locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!}
              cardTokenizeResponseReceived={handleTokenize}
            >
              <CreditCard
                buttonProps={{
                  css: {
                    backgroundColor: screen === 'processing' ? '#94a3b8' : '#0097a7',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    padding: '16px',
                    width: '100%',
                    cursor: screen === 'processing' ? 'not-allowed' : 'pointer',
                  },
                }}
              >
                {screen === 'processing' ? 'Processing…' : `Pay $${link.amount.toFixed(2)} CAD`}
              </CreditCard>
            </PaymentForm>

            {/* Trust */}
            <div className="flex items-center justify-center gap-5 pt-4">
              <span className="flex items-center gap-1.5 text-xs text-[#4a7fa5]"><ShieldCheck className="w-3.5 h-3.5 text-[#0097a7]" />PCI-DSS Secure</span>
              <span className="flex items-center gap-1.5 text-xs text-[#4a7fa5]"><CreditCardIcon className="w-3.5 h-3.5 text-[#0097a7]" />Powered by Square</span>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-xs text-[#4a7fa5]/60 mt-6">
          Questions? <a href="mailto:support@tajwater.ca" className="text-[#0097a7] hover:underline">support@tajwater.ca</a>
        </p>
      </div>
    </div>
  )
}
