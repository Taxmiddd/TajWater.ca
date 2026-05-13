import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'How Much Does Water Delivery Cost in Metro Vancouver? (2026 Price Guide)',
  description: 'Transparent 2026 pricing for 5-gallon water jug delivery across Metro Vancouver. See TajWater\'s full pricing for spring, alkaline, and distilled water — no quotes needed.',
  keywords: [
    'water delivery cost Vancouver 2026',
    'how much does water delivery cost Vancouver',
    '5 gallon water jug price Vancouver',
    'water delivery price comparison BC',
    'cheapest water delivery Metro Vancouver',
    'water delivery subscription Vancouver',
    'water delivery price Metro Vancouver',
  ],
  alternates: { canonical: '/blog/how-much-does-water-delivery-cost-metro-vancouver' },
  openGraph: {
    title: 'Water Delivery Prices in Metro Vancouver — 2026 Guide',
    description: 'Transparent pricing comparison for 5-gallon water jug delivery across Vancouver, Burnaby, Surrey, and all Metro Vancouver cities.',
    url: '/blog/how-much-does-water-delivery-cost-metro-vancouver',
    type: 'article',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Water Delivery Price Guide Metro Vancouver 2026' }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How Much Does Water Delivery Cost in Metro Vancouver? (2026 Price Guide)',
  description: 'Transparent 2026 pricing for 5-gallon water jug delivery across Metro Vancouver.',
  datePublished: '2026-04-29',
  dateModified: '2026-04-29',
  author: { '@type': 'Organization', name: 'TajWater', url: 'https://tajwater.ca' },
  publisher: { '@type': 'Organization', name: 'TajWater', url: 'https://tajwater.ca', logo: { '@type': 'ImageObject', url: 'https://tajwater.ca/logo/tajcyan.svg' } },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://tajwater.ca/blog/how-much-does-water-delivery-cost-metro-vancouver' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How much does 5-gallon water delivery cost in Vancouver?', acceptedAnswer: { '@type': 'Answer', text: 'In Metro Vancouver, 5-gallon (20L) water jug delivery typically costs between $7.50 and $13.00 per jug depending on the provider and water type. TajWater charges $8.99 per jug for spring water with free delivery, $12.99 for alkaline, and $9.99 for distilled. Subscription customers pay from $6.49 per jug.' } },
    { '@type': 'Question', name: 'Is there a bottle deposit for water jugs in Vancouver?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Most Metro Vancouver water delivery companies charge a one-time bottle deposit when you place your first order. TajWater charges $12 per jug as a refundable deposit. This is returned to your account when you stop service and return your jugs.' } },
    { '@type': 'Question', name: 'Is water delivery cheaper than buying bottled water at the grocery store?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, significantly. A 5-gallon (20L) jug delivered by TajWater costs $8.99 — that is $0.45 per litre. A case of 24 x 500mL bottles at a Vancouver grocery store costs approximately $5–$8, which works out to $0.42–$0.67 per litre. Beyond cost, delivery eliminates plastic waste, shopping trips, and heavy lifting.' } },
    { '@type': 'Question', name: 'Does TajWater charge extra for delivery in Surrey or Langley?', acceptedAnswer: { '@type': 'Answer', text: 'No. TajWater charges the same per-jug price and zero delivery fee across all 21 service zones in Metro Vancouver — including Surrey, Langley, Delta, Maple Ridge, Squamish, and Whistler. There is no distance surcharge.' } },
  ],
}

