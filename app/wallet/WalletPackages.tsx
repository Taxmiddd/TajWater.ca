'use client'

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
}

export default function WalletPackages({ packages, isLoggedIn }: WalletPackagesProps) {
  const router = useRouter()
  const { addItem } = useCart()

  const handleAddToCart = (pkg: Package) => {
    // Add to cart store (which is persisted in localStorage)
    addItem({
      id: `wallet_credit_${pkg.pay}`,
      name: `Wallet Credit - $${pkg.pay}`,
      description: `Adds ${pkg.credits} credits to your TajWater Wallet`,
      price: pkg.pay,
      image_url: '/images/wallet-icon.png', // Placeholder
      stock: 999,
      category: 'wallet_credit',
      active: true,
    })

    if (!isLoggedIn) {
      router.push('/auth/login?redirect=/wallet')
    } else {
      // Optional: Give feedback or open cart drawer
      // Here we could just let them know it was added or send them to checkout
      // For now, redirecting to cart or showing toast would be good. 
      // Assuming there's a global cart UI, we'll just let the state update.
    }
  }

  return (
    <div className="space-y-4">
      {packages.map((pkg) => {
        const bonus = pkg.credits - pkg.pay
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
                <p className="font-bold text-[#0c2340]">Get {pkg.credits} Credits</p>
                <p className="text-xs text-[#4a7fa5]">Pay ${pkg.pay} CAD</p>
              </div>
            </div>
            <div className="text-right transition-transform group-hover:translate-x-12 opacity-100 group-hover:opacity-0">
              <span className="inline-block bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                +{bonus} Bonus
              </span>
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
          <p className="text-xs text-[#4a7fa5]">Minimum $100 CAD. <span className="text-slate-500 italic">No bonus credits given.</span></p>
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
