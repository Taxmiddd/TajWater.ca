'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '@/store/cartStore'
import { Wallet, History, ArrowDownLeft, ArrowUpRight, Gift, CreditCard as CreditCardIcon, Info } from 'lucide-react'
import { PaymentForm, CreditCard, ApplePay, GooglePay } from 'react-square-web-payments-sdk'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

type Transaction = {
  id: string
  amount: number
  balance_after: number
  transaction_type: string
  reason: string
  created_at: string
}

// Fixed recharge packages: [CAD paid, credits received]
const RECHARGE_PACKAGES = [
  { pay: 100, credits: 107 },
  { pay: 200, credits: 220 },
  { pay: 300, credits: 330 },
  { pay: 400, credits: 450 },
  { pay: 500, credits: 600 },
] as const

export default function WalletPage() {
  const [balance, setBalance] = useState<number>(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [accountType, setAccountType] = useState('customer')
  const [selectedPkg, setSelectedPkg] = useState<typeof RECHARGE_PACKAGES[number] | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const [profRes, transRes] = await Promise.all([
        supabase.from('profiles').select('wallet_balance, account_type').eq('id', session.user.id).single(),
        supabase.from('wallet_transactions').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
      ])

      if (profRes.data) {
        setBalance(profRes.data.wallet_balance ?? 0)
        setAccountType(profRes.data.account_type || 'customer')
      }
      if (transRes.data) setTransactions(transRes.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const { addItem } = useCart() // useCart from store

  const handleBuyNow = async (pkg: typeof RECHARGE_PACKAGES[number]) => {
    setMessage('')
    try {
      // Feature 1: Authentication Check Loop
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // Intercept and redirect
        window.location.href = `/login?redirect=/dashboard/wallet`
        return
      }

      const credits = accountType === 'business' ? pkg.pay : pkg.credits

      // User is logged in: Add Wallet Credit to Shopping Cart
      addItem({
        id: `wallet_credit_${pkg.pay}`,
        name: `Wallet Credit - $${pkg.pay}`,
        description: `Adds ${credits} credits to your TajWater Wallet`,
        price: pkg.pay,
        image_url: '/images/wallet-icon.png', // Placeholder
        stock: 999,
        category: 'wallet_credit',
        active: true,
      })

      setMessage(`$${pkg.pay} Wallet Credit successfully added to your cart!`)
      setSelectedPkg(null)
      
      // Optionally open a mini-cart or toast here
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Something went wrong')
    }
  }

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-3xl p-8 h-40 border border-[#cce7f0]" />
      <div className="bg-white rounded-3xl p-8 h-64 border border-[#cce7f0]" />
    </div>
  )

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#0097a7] to-[#1565c0] rounded-3xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="w-6 h-6 text-[#b3e5fc]" />
            <h2 className="text-[#b3e5fc] font-semibold text-lg">Available Balance</h2>
          </div>
          <p className="text-5xl font-extrabold mb-3">{balance.toFixed(0)} credits</p>
          <div className="flex items-start gap-2 bg-white/10 rounded-xl p-3">
            <Info className="w-4 h-4 text-[#b3e5fc] shrink-0 mt-0.5" />
            <p className="text-[#b3e5fc] text-sm leading-relaxed">
              Wallet credits can be used for <strong className="text-white">water refills and water products only</strong>.
              Delivery fees are always paid separately by card.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recharge Packages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#cce7f0] shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#e0f7fa] flex items-center justify-center">
              <Gift className="w-5 h-5 text-[#0097a7]" />
            </div>
            <h3 className="text-xl font-bold text-[#0c2340]">Recharge Wallet</h3>
          </div>
          <p className="text-xs text-[#4a7fa5] mb-2">Choose a package — the more you load, the more bonus credits you get!</p>
          <div className="bg-[#f0f9ff] border border-[#cce7f0] rounded-xl p-3 mb-6 flex items-start gap-2">
            <Info className="w-4 h-4 text-[#0097a7] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#4a7fa5] leading-relaxed">
              Note: To purchase wallet credits, you must have an active TajWater account and be logged in. Credits are tied directly to your account.
            </p>
          </div>

          <div className="space-y-3">
            {RECHARGE_PACKAGES.map((pkg) => {
              const credits = accountType === 'business' ? pkg.pay : pkg.credits
              const bonus = credits - pkg.pay
              const isSelected = selectedPkg?.pay === pkg.pay
              return (
                <button
                  key={pkg.pay}
                  onClick={() => handleBuyNow(pkg)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left border-[#cce7f0] hover:border-[#0097a7]/50 bg-white`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm bg-[#f0f9ff] text-[#0097a7]`}>
                      <CreditCardIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0c2340]">${pkg.pay} CAD</p>
                      <p className="text-xs text-[#4a7fa5]">{credits} credits</p>
                    </div>
                  </div>
                  {bonus > 0 && (
                    <div className="text-right">
                      <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        +{bonus} bonus
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {message && (
            <p className={`text-sm font-medium mt-4 ${message.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
              {message}
            </p>
          )}
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#cce7f0] shadow-sm h-[600px] flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#e3f2fd] flex items-center justify-center">
              <History className="w-5 h-5 text-[#1565c0]" />
            </div>
            <h3 className="text-xl font-bold text-[#0c2340]">Transaction History</h3>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-[#4a7fa5]">
                <p>No wallet transactions yet.</p>
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#f8fafc] border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0c2340] text-sm">{tx.reason || tx.transaction_type}</p>
                      <p className="text-xs text-[#4a7fa5]">
                        {new Date(tx.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-[#0c2340]'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(0)} cr
                    </p>
                    <p className="text-[10px] text-slate-400">Bal: {tx.balance_after.toFixed(0)} cr</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
