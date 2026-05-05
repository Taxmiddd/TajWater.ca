'use client'

import { useState, useMemo } from 'react'
import { Calculator, DollarSign, TrendingDown } from 'lucide-react'

export default function SavingsCalculator() {
  const [jugsPerMonth, setJugsPerMonth] = useState(4)
  const [waterType, setWaterType] = useState<'spring' | 'alkaline' | 'distilled'>('spring')
  const [useSubscription, setUseSubscription] = useState(false)

  const prices = {
    spring: { regular: 8.99, subscription: 6.49 },
    alkaline: { regular: 12.99, subscription: 9.49 },
    distilled: { regular: 9.99, subscription: 7.49 },
  }

  const calculations = useMemo(() => {
    const pricePerJug = useSubscription ? prices[waterType].subscription : prices[waterType].regular
    const monthlyTotal = jugsPerMonth * pricePerJug
    const yearlyTotal = monthlyTotal * 12

    // Estimate competitor pricing (15% higher on average)
    const competitorPrice = pricePerJug * 1.15
    const competitorMonthly = jugsPerMonth * competitorPrice
    const competitorYearly = competitorMonthly * 12

    const saveMonthly = Math.round((competitorMonthly - monthlyTotal) * 100) / 100
    const saveYearly = Math.round((competitorYearly - yearlyTotal) * 100) / 100

    return {
      monthlyTotal,
      yearlyTotal,
      saveMonthly,
      saveYearly,
      pricePerJug,
      competitorPrice,
    }
  }, [jugsPerMonth, waterType, useSubscription])

  return (
    <section className="py-24 bg-white border-t border-[#cce7f0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#e0f7fa] flex items-center justify-center">
              <Calculator className="w-6 h-6 text-[#0097a7]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340]">
              See Your Savings
            </h2>
          </div>
          <p className="text-[#4a7fa5] text-lg max-w-2xl mx-auto">
            Calculate exactly how much you'll save by switching to TajWater compared to big box stores and competitors.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Controls */}
          <div className="bg-[#f0f9ff] rounded-3xl border-2 border-[#cce7f0] p-8">
            <h3 className="text-xl font-bold text-[#0c2340] mb-6">Customize Your Estimate</h3>

            {/* Jugs per Month Slider */}
            <div className="mb-8">
              <label className="block text-[#0c2340] font-semibold mb-3">
                Jugs per Month: <span className="text-[#0097a7] text-2xl">{jugsPerMonth}</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={jugsPerMonth}
                onChange={(e) => setJugsPerMonth(Number(e.target.value))}
                className="w-full h-3 bg-[#cce7f0] rounded-lg appearance-none cursor-pointer accent-[#0097a7]"
              />
              <div className="flex justify-between text-sm text-[#4a7fa5] mt-2">
                <span>Light Use (1 jug)</span>
                <span>Heavy Use (20 jugs)</span>
              </div>
            </div>

            {/* Water Type Selection */}
            <div className="mb-8">
              <label className="block text-[#0c2340] font-semibold mb-3">Water Type</label>
              <div className="grid grid-cols-3 gap-3">
                {(['spring', 'alkaline', 'distilled'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setWaterType(type)}
                    className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                      waterType === type
                        ? 'bg-[#0097a7] text-white shadow-lg'
                        : 'bg-white text-[#0c2340] border-2 border-[#cce7f0] hover:border-[#0097a7]'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Subscription Toggle */}
            <div className="flex items-center gap-4 bg-white rounded-2xl p-4 border-2 border-[#cce7f0]">
              <label className="flex items-center gap-3 flex-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSubscription}
                  onChange={(e) => setUseSubscription(e.target.checked)}
                  className="w-5 h-5 accent-[#0097a7]"
                />
                <span className="text-[#0c2340] font-semibold">Include Subscription Discount</span>
              </label>
              <span className="text-[#0097a7] font-bold text-sm">-20%</span>
            </div>

            {/* Price Breakdown */}
            <div className="mt-8 space-y-3 bg-white rounded-2xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-[#4a7fa5] text-sm">Price per jug:</span>
                <span className="font-bold text-[#0097a7]">${calculations.pricePerJug.toFixed(2)}</span>
              </div>
              <div className="border-t border-[#cce7f0] pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#4a7fa5]">Competitor price:</span>
                  <span className="line-through text-[#4a7fa5]">${calculations.competitorPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Display */}
          <div className="space-y-6">
            {/* Monthly Savings */}
            <div className="bg-gradient-to-br from-[#0097a7] to-[#006064] rounded-3xl p-8 text-white shadow-xl">
              <p className="text-[#b3e5fc] text-sm font-semibold mb-2">MONTHLY SAVINGS</p>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-5xl font-extrabold">${calculations.saveMonthly.toFixed(2)}</p>
                  <p className="text-[#b3e5fc] mt-2">vs. Other Options</p>
                </div>
                <TrendingDown className="w-12 h-12 text-[#b3e5fc]" />
              </div>
            </div>

            {/* Yearly Savings */}
            <div className="bg-gradient-to-br from-[#1565c0] to-[#0c3c8f] rounded-3xl p-8 text-white shadow-xl">
              <p className="text-blue-200 text-sm font-semibold mb-2">ANNUAL SAVINGS</p>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-5xl font-extrabold">${calculations.saveYearly.toFixed(2)}</p>
                  <p className="text-blue-200 mt-2">Per Year</p>
                </div>
                <DollarSign className="w-12 h-12 text-blue-200" />
              </div>
            </div>

            {/* Cost Breakdown Box */}
            <div className="bg-[#f0f9ff] rounded-3xl border-2 border-[#cce7f0] p-6">
              <h4 className="font-bold text-[#0c2340] mb-4">Your Monthly Costs</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-[#cce7f0]">
                  <span className="text-[#4a7fa5]">TajWater ({jugsPerMonth} jugs/month)</span>
                  <span className="font-bold text-[#0097a7]">${calculations.monthlyTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#4a7fa5]">Competitor Estimate</span>
                  <span className="line-through text-[#4a7fa5]">${(calculations.monthlyTotal + calculations.saveMonthly).toFixed(2)}</span>
                </div>
              </div>

              {/* Benefits List */}
              <div className="mt-6 pt-6 border-t border-[#cce7f0]">
                <p className="text-sm font-semibold text-[#0c2340] mb-3">What's Included:</p>
                <ul className="space-y-2 text-sm">
                  {[
                    'Free delivery to your door',
                    'Easy jug swap system',
                    useSubscription ? 'Subscription discounts' : 'Flexible ordering',
                    'Same-day delivery available',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[#4a7fa5]">
                      <span className="text-[#0097a7] font-bold mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <a
              href="/shop"
              className="block w-full py-4 px-6 bg-gradient-to-r from-[#0097a7] to-[#00838f] text-white font-bold rounded-2xl text-center hover:shadow-lg transition-shadow"
            >
              Start Saving Today → Order Now
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-[#4a7fa5] text-center mt-8">
          *Estimates based on average competitor pricing in Metro Vancouver. Actual savings may vary. Subscription prices require monthly commitment.
        </p>
      </div>
    </section>
  )
}
