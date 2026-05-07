import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Water Delivery vs Home Water Filter in Metro Vancouver (2026 Guide)',
  description: 'Comparing 5-gallon water delivery vs under-sink or countertop water filters for Metro Vancouver homes. Costs, pros, cons, and which is right for your household.',
  keywords: [
    'water delivery vs water filter Vancouver',
    'water delivery or home filter Metro Vancouver',
    'under sink filter vs water delivery',
    'reverse osmosis vs water delivery Vancouver',
    'water filter vs bottled water delivery',
    'is water delivery cheaper than water filter',
    'home water filtration Vancouver',
    'best drinking water option Vancouver',
  ],
  alternates: { canonical: 'https://tajwater.ca/blog/water-delivery-vs-home-water-filter-metro-vancouver' },
  openGraph: {
    title: 'Water Delivery vs Home Water Filter in Metro Vancouver (2026 Guide)',
    description: 'Comparing 5-gallon water delivery vs home water filters for Metro Vancouver homes. Real cost analysis, pros, cons, and which is right for you.',
    url: 'https://tajwater.ca/blog/water-delivery-vs-home-water-filter-metro-vancouver',
    type: 'article',
    images: [{ url: 'https://tajwater.ca/opengraph-image', width: 1200, height: 630 }],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Water Delivery vs Home Water Filter in Metro Vancouver (2026 Guide)',
      description: 'Comparing 5-gallon water delivery vs under-sink or countertop water filters for Metro Vancouver homes. Costs, pros, cons, and which is right for your household.',
      datePublished: '2026-05-13',
      dateModified: '2026-05-13',
      author: { '@type': 'Organization', name: 'TajWater', url: 'https://tajwater.ca' },
      publisher: {
        '@type': 'Organization',
        name: 'TajWater',
        url: 'https://tajwater.ca',
        logo: { '@type': 'ImageObject', url: 'https://tajwater.ca/opengraph-image' },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://tajwater.ca/blog/water-delivery-vs-home-water-filter-metro-vancouver' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is water delivery cheaper than a home water filter in Vancouver?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It depends on your usage. A reverse osmosis system costs $400–$800 upfront plus $100–$200/year in filters, which works out to about $0.02–$0.05/litre over 5 years. TajWater water delivery on a subscription costs $6.49–$8.99/jug ($0.34–$0.48/litre). Water delivery is more expensive per litre but requires zero upfront investment, no installation, no maintenance, and gives you bottled-quality water in convenient 5-gallon jugs.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is better for families with babies — water delivery or a filter?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Both can work, but water delivery (specifically distilled water) is the most reliable choice for infant formula because it contains no minerals, fluoride, or chlorine that could interfere with formula nutrition. A reverse osmosis filter also removes these contaminants. Spring water delivery is also commonly used for infants over 6 months. The advantage of water delivery is guaranteed purity on every jug without needing to maintain filter cartridges.',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tajwater.ca' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://tajwater.ca/blog' },
        { '@type': 'ListItem', position: 3, name: 'Water Delivery vs Home Filter', item: 'https://tajwater.ca/blog/water-delivery-vs-home-water-filter-metro-vancouver' },
      ],
    },
  ],
}

