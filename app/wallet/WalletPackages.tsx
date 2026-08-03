'use client'

import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cartStore'

interface Package {
  pay: number
  credits: number
}

interface WalletPackagesProps {
  packages: Package[]
  isLoggedIn: boolean
  isBusiness?: boolean
}

export default function WalletPackages({ packages, isLoggedIn, isBusiness = false }: WalletPackagesProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [activeTab, setActiveTab] = React.useState<'consumer' | 'business'>(isBusiness ? 'business' : 'consumer')

  const handleAddToCart = (pkg: Package) => {
    const credits = pkg.pay
    
    // Add to cart store (which is persisted in localStorage)
    addItem({
      id: `wallet_credit_${pkg.pay}_${activeTab}`,
      name: `Wallet Credit - $${pkg.pay}`,
      description: `Adds ${credits} credits to your TajWater Wallet`,
      price: pkg.pay,
      image_url: '/images/wallet-icon.png', // Placeholder
      stock: 999,
      category: 'wallet_credit',
      active: true,
      taxable: false,
    })

    if (!isLoggedIn) {
      router.push('/auth/login?redirect=/wallet')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('consumer')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'consumer' ? 'bg-white text-[#0097a7] shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Consumer
        </button>
        <button
          onClick={() => setActiveTab('business')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'business' ? 'bg-white text-[#0097a7] shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Business
        </button>
      </div>
      {packages.map((pkg) => {
        const credits = pkg.pay
        return (
          <div 
            key={pkg.pay} 
            className="group relative flex items-center justify-between p-4 rounded-2xl bg-[#f8fafc] border border-slate-100 hover:border-[#0097a7]/30 hover:bg-[#f0f9ff] transition-all overflow-hidden"
          >
            {/* Standard Info */}
            <div className="flex items-center gap-4 transition-transform group-hover:-translate-x-2">
              <div className="w-12 h-12 rounded-full bg-[#e0f7fa] flex items-center justify-center text-[#0097a7] font-black">
                ${pkg.pay}
              </div>
              <div>
                <p className="font-bold text-[#0c2340]">Get {credits} Credits</p>
                <p className="text-xs text-[#4a7fa5]">Pay ${pkg.pay} CAD</p>
              </div>
            </div>

            {/* Hover Cart Button */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
              <button
                onClick={() => handleAddToCart(pkg)}
                className="flex items-center gap-2 bg-[#0097a7] hover:bg-[#00838f] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md"
              >
                <ShoppingCart className="w-4 h-4" />
                {isLoggedIn ? 'Add to Cart' : 'Login & Add'}
              </button>
            </div>
          </div>
        )
      })}

      {/* Custom Amount */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-bold text-[#0c2340]">Custom Amount</p>
          <p className="text-xs text-[#4a7fa5]">Minimum $100 CAD.</p>
        </div>
        
        {!isLoggedIn ? (
          <button
            onClick={() => router.push('/auth/login?redirect=/wallet')}
            className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-sm font-bold w-full sm:w-auto"
          >
            Login to select custom amount
          </button>
        ) : (
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              const val = Number((e.currentTarget.elements.namedItem('customAmt') as HTMLInputElement).value)
              if (val >= 100) {
                handleAddToCart({ pay: val, credits: val })
              } else {
                alert('Minimum custom amount is $100')
              }
            }}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <div className="relative flex-1 sm:w-32">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input 
                name="customAmt"
                type="number" 
                min="100" 
                step="1"
                placeholder="100"
                required
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 focus:border-[#0097a7] focus:outline-none text-sm font-bold text-[#0c2340]"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#0097a7] hover:bg-[#00838f] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md"
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
