'use client'

import { useState } from 'react'
import { Gift, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

export default function PromotionSection() {
  const [activePromo, setActivePromo] = useState<'referral' | 'bulk' | 'seasonal'>('referral')

  const promotions = {
    referral: {
      icon: Gift,
      title: 'Refer a Friend & Save',
      description: 'Share TajWater with friends and family. Both of you get $25 off!',
      details: [
        'Unlimited referrals — keep earning credits',
        '$25 off for you and your friend on next order',
        'Perfect for families, offices, and communities',
        'Works with subscriptions too',
      ],
      cta: 'Get Your Referral Link',
      savings: '$25 OFF',
    },
    bulk: {
      icon: TrendingUp,
      title: 'Bulk Order Discounts',
      description: 'Order 10+ jugs and save 15-20% off regular pricing',
      details: [
        'Perfect for offices and large families',
        'Consistent supply with automatic scheduling',
        'Dedicated account management',
        'Net-30 invoicing for businesses',
      ],
      cta: 'Calculate Your Savings',
      savings: 'Up to 20% OFF',
    },
    seasonal: {
      icon: Users,
      title: 'Summer Hydration Pack',
      description: 'Special bundle pricing for summer months (May-August)',
      details: [
        'Subscribe to 4+ jugs/week and save 25%',
        'Includes free upgrade to Alkaline water once',
        'Priority same-day delivery',
        'Free first month at 50% off',
      ],
      cta: 'Claim Summer Offer',
      savings: '50% FIRST MONTH',
    },
  }

  const current = promotions[activePromo]
  const CurrentIcon = current.icon

  return (
    <section className="py-24 bg-white border-t border-[#cce7f0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-4">
            Save More with <span className="gradient-text">Promotions & Programs</span>
          </h2>
          <p className="text-[#4a7fa5] text-lg max-w-2xl mx-auto">
            Referral rewards, bulk discounts, and seasonal offers — because we want to make water affordable for everyone.
          </p>
        </div>

        {/* Promo Selector */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {(['referral', 'bulk', 'seasonal'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setActivePromo(key)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activePromo === key
                  ? 'bg-[#0097a7] text-white shadow-lg'
                  : 'bg-[#f0f9ff] text-[#0c2340] border-2 border-[#cce7f0] hover:border-[#0097a7]'
              }`}
            >
              {key === 'referral' ? '🎁 Referral' : key === 'bulk' ? '📦 Bulk' : '☀️ Seasonal'}
            </button>
          ))}
        </div>

        {/* Active Promotion Display */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side - Visual */}
          <div className="bg-gradient-to-br from-[#0097a7] to-[#006064] rounded-3xl p-12 flex flex-col justify-center text-white">
            <CurrentIcon className="w-16 h-16 mb-6" />
            <h3 className="text-3xl sm:text-4xl font-extrabold mb-3">{current.title}</h3>
            <p className="text-lg text-[#b3e5fc] mb-8">{current.description}</p>
            <div className="inline-block">
              <p className="text-5xl font-extrabold text-[#ffc107]">{current.savings}</p>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="bg-[#f0f9ff] rounded-3xl border-2 border-[#cce7f0] p-8">
            <h4 className="text-xl font-bold text-[#0c2340] mb-6">What's Included:</h4>
            <ul className="space-y-4 mb-8">
              {current.details.map((detail) => (
                <li key={detail} className="flex items-start gap-3">
                  <span className="text-[#0097a7] font-bold text-xl mt-0.5">✓</span>
                  <span className="text-[#4a7fa5]">{detail}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/shop"
              className="block w-full py-4 px-6 bg-gradient-to-r from-[#0097a7] to-[#00838f] text-white font-bold rounded-xl text-center hover:shadow-lg transition-shadow"
            >
              {current.cta}
            </Link>
          </div>
        </div>

        {/* Promo Overview Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(promotions).map(([key, promo]) => {
            const PromoIcon = promo.icon
            return (
              <div key={key} className="bg-white rounded-2xl border-2 border-[#cce7f0] p-6 hover:border-[#0097a7] hover:shadow-md transition-all cursor-pointer">
                <PromoIcon className="w-8 h-8 text-[#0097a7] mb-3" />
                <h4 className="font-bold text-[#0c2340] mb-2">{promo.title}</h4>
                <p className="text-sm text-[#4a7fa5] mb-4">{promo.description}</p>
                <p className="text-lg font-extrabold text-[#0097a7]">{promo.savings}</p>
              </div>
            )
          })}
        </div>

        {/* Additional Programs */}
        <div className="mt-12 bg-gradient-to-r from-[#0097a7] to-[#006064] rounded-3xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">💼 Corporate & Business Programs</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="font-semibold mb-2">Office Water Solutions</p>
              <ul className="text-sm text-[#b3e5fc] space-y-1">
                <li>✓ Custom volume pricing</li>
                <li>✓ Dedicated account manager</li>
                <li>✓ Flexible delivery schedules</li>
                <li>✓ Net-30 invoicing</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Restaurant & Retail</p>
              <ul className="text-sm text-[#b3e5fc] space-y-1">
                <li>✓ High-volume discounts</li>
                <li>✓ Priority delivery windows</li>
                <li>✓ Bulk equipment options</li>
                <li>✓ Commercial support line</li>
              </ul>
            </div>
          </div>
          <button className="mt-6 px-6 py-3 bg-white text-[#0097a7] font-bold rounded-xl hover:shadow-lg transition-shadow">
            Get a Corporate Quote
          </button>
        </div>

        {/* Limited Time Offer */}
        <div className="mt-8 bg-[#ffc107]/10 border-2 border-[#ffc107] rounded-2xl p-6 text-center">
          <p className="text-sm font-semibold text-[#ffc107] mb-2">🎉 LIMITED TIME</p>
          <p className="text-lg font-bold text-[#0c2340] mb-3">
            New customers get <span className="text-[#0097a7]">$30 OFF</span> their first 2 orders
          </p>
          <p className="text-sm text-[#4a7fa5] mb-4">
            Use code WELCOME30 at checkout. Valid through end of month.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-[#0097a7] text-white font-bold rounded-xl hover:shadow-lg transition-shadow"
          >
            Claim Your Discount
          </Link>
        </div>
      </div>
    </section>
  )
}
