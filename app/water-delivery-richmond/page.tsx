import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Droplets, MapPin, Star, Shield, Truck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Water Delivery Richmond — Spring, Alkaline & Distilled | Taj Water',
  description: 'Premium 5-gallon water jug delivery in Richmond, BC. Spring, alkaline, and distilled water delivered directly to your home or office. Same-day delivery available.',
  keywords: [
    'water delivery Richmond',
    'water delivery Richmond BC',
    '5 gallon water jug delivery Richmond',
    'alkaline water Richmond',
    'spring water Richmond',
    'distilled water Richmond',
    'water cooler delivery Richmond',
  ],
  alternates: { canonical: 'https://tajwater.ca/water-delivery-richmond' },
}

export default function WaterDeliveryRichmond() {
  return (
    <main className="min-h-screen">
      <section className="hero-gradient py-20 sm:py-28 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <MapPin className="w-4 h-4" /> Serving All of Richmond
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
            Premium Water Delivery in <span className="text-[#b3e5fc]">Richmond</span>
          </h1>
          <p className="text-[#b3e5fc] text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            Get 5-gallon jugs of spring, alkaline, or distilled water delivered straight to your door in Richmond. Fast, reliable, and hassle-free.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/shop" className="btn-primary text-lg px-8 py-4">
              View Products & Pricing
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-[#0c2340] mb-12">Why Choose TajWater in Richmond?</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="bg-[#f0f9ff] p-6 rounded-2xl border border-[#cce7f0]">
              <Truck className="w-10 h-10 text-[#0097a7] mx-auto mb-4" />
              <h3 className="font-bold text-[#0c2340] mb-2">Fast Local Delivery</h3>
              <p className="text-[#4a7fa5] text-sm">We cover all Richmond neighborhoods with same-day and scheduled delivery options.</p>
            </div>
            <div className="bg-[#f0f9ff] p-6 rounded-2xl border border-[#cce7f0]">
              <Droplets className="w-10 h-10 text-[#0097a7] mx-auto mb-4" />
              <h3 className="font-bold text-[#0c2340] mb-2">3 Water Types</h3>
              <p className="text-[#4a7fa5] text-sm">Choose from natural spring, pH balanced alkaline, or pure distilled water.</p>
            </div>
            <div className="bg-[#f0f9ff] p-6 rounded-2xl border border-[#cce7f0]">
              <Shield className="w-10 h-10 text-[#0097a7] mx-auto mb-4" />
              <h3 className="font-bold text-[#0c2340] mb-2">No Contracts</h3>
              <p className="text-[#4a7fa5] text-sm">Order exactly what you need, when you need it. Subscriptions are fully flexible.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f0f9ff]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-[#0c2340] mb-8">Ready to get started?</h2>
          <Link href="/shop" className="bg-[#0097a7] text-white hover:bg-[#006064] font-bold px-8 py-4 rounded-xl text-lg inline-block">
            Order Now for Richmond Delivery
          </Link>
        </div>
      </section>
    </main>
  )
}