export default function WaterDeliveryVsFilter() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen bg-[#f0f9ff]">
        <section className="hero-gradient py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[#b3e5fc] hover:text-white text-sm font-semibold mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white">Buyer's Guide</span>
              <span className="text-[#b3e5fc] text-sm">May 13, 2026</span>
              <span className="text-[#b3e5fc] text-sm">· 7 min read</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Water Delivery vs Home Water Filter in Metro Vancouver (2026 Guide)
            </h1>
          </div>
        </section>

        <article className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

            <p className="text-[#4a7fa5] text-lg leading-relaxed mb-8">
              Every household in Metro Vancouver eventually faces this question: should you get bottled water delivered to your door,
              or install a home water filter? Both solve the same problem — getting better-tasting, cleaner water — but in very different ways.
              This guide breaks down the real costs, pros, and cons of each option so you can make an informed decision.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-12 mb-6">The Core Difference</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              <strong className="text-[#0c2340]">Water delivery</strong> means a company brings pre-purified water to your home in
              5-gallon jugs on a regular schedule. You store the jugs and use them as needed.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-8">
              <strong className="text-[#0c2340]">A home water filter</strong> — whether under-sink, countertop, or whole-home —
              filters your tap water in real time at the point of use. You pay upfront for the system, then ongoing costs for filter replacements.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-12 mb-6">Cost Comparison: Real Numbers for Metro Vancouver</h2>

            <div className="overflow-x-auto rounded-2xl border border-[#cce7f0] bg-white shadow-sm mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#e0f7fa]">
                    <th className="text-left px-5 py-4 font-bold text-[#0c2340]">Cost Factor</th>
                    <th className="text-left px-5 py-4 font-bold text-[#0097a7]">Water Delivery</th>
                    <th className="text-left px-5 py-4 font-bold text-[#0c2340]">RO Filter (Under-Sink)</th>
                    <th className="text-left px-5 py-4 font-bold text-[#0c2340]">Countertop Filter</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Upfront cost', '$0', '$400–$800 installed', '$60–$300'],
                    ['Annual filter cost', '$0', '$100–$200/yr', '$50–$150/yr'],
                    ['Annual water cost (family of 4)', '$312–$624/yr*', '$0', '$0'],
                    ['5-year total cost', '$1,560–$3,120', '$900–$1,800', '$310–$1,050'],
                    ['Cost per litre', '$0.34–$0.48', '$0.02–$0.05', '$0.08–$0.20'],
                    ['Installation required', 'None', 'Plumber recommended', 'No'],
                    ['Maintenance required', 'None', 'Filter changes 1–2×/yr', 'Filter changes 2–4×/yr'],
                  ].map(([factor, delivery, ro, counter], i) => (
                    <tr key={factor} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f8feff]'}>
                      <td className="px-5 py-3 font-semibold text-[#0c2340] border-b border-[#cce7f0]">{factor}</td>
                      <td className="px-5 py-3 text-[#0097a7] font-medium border-b border-[#cce7f0]">{delivery}</td>
                      <td className="px-5 py-3 text-[#4a7fa5] border-b border-[#cce7f0]">{ro}</td>
                      <td className="px-5 py-3 text-[#4a7fa5] border-b border-[#cce7f0]">{counter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#4a7fa5] mb-8">
              *Based on 2–4 jugs/month at TajWater subscription pricing ($6.49–$8.99/jug). Family of 4 typically uses 2–4 five-gallon jugs per month for drinking water.
            </p>

            <p className="text-[#4a7fa5] leading-relaxed mb-8">
              On a strict per-litre basis, a reverse osmosis filter is significantly cheaper over 5 years. However, cost per litre is not the whole story.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-12 mb-6">Where Water Delivery Wins</h2>

            <div className="space-y-4 mb-8">
              {[
                {
                  title: 'Zero upfront cost',
                  desc: 'No installation, no equipment purchase. You start receiving premium water immediately with no capital outlay. For renters, this is often the only practical option — you cannot install an under-sink filter in a rented unit without landlord approval.',
                },
                {
                  title: 'Multiple water types available',
                  desc: 'With delivery, you can choose spring, alkaline, or distilled water — and even get different types for different uses (e.g., distilled for your CPAP, spring for drinking). A single home filter produces one type of filtered water.',
                },
                {
                  title: 'Distilled water for CPAP and medical use',
                  desc: 'No home filter produces truly distilled water. CPAP machines, baby formula, and medical equipment require distilled water — a need that only water delivery can meet from your home tap.',
                },
                {
                  title: 'Portability and convenience',
                  desc: 'Stored 5-gallon jugs are available even during tap water disruptions (boil advisories, infrastructure failures). Metro Vancouver has experienced occasional boil advisories — your delivery water is unaffected.',
                },
                {
                  title: 'No maintenance or filter changes',
                  desc: 'Water delivery requires no maintenance whatsoever. RO systems need filter changes every 6–12 months; if you forget, water quality degrades. Delivery water is consistent batch to batch.',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 bg-white rounded-xl border border-[#cce7f0] p-5">
                  <CheckCircle className="w-5 h-5 text-[#0097a7] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#0c2340] mb-1">{item.title}</p>
                    <p className="text-[#4a7fa5] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-12 mb-6">Where Home Filters Win</h2>

            <div className="space-y-4 mb-8">
              {[
                {
                  title: 'Lower long-term cost per litre',
                  desc: 'If you drink a lot of water and plan to stay in your home for 3–5+ years, an RO system can cost significantly less per litre than delivery. The payback period for an installed RO system is typically 3–5 years compared to delivery costs.',
                },
                {
                  title: 'Unlimited supply on demand',
                  desc: 'A filter produces water on demand — no waiting for a delivery, no running out between deliveries. You always have as much as you need directly from the tap.',
                },
                {
                  title: 'Less plastic usage',
                  desc: 'Although TajWater reuses and sanitizes all jugs, home filters have no ongoing plastic waste at all. If reducing plastic is a priority, a filter has a smaller ongoing footprint.',
                },
                {
                  title: 'Good for high-volume cooking',
                  desc: 'For households that use filtered water for cooking, soup stocks, pasta, and other high-volume uses, running a faucet filter is far more practical than cycling through 5-gallon jugs.',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 bg-white rounded-xl border border-[#cce7f0] p-5">
                  <XCircle className="w-5 h-5 text-[#4a7fa5] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#0c2340] mb-1">{item.title}</p>
                    <p className="text-[#4a7fa5] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-12 mb-6">Which is Right for You? A Decision Guide</h2>

            <div className="bg-white rounded-2xl border border-[#cce7f0] overflow-hidden mb-8">
              <div className="bg-[#0097a7] px-6 py-4">
                <h3 className="text-white font-bold text-lg">Choose Water Delivery if you...</h3>
              </div>
              <div className="p-6 space-y-3">
                {[
                  'Rent your home and cannot install under-sink equipment',
                  'Need distilled water for a CPAP machine or baby formula',
                  'Want multiple water types (spring for drinking, distilled for medical)',
                  'Prefer zero maintenance and zero upfront cost',
                  'Want a reliable supply even during local tap water disruptions',
                  'Already have or want to get a water cooler/dispenser',
                  'Have an office or commercial space that needs regular water supply',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-[#4a7fa5]">
                    <CheckCircle className="w-4 h-4 text-[#0097a7] shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#cce7f0] overflow-hidden mb-8">
              <div className="bg-[#f0f9ff] border-b border-[#cce7f0] px-6 py-4">
                <h3 className="text-[#0c2340] font-bold text-lg">Choose a Home Filter if you...</h3>
              </div>
              <div className="p-6 space-y-3">
                {[
                  'Own your home and are comfortable with a plumbing installation',
                  'Use large amounts of filtered water for cooking as well as drinking',
                  'Are planning to stay in your home for 5+ years',
                  'Want the absolute lowest ongoing cost per litre',
                  'Prefer unlimited on-demand water without delivery scheduling',
                  'Have no need for distilled or alkaline water specifically',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-[#4a7fa5]">
                    <CheckCircle className="w-4 h-4 text-[#4a7fa5] shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-12 mb-4">Many Metro Vancouver Households Do Both</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              A common setup is to have a countertop filter for high-volume uses (cooking, coffee, everyday tap drinking)
              and a water delivery subscription for premium drinking water, CPAP machines, or specific water types.
              This gives you the best of both worlds without the high cost of using delivered jugs for everything.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-8">
              TajWater also offers water filter installation services for under-sink reverse osmosis and whole-home filtration —
              so whether you choose delivery, a filter, or both, we can help.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-12 mb-4">Bottom Line</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Water delivery costs more per litre than a home filter, but it offers convenience, flexibility, multiple water types,
              zero upfront cost, and zero maintenance. It is the better choice for renters, households with specific water needs
              (CPAP, infants), and anyone who values simplicity over cost optimization.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-8">
              A home filter is the better long-term value for homeowners with high water usage and no specialized needs — but
              only if you stay on top of filter maintenance.
            </p>

            {/* CTA */}
            <div className="bg-gradient-to-r from-[#0097a7] to-[#006064] rounded-3xl p-8 text-center text-white mt-12">
              <h3 className="text-2xl font-extrabold mb-3">Try TajWater Delivery — No Commitment</h3>
              <p className="text-[#b3e5fc] mb-6">
                Order one jug, no subscription required. Spring water from $8.99. Free delivery across Metro Vancouver.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop" className="bg-white text-[#0097a7] font-bold px-6 py-3 rounded-xl hover:bg-[#f0f9ff] transition-colors">
                  Order Water Delivery
                </Link>
                <Link href="/services" className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                  View Filter Installation
                </Link>
              </div>
            </div>

            {/* Related posts */}
            <div className="mt-12">
              <h3 className="text-xl font-extrabold text-[#0c2340] mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { href: '/blog/how-much-does-water-delivery-cost-metro-vancouver', title: 'How Much Does Water Delivery Cost in Metro Vancouver? (2026 Price Guide)' },
                  { href: '/blog/spring-vs-alkaline-vs-distilled-water-vancouver', title: 'Spring vs Alkaline vs Distilled Water: Which Should You Drink in Vancouver?' },
                  { href: '/blog/is-vancouver-tap-water-safe-to-drink', title: 'Is Vancouver Tap Water Safe to Drink in 2026?' },
                  { href: '/blog/switching-water-delivery-providers-metro-vancouver', title: 'Time to Switch Your Water Delivery Provider in Metro Vancouver?' },
                ].map((post) => (
                  <Link key={post.href} href={post.href} className="bg-white rounded-xl border border-[#cce7f0] p-4 hover:border-[#0097a7]/40 hover:shadow-sm transition-all group">
                    <p className="text-sm font-semibold text-[#0c2340] group-hover:text-[#0097a7] transition-colors leading-snug">{post.title}</p>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </article>
      </main>
    </>
  )
}
