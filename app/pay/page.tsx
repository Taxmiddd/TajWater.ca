'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Search, CreditCard, Shield, Droplets } from 'lucide-react'

export default function PayLandingPage() {
  const router = useRouter()
  const [paymentId, setPaymentId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const id = paymentId.trim().toUpperCase()
    if (!id) { setError('Please enter a payment ID'); return }
    if (!/^TW-[A-Z0-9]{4}$/.test(id)) {
      setError('Payment IDs look like TW-A3X9. Please check and try again.')
      return
    }
    setError('')
    setLoading(true)
    // Quick validation lookup
    const res = await fetch(`/api/pay/lookup?id=${encodeURIComponent(id)}`)
    if (!res.ok) {
      setError('Payment not found. Please check your ID and try again.')
      setLoading(false)
      return
    }
    router.push(`/pay/${id}`)
  }

  return (
    <div className="min-h-[calc(100vh-56px-400px)] flex flex-col items-center justify-center px-4 py-20">
      {/* Subtle animated background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00bcd4]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#0097a7]/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo + tagline */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0097a7] to-[#006064] shadow-lg mb-4">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0c2340] mb-1">TajWater Payments</h1>
          <p className="text-sm text-[#4a7fa5]">Enter your payment ID to view and pay your invoice</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#cce7f0] shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="payment-id" className="block text-xs font-semibold text-[#4a7fa5] uppercase tracking-wider mb-2">
                Payment ID
              </label>
              <div className="relative">
                <input
                  id="payment-id"
                  type="text"
                  value={paymentId}
                  onChange={e => {
                    setError('')
                    // Auto-format: always prefix TW-
                    let v = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '')
                    if (!v.startsWith('TW-') && v.length > 0) {
                      if (v.startsWith('TW')) v = 'TW-' + v.slice(2)
                      else if (!v.startsWith('T')) v = 'TW-' + v
                    }
                    setPaymentId(v.slice(0, 7))
                  }}
                  placeholder="TW-A3X9"
                  aria-label="Payment ID"
                  aria-describedby={error ? 'payment-id-error' : undefined}
                  aria-invalid={!!error}
                  className={`w-full px-4 py-3.5 pr-12 rounded-xl border text-center font-mono text-lg font-bold tracking-widest text-[#0c2340] placeholder:text-[#cce7f0] placeholder:font-normal placeholder:text-base placeholder:tracking-normal transition-colors focus:outline-none focus:ring-2 focus:ring-[#0097a7]/30 ${
                    error ? 'border-red-300 bg-red-50' : 'border-[#cce7f0] focus:border-[#0097a7]'
                  }`}
                  maxLength={7}
                  autoFocus
                  autoComplete="off"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0097a7]/50" />
              </div>
              {error && (
                <motion.p
                  id="payment-id-error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs text-red-500 flex items-center gap-1"
                  role="alert"
                >
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !paymentId}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0097a7] to-[#006064] text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#0097a7]/20"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Looking up...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Find My Payment
                </>
              )}
            </button>
          </form>

          {/* Trust badges */}
          <div className="mt-6 pt-5 border-t border-[#f0f9ff] flex items-center justify-center gap-5">
            <div className="flex items-center gap-1.5 text-xs text-[#4a7fa5]">
              <Shield className="w-3.5 h-3.5 text-[#0097a7]" />
              SSL Secured
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#4a7fa5]">
              <CreditCard className="w-3.5 h-3.5 text-[#0097a7]" />
              Powered by Square
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#4a7fa5]/70 mt-4">
          Payment IDs are provided by TajWater staff — check your invoice or email.
        </p>
      </motion.div>
    </div>
  )
}