export default function ArticlePage() {
  return (
    <>
      <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-4">
            <Link href="/blog" className="text-sm text-[#0097a7] hover:underline">← Back to Blog</Link>
          </div>

          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[#e0f7fa] text-[#0097a7] mb-4">Pricing</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-4 leading-tight">
            How Much Does Water Delivery Cost in Metro Vancouver? (2026 Price Guide)
          </h1>
          <p className="text-[#4a7fa5] text-sm mb-8">Published April 29, 2026 · 5 min read · By TajWater</p>

          <div className="text-[#0c2340]">
            <p className="text-lg text-[#4a7fa5] leading-relaxed mb-8">
              Water delivery pricing in Metro Vancouver is surprisingly inconsistent — some providers show prices
              clearly, others require you to call for a quote. This guide lays out what you can actually expect to
              pay, what is included, and where you can find the best value in 2026.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">What Affects the Price of Water Delivery?</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Four factors determine what you pay for water delivery in Metro Vancouver:
            </p>
            <ul className="space-y-2 mb-6 text-[#4a7fa5]">
              <li><strong className="text-[#0c2340]">Water type</strong> — spring is the most affordable, alkaline the most expensive due to the mineralisation process.</li>
              <li><strong className="text-[#0c2340]">Order volume</strong> — most providers offer per-jug discounts when you order 5, 10, or more jugs.</li>
              <li><strong className="text-[#0c2340]">Delivery frequency</strong> — subscription (recurring) customers almost always pay less per jug than one-time order customers.</li>
              <li><strong className="text-[#0c2340]">Your location</strong> — some providers charge extra for outer zones like Langley, Delta, or Squamish. Others (like TajWater) use flat pricing across all zones.</li>
            </ul>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">TajWater 2026 Pricing — Metro Vancouver</h2>
            <div className="overflow-x-auto rounded-xl border border-[#cce7f0] mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#e0f7fa]">
                    <th className="text-left px-4 py-3 font-bold text-[#0c2340]">Water Type</th>
                    <th className="text-left px-4 py-3 font-bold text-[#0c2340]">1–4 Jugs</th>
                    <th className="text-left px-4 py-3 font-bold text-[#0c2340]">5–9 Jugs</th>
                    <th className="text-left px-4 py-3 font-bold text-[#0c2340]">10+ / Subscription</th>
                    <th className="text-left px-4 py-3 font-bold text-[#0c2340]">Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Spring Water (5 gal)', '$8.99', '$7.99', 'From $6.49', 'Free'],
                    ['Alkaline Water (5 gal)', '$12.99', '$11.99', 'From $9.99', 'Free'],
                    ['Distilled Water (5 gal)', '$9.99', '$8.99', 'From $7.49', 'Free'],
                  ].map(([type, s, m, l, del], i) => (
                    <tr key={type} className={i < 2 ? 'border-b border-[#cce7f0]' : ''}>
                      <td className="px-4 py-3 font-medium text-[#0c2340]">{type}</td>
                      <td className="px-4 py-3 text-[#4a7fa5]">{s}</td>
                      <td className="px-4 py-3 text-[#4a7fa5]">{m}</td>
                      <td className="px-4 py-3 font-semibold text-[#0097a7]">{l}</td>
                      <td className="px-4 py-3 text-[#4a7fa5]">{del}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#4a7fa5] mb-8">
              A one-time refundable bottle deposit of $12 per jug applies on your first order.
              Same pricing applies across all 21 Metro Vancouver delivery zones — no zone surcharges.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">What to Expect When Comparing Providers</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Water delivery pricing across Metro Vancouver varies widely. When evaluating any provider, look for these key factors:
            </p>
            <div className="overflow-x-auto rounded-xl border border-[#cce7f0] mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#e0f7fa]">
                    <th className="text-left px-4 py-3 font-bold text-[#0c2340]">Factor</th>
                    <th className="text-left px-4 py-3 font-bold text-[#0c2340]">TajWater</th>
                    <th className="text-left px-4 py-3 font-bold text-[#0c2340]">What to watch for</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Spring water price', '$8.99/jug', 'Some providers require a quote — pricing not published online'],
                    ['Delivery fee', 'Always free', 'Many providers add $5–$15 per delivery on top of jug price'],
                    ['Contracts', 'Never required', 'Some services lock you in for 12–24 months'],
                    ['Cancellation', 'Anytime, no fee', 'Early termination fees are common with national providers'],
                    ['Same-day delivery', 'Yes (before 12pm)', 'Less common with larger or national providers'],
                    ['Zone surcharges', 'None — flat pricing', 'Outer Metro Vancouver areas often cost more with some services'],
                  ].map(([factor, taj, watch], i, arr) => (
                    <tr key={factor} className={i < arr.length - 1 ? 'border-b border-[#cce7f0]' : ''}>
                      <td className="px-4 py-3 font-medium text-[#0c2340]">{factor}</td>
                      <td className="px-4 py-3 font-semibold text-[#0097a7]">{taj}</td>
                      <td className="px-4 py-3 text-[#4a7fa5]">{watch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">Is Water Delivery Worth It?</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              A typical Metro Vancouver household of 2–4 people uses approximately 2 five-gallon jugs per month for
              drinking and cooking. At TajWater&apos;s standard rate, that is $17.98 per month — or about 60 cents a day.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Compare that to:
            </p>
            <ul className="space-y-2 mb-6 text-[#4a7fa5]">
              <li>Cases of 500mL grocery store water: approximately $20–$30/month for equivalent volume, with significant plastic waste</li>
              <li>Home filtration systems: $200–$800 upfront plus annual filter replacement ($50–$150/year)</li>
              <li>Countertop water cooler rental: $15–$25/month plus water costs</li>
            </ul>
            <p className="text-[#4a7fa5] leading-relaxed mb-8">
              For most households, delivered 5-gallon jugs are the most cost-effective option that eliminates
              plastic waste, requires no equipment investment, and delivers consistent water quality.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6 mb-10">
              {faqSchema.mainEntity.map((item) => (
                <div key={item.name}>
                  <h3 className="font-bold text-[#0c2340] mb-2">{item.name}</h3>
                  <p className="text-[#4a7fa5] text-sm leading-relaxed">{item.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#e0f7fa] rounded-2xl p-6 mt-10">
              <h3 className="font-extrabold text-[#0c2340] text-lg mb-2">Get Started with TajWater — Metro Vancouver&apos;s Most Transparent Pricing</h3>
              <p className="text-[#4a7fa5] text-sm mb-4">
                Spring water from $8.99/jug. Alkaline from $12.99. Distilled from $9.99. Free delivery on every order,
                no contracts, same-day available before 12pm.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0097a7] text-white font-bold text-sm hover:bg-[#00838f] transition-colors">
                  Order Now →
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#0097a7] text-[#0097a7] font-semibold text-sm hover:bg-[#0097a7] hover:text-white transition-colors">
                  Get a Commercial Quote →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
