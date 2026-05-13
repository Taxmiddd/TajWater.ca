'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk'
import { CheckCircle2, AlertCircle, ShieldCheck, Droplets, Calendar, CreditCard as CardIcon, RotateCcw } from 'lucide-react'
import Link from 'next/link'

type PlanInfo = {
  id: string
  frequency: string
  payment_cycle: string
  quantity: number
  price: number
  plan_name: string | null
  custom_delivery_address: string | null
  charge_start_date: string | null
  plan_link_status: string
  product_name: string
  customer_name: string | null
  customer_email: string | null
}

const FREQ_DAYS: Record<string, number> = { daily: 1, weekly: 7, biweekly: 14, monthly: 30 }
const FREQ_LABEL: Record<string, string> = { daily: 'Daily', weekly: 'Weekly', biweekly: 'Biweekly', monthly: 'Monthly' }

function calcCycleAmount(price: number, quantity: number, frequency: string, paymentCycle: string) {
  const deliveryDays = FREQ_DAYS[frequency] ?? 7
  const paymentDays = FREQ_DAYS[paymentCycle] ?? 30
  const deliveriesPerCycle = Math.max(1, Math.round(paymentDays / deliveryDays))
  return price * quantity * deliveriesPerCycle
}

export default function PlanSetupClient({ token, plan }: { token: string; plan: PlanInfo }) {
  const [screen, setScreen] = useState<'form' | 'processing' | 'success' | 'error'>('form')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMode, setSuccessMode] = useState<'charged' | 'card_verified'>('card_verified')

  const isChargeNow = !plan.charge_start_date
  const cycleAmount = calcCycleAmount(plan.price, plan.quantity, plan.frequency, plan.payment_cycle)
  const alreadyDone = plan.plan_link_status === 'charged' || plan.plan_link_status === 'card_verified'

  const handleToken = async (tokenResult: { status: string; token?: string; errors?: Array<{ message: string }> }) => {
    if (tokenResult.status !== 'OK' || !tokenResult.token) {
      setErrorMsg(tokenResult.errors?.[0]?.message ?? 'Card details are invalid. Please try again.')
      return
    }
    setScreen('processing')
    try {
      const res = await fetch(`/api/plan/${token}/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId: tokenResult.token }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Setup failed')
      setSuccessMode(data.mode)
      setScreen('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setScreen('error')
    }
  }

  if (alreadyDone) {
    return (
      <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-[#cce7f0] shadow-xl p-10 max-w-md w-full text-center">
          <CheckCircle2 className="w-16 h-16 text-[#0097a7] mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-[#0c2340] mb-2">Already Set Up</h2>
          <p className="text-[#4a7fa5]">This subscription plan has already been activated. No further action is needed.</p>
        </div>
      </div>
    )
  }

  if (screen === 'success') {
    return (
      <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl border border-[#cce7f0] shadow-xl p-10 max-w-md w-full text-center">
          <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.5 }}>
            <CheckCircle2 className="w-20 h-20 text-[#0097a7] mx-auto mb-5" />
          </motion.div>
          <h2 className="text-2xl font-extrabold text-[#0c2340] mb-2">
            {successMode === 'charged' ? 'Payment Successful!' : 'Card Verified!'}
          </h2>
          <p className="text-[#4a7fa5] mb-6">
            {successMode === 'charged'
              ? `Your first payment of $${cycleAmount.toFixed(2)} CAD was processed. Your subscription is now active.`
              : `Your card was verified and the $0.99 CAD hold will be refunded within 3–5 business days. Your first charge of $${cycleAmount.toFixed(2)} CAD will be processed on ${new Date(plan.charge_start_date!).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })}.`
            }
          </p>
          <div className="bg-[#e0f7fa] rounded-2xl p-4 text-left text-sm">
            <p className="font-semibold text-[#0097a7] mb-1">{plan.plan_name ?? 'Your Plan'}</p>
            <p className="text-[#0c2340]">{plan.product_name}</p>
            <p className="text-[#4a7fa5] text-xs mt-1">
              {plan.quantity} jug{plan.quantity > 1 ? 's' : ''} · {FREQ_LABEL[plan.frequency]} delivery · {FREQ_LABEL[plan.payment_cycle]} billing
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (screen === 'error') {
    return (
      <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-red-200 shadow-xl p-10 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-extrabold text-[#0c2340] mb-2">Something went wrong</h2>
          <p className="text-red-500 mb-6 text-sm">{errorMsg}</p>
          <button onClick={() => { setScreen('form'); setErrorMsg('') }}
            className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl bg-[#0097a7] text-white font-semibold text-sm">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f9ff] py-12 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0097a7] to-[#1565c0] flex items-center justify-center">
          <Droplets className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-[#4a7fa5] font-medium uppercase tracking-wide">TajWater LTD</p>
          <p className="text-sm font-bold text-[#0c2340]">Subscription Setup</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-6">
        {/* Plan Summary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-[#cce7f0] shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-[#0097a7] to-[#1565c0] px-6 py-5 text-white">
              <p className="text-xs font-semibold opacity-75 uppercase tracking-wider mb-1">Subscription Plan</p>
              <h2 className="text-xl font-extrabold">{plan.plan_name ?? plan.product_name}</h2>
              {plan.customer_name && (
                <p className="text-sm opacity-80 mt-1">For {plan.customer_name}</p>
              )}
            </div>
            <div className="p-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#4a7fa5]">Product</span>
                <span className="font-semibold text-[#0c2340]">{plan.product_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4a7fa5]">Quantity</span>
                <span className="font-semibold text-[#0c2340]">{plan.quantity} jug{plan.quantity > 1 ? 's' : ''} / delivery</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4a7fa5]">Price per jug</span>
                <span className="font-semibold text-[#0c2340]">${plan.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4a7fa5]">Delivery schedule</span>
                <span className="font-semibold text-[#0c2340] capitalize">{FREQ_LABEL[plan.frequency]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4a7fa5]">Billing cycle</span>
                <span className="font-semibold text-[#0c2340] capitalize">{FREQ_LABEL[plan.payment_cycle]}</span>
              </div>
              {plan.custom_delivery_address && (
                <div className="flex justify-between gap-3">
                  <span className="text-[#4a7fa5] shrink-0">Delivery to</span>
                  <span className="font-semibold text-[#0c2340] text-right text-xs">{plan.custom_delivery_address}</span>
                </div>
              )}
              <div className="border-t border-[#f0f9ff] pt-3 flex justify-between items-center">
                <span className="text-[#4a7fa5] font-medium">{FREQ_LABEL[plan.payment_cycle]} total</span>
                <span className="text-2xl font-extrabold text-[#0097a7]">${cycleAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className={`rounded-2xl border p-4 text-sm ${isChargeNow ? 'bg-[#e0f7fa] border-[#0097a7]/20' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-start gap-2">
              {isChargeNow
                ? <CardIcon className="w-4 h-4 text-[#0097a7] mt-0.5 shrink-0" />
                : <Calendar className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              }
              <div>
                <p className={`font-semibold mb-1 ${isChargeNow ? 'text-[#0097a7]' : 'text-amber-700'}`}>
                  {isChargeNow ? 'Pay Today' : 'Card Authorization Only'}
                </p>
                <p className={`text-xs leading-relaxed ${isChargeNow ? 'text-[#4a7fa5]' : 'text-amber-700'}`}>
                  {isChargeNow
                    ? `Your card will be charged $${cycleAmount.toFixed(2)} CAD today and saved for future ${FREQ_LABEL[plan.payment_cycle].toLowerCase()} billing.`
                    : `Your card will be charged a refundable $0.99 CAD to verify it's valid. The first real charge of $${cycleAmount.toFixed(2)} CAD will be on ${new Date(plan.charge_start_date!).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })}.`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-[#cce7f0] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#f0f9ff] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0097a7]" />
              <h3 className="font-bold text-[#0c2340]">
                {isChargeNow ? 'Payment Details' : 'Card Authorization'}
              </h3>
              <span className="ml-auto text-xs text-[#4a7fa5] bg-[#f0f9ff] px-2 py-1 rounded-full">Secured by Square</span>
            </div>

            <div className="p-6">
              {screen === 'processing' ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-8 h-8 border-3 border-[#cce7f0] border-t-[#0097a7] rounded-full" />
                  <p className="text-[#4a7fa5] font-medium">
                    {isChargeNow ? 'Processing payment...' : 'Verifying your card...'}
                  </p>
                  <p className="text-xs text-[#4a7fa5]">Please do not close this page</p>
                </div>
              ) : (
                <PaymentForm
                  applicationId={process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ?? ''}
                  locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? ''}
                  cardTokenizeResponseReceived={handleToken}
                >
                  <CreditCard
                    buttonProps={{
                      css: {
                        backgroundColor: '#0097a7',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: '700',
                        borderRadius: '14px',
                        padding: '14px 0',
                        marginTop: '16px',
                        '&:hover': { backgroundColor: '#00838f' },
                      },
                    }}
                  >
                    {isChargeNow
                      ? `Pay $${cycleAmount.toFixed(2)} CAD`
                      : 'Authorize Card ($0.99 refundable)'
                    }
                  </CreditCard>
                </PaymentForm>
              )}

              <p className="text-[10px] text-center text-[#4a7fa5] mt-5">
                Your payment info is encrypted and processed securely by{' '}
                <Link href="https://squareup.com" target="_blank" className="underline hover:text-[#0097a7]">Square</Link>.
                TajWater never stores your card number.
              </p>
            </div>
          </div>

          {/* Trust row */}
          <div className="mt-4 flex items-center justify-center gap-6 text-[10px] text-[#4a7fa5]">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> PCI Compliant</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> 256-bit SSL</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Powered by Square</span>
          </div>
        </div>
      </div>
    </div>
  )
}
