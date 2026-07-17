import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Wallet, Gift, CheckCircle2, ShieldCheck, Zap, ArrowRight, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import WalletPackages from './WalletPackages'

export const metadata = {
  title: 'TajWater Wallet | Bonus Credits & Easy Payments',
  description: 'Load your TajWater wallet and earn bonus credits. The smartest way to pay for water refills and products in Vancouver.',
}

export default async function WalletInfoPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      }
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const isLoggedIn = !!session
  
  let isBusiness = false
  if (isLoggedIn) {
    const { data: prof } = await supabase.from('profiles').select('account_type').eq('id', session.user.id).single()
    if (prof?.account_type === 'business') isBusiness = true
  }

  const features = [
    {
      icon: <Gift className="w-6 h-6 text-[#0097a7]" />,
      title: 'Earn Bonus Credits',
      description: 'Get extra credits on every top-up. The more you load, the more bonus credits you receive automatically.'
    },
    {
      icon: <Zap className="w-6 h-6 text-[#1565c0]" />,
      title: 'Seamless Checkout',
      description: 'Skip the credit card entry. Pay for water jugs and accessories instantly using your wallet balance.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#0097a7]" />,
      title: 'Secure & Transparent',
      description: 'View your complete transaction history, balance updates, and recharge receipts in your dashboard at any time.'
    },
    {
      icon: <CreditCard className="w-6 h-6 text-[#1565c0]" />,
      title: 'Auto-Apply to Subscriptions',
      description: 'Future updates will allow your wallet balance to seamlessly cover your recurring water deliveries.'
    }
  ]

  const packages = [
    { pay: 100, credits: 107 },
    { pay: 200, credits: 220 },
    { pay: 300, credits: 330 },
    { pay: 400, credits: 450 },
    { pay: 500, credits: 600 },
  ]

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e0f7fa] border border-[#0097a7]/20 text-[#0097a7] text-sm font-bold">
              <Wallet className="w-4 h-4" />
              TajWater Wallet
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0c2340] leading-tight">
              The smartest way to pay for your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0097a7] to-[#1565c0]">pure water.</span>
            </h1>
            <p className="text-lg text-[#4a7fa5] max-w-xl leading-relaxed">
              Load funds into your account and unlock bonus credits instantly. Use your balance for fast, secure checkout on all products and refills.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              {isLoggedIn ? (
                <Link href="/dashboard/wallet">
                  <Button className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-gradient-to-r from-[#0097a7] to-[#1565c0] hover:from-[#00838f] hover:to-[#0d47a1] text-white shadow-xl shadow-[#0097a7]/20 rounded-2xl gap-2 transition-all hover:scale-105">
                    Buy Credits <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/login?redirect=/dashboard/wallet">
                  <Button className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-gradient-to-r from-[#0097a7] to-[#1565c0] hover:from-[#00838f] hover:to-[#0d47a1] text-white shadow-xl shadow-[#0097a7]/20 rounded-2xl gap-2 transition-all hover:scale-105">
                    Login to Access Wallet <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0097a7]/20 to-[#1565c0]/20 rounded-[3rem] blur-3xl transform -rotate-6" />
            <div className="relative bg-white border border-[#cce7f0] p-8 sm:p-12 rounded-[2rem] shadow-2xl">
              <h3 className="text-2xl font-bold text-[#0c2340] mb-6 text-center">Bonus Packages</h3>
              <WalletPackages packages={packages} isLoggedIn={isLoggedIn} isBusiness={isBusiness} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-y border-[#cce7f0] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0c2340] mb-4">Why use the TajWater Wallet?</h2>
            <p className="text-lg text-[#4a7fa5]">
              Experience the fastest, most rewarding way to keep your home or office stocked with premium water.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 p-6 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: `${300 + idx * 100}ms`, animationFillMode: 'both' }}>
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0c2340] mb-3">{feature.title}</h3>
                <p className="text-[#4a7fa5] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ/How it works */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-extrabold text-[#0c2340] mb-10 text-center animate-in fade-in slide-in-from-bottom-8">How it Works</h2>
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 delay-150">
          <div className="flex gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-[#0097a7] text-white font-bold flex items-center justify-center mt-1">1</div>
            <div>
              <h4 className="text-xl font-bold text-[#0c2340] mb-2">Create an Account or Log In</h4>
              <p className="text-[#4a7fa5] leading-relaxed">You must have an active TajWater account to hold a wallet balance. Your credits are tied securely to your profile.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-[#0097a7] text-white font-bold flex items-center justify-center mt-1">2</div>
            <div>
              <h4 className="text-xl font-bold text-[#0c2340] mb-2">Add Funds & Get Bonuses</h4>
              <p className="text-[#4a7fa5] leading-relaxed">Navigate to your Wallet Dashboard, select a package, and pay securely via Square using your saved card. Bonus credits are applied instantly.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-[#0097a7] text-white font-bold flex items-center justify-center mt-1">3</div>
            <div>
              <h4 className="text-xl font-bold text-[#0c2340] mb-2">Checkout with Wallet</h4>
              <p className="text-[#4a7fa5] leading-relaxed">When checking out in the shop, select &quot;Wallet Balance&quot; as your payment method. 1 Credit = $1 CAD. Please note: Delivery fees must be paid separately with a card.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-center">
        <div className="bg-gradient-to-br from-[#0c2340] to-[#1565c0] rounded-[2rem] p-10 sm:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to start earning?</h2>
            <p className="text-[#b3e5fc] text-lg mb-8 max-w-xl mx-auto">
              Join hundreds of happy customers who are already saving on every drop of pure water.
            </p>
            {isLoggedIn ? (
              <Link href="/dashboard/wallet">
                <Button className="h-14 px-8 text-lg font-bold bg-white text-[#0097a7] hover:bg-slate-100 rounded-xl shadow-lg transition-all hover:scale-105">
                  Recharge My Wallet
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login?redirect=/dashboard/wallet">
                <Button className="h-14 px-8 text-lg font-bold bg-white text-[#0097a7] hover:bg-slate-100 rounded-xl shadow-lg transition-all hover:scale-105">
                  Log in to get started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
