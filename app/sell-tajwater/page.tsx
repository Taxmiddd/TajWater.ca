import type { Metadata } from 'next'
import { Building, DollarSign, Truck, Users, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sell TajWater — Wholesale & Partnership Opportunities',
  description: 'Become a reseller of TajWater. Wholesale pricing on premium spring, alkaline, and distilled water for your business.',
}

const benefits = [
  {
    icon: DollarSign,
    title: 'High Margins',
    description: 'Enjoy competitive wholesale pricing that allows for excellent retail margins.',
  },
  {
    icon: Truck,
    title: 'Reliable Delivery',
    description: 'Consistent, scheduled deliveries directly to your storefront or warehouse.',
  },
  {
    icon: CheckCircle2,
    title: 'Premium Quality',
    description: 'Offer your customers the best tasting, rigorously tested water in the region.',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description: 'Get a dedicated account manager to handle your inventory and delivery needs.',
  },
]

export default function SellTajWaterPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#f0f9ff]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0097a7]/10 to-[#1565c0]/5 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#0c2340] tracking-tight mb-6">
            Partner with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0097a7] to-[#1565c0]">TajWater</span>
          </h1>
          <p className="mt-4 text-xl text-[#4a7fa5] max-w-2xl mx-auto mb-10">
            Join our growing network of retailers, gyms, offices, and distributors. Offer your customers premium hydration while growing your bottom line.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-[#0097a7] hover:bg-[#006064] text-white h-14 px-8 text-lg rounded-2xl shadow-lg w-full sm:w-auto">
                Apply for Wholesale
              </Button>
            </Link>
            <Link href="/shop">
              <Button size="lg" variant="outline" className="border-[#0097a7] text-[#0097a7] hover:bg-[#e0f7fa] h-14 px-8 text-lg rounded-2xl w-full sm:w-auto bg-white">
                View Our Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-[#0c2340]">Why Sell TajWater?</h2>
          <p className="mt-4 text-[#4a7fa5]">We provide everything you need to successfully retail our water.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon
            return (
              <div key={i} className="bg-white rounded-3xl p-8 border border-[#cce7f0] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-[#e0f7fa] flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-[#0097a7]" />
                </div>
                <h3 className="text-xl font-bold text-[#0c2340] mb-3">{benefit.title}</h3>
                <p className="text-[#4a7fa5]">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl border border-[#cce7f0] p-8 md:p-12 shadow-sm text-center">
          <Building className="w-16 h-16 text-[#0097a7] mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold text-[#0c2340] mb-6">Ready to get started?</h2>
          <p className="text-[#4a7fa5] mb-8 max-w-xl mx-auto">
            Whether you run a local grocery store, a fitness center, or a corporate office, we have tailored wholesale packages for you. Contact our sales team today to discuss pricing and delivery schedules.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-[#0097a7] hover:bg-[#006064] text-white h-14 px-8 text-lg rounded-2xl shadow-lg">
              Contact Sales Team
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
