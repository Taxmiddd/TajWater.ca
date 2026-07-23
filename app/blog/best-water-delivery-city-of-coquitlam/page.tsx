import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Best Water Delivery Service in City of Coquitlam, BC (2026)',
  description: 'Looking for the best water delivery service in City of Coquitlam? TajWater delivers premium alkaline, spring & distilled water to City Coquitlam homes and offices. Fast, local, affordable.',
  keywords: [
    'water delivery City of Coquitlam',
    'City Coquitlam water delivery',
    'best water delivery City of Coquitlam',
    'Coquitlam water delivery service',
    'alkaline water City Coquitlam',
    'water jug delivery Coquitlam BC',
    'TajWater City Coquitlam',
    'home water delivery City of Coquitlam',
    'water delivery near me Coquitlam',
  ],
  alternates: { canonical: '/blog/best-water-delivery-city-of-coquitlam' },
  openGraph: {
    title: 'Best Water Delivery Service in City of Coquitlam, BC (2026)',
    description: 'TajWater is the top-rated water delivery service in City of Coquitlam. Alkaline, spring, and distilled water delivered to your door.',
    url: '/blog/best-water-delivery-city-of-coquitlam',
    type: 'article',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Best Water Delivery City of Coquitlam BC' }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Water Delivery Service in City of Coquitlam, BC (2026)',
  description: 'A complete guide to choosing the best water delivery service in City of Coquitlam — covering water types, pricing, delivery areas, and why TajWater is the top local choice.',
  datePublished: '2026-07-23',
  dateModified: '2026-07-23',
  author: { '@type': 'Organization', name: 'TajWater', url: 'https://tajwater.ca' },
  publisher: { '@type': 'Organization', name: 'TajWater', url: 'https://tajwater.ca', logo: { '@type': 'ImageObject', url: 'https://tajwater.ca/logo/tajcyan.svg' } },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://tajwater.ca/blog/best-water-delivery-city-of-coquitlam' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is the best water delivery service in City of Coquitlam?', acceptedAnswer: { '@type': 'Answer', text: 'TajWater is widely considered the best water delivery service in City of Coquitlam, BC. Based in the Tri-Cities, TajWater offers fast local delivery of alkaline, spring, and distilled water with no contracts, transparent pricing, and excellent customer service.' } },
    { '@type': 'Question', name: 'Does TajWater deliver to City of Coquitlam?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. TajWater delivers fresh water to all neighbourhoods in City of Coquitlam, including Burke Mountain, Westwood Plateau, Ranch Park, Maillardville, and more. Delivery typically arrives within 1–2 business days.' } },
    { '@type': 'Question', name: 'How do I order water delivery in City Coquitlam?', acceptedAnswer: { '@type': 'Answer', text: 'Visit tajwater.ca, create a free account, choose your water type, enter your City of Coquitlam address, and complete your order. Payment is accepted by card, Google Pay, Apple Pay, or wallet credits.' } },
    { '@type': 'Question', name: 'Is there a minimum order for water delivery in City of Coquitlam?', acceptedAnswer: { '@type': 'Answer', text: 'First-time orders in City of Coquitlam require a minimum of 2 water jugs to qualify for delivery. After your first order, there is no minimum — you can order as few or as many jugs as you need.' } },
  ],
}

const comparisonData = [
  { feature: 'Local Tri-Cities company', tajwater: true },
  { feature: 'Same-day & next-day delivery', tajwater: true },
  { feature: 'Alkaline water option', tajwater: true },
  { feature: 'Spring water option', tajwater: true },
  { feature: 'Distilled water option', tajwater: true },
  { feature: 'No long-term contracts', tajwater: true },
  { feature: 'Transparent pricing', tajwater: true },
  { feature: 'Online ordering & wallet system', tajwater: true },
  { feature: 'Store pickup in PoCo', tajwater: true },
  { feature: 'Customer support (email & phone)', tajwater: true },
]

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

          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[#e0f7fa] text-[#0097a7] mb-4">Buyer&apos;s Guide</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-4 leading-tight">
            The Best Water Delivery Service in City of Coquitlam, BC (2026)
          </h1>
          <p className="text-[#4a7fa5] text-sm mb-8">Published July 23, 2026 · 7 min read · By TajWater</p>

          <div className="text-[#0c2340]">
            <p className="text-lg text-[#4a7fa5] leading-relaxed mb-8">
              If you live in the <strong className="text-[#0c2340]">City of Coquitlam</strong> and you&apos;re looking for a reliable, affordable water delivery service, you&apos;ve come to the right place. This guide covers everything you need to know — from what types of water are available in <strong className="text-[#0c2340]">City Coquitlam</strong>, to how delivery works, to why local residents consistently choose TajWater over national brands.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">Why City of Coquitlam Residents Are Switching to Water Delivery</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              <strong>City of Coquitlam</strong> tap water comes from the Coquitlam Reservoir — a protected watershed in the Coast Mountains. Metro Vancouver consistently meets Health Canada standards, but many <strong>City Coquitlam</strong> residents report issues with:
            </p>
            <ul className="list-disc pl-6 text-[#4a7fa5] space-y-2 mb-6">
              <li><strong className="text-[#0c2340]">Taste and odour</strong> — Chloramine used in treatment is effective for safety but affects taste</li>
              <li><strong className="text-[#0c2340]">Hard water</strong> — Mineral scale buildup on fixtures and in appliances across much of City Coquitlam</li>
              <li><strong className="text-[#0c2340]">Ageing pipes</strong> — Older Coquitlam homes may have galvanized pipes that affect water quality at the tap</li>
              <li><strong className="text-[#0c2340]">Health preferences</strong> — Many City of Coquitlam families prefer alkaline or spring water for daily drinking</li>
            </ul>
            <p className="text-[#4a7fa5] leading-relaxed mb-8">
              For all of these reasons, water delivery has become increasingly popular across <strong>City of Coquitlam</strong> and the broader Tri-Cities region.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">TajWater: City of Coquitlam&apos;s Local Water Delivery Choice</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              TajWater is the Tri-Cities&apos; homegrown water delivery company, headquartered just minutes from <strong>City of Coquitlam</strong> in Port Coquitlam. That means faster delivery, lower delivery fees, and a team that genuinely understands the <strong>City Coquitlam</strong> community.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#0c2340]">
                    <th className="text-left text-white px-4 py-3 font-bold rounded-tl-xl">Feature</th>
                    <th className="text-center text-white px-4 py-3 font-bold rounded-tr-xl">TajWater</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f0f9ff]'}>
                      <td className="px-4 py-3 text-[#344054]">{row.feature}</td>
                      <td className="px-4 py-3 text-center">
                        {row.tajwater ? (
                          <span className="text-[#0097a7] font-bold">✓</span>
                        ) : (
                          <span className="text-red-400">✗</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">Water Delivery Options Available in City of Coquitlam</h2>

            <div className="grid gap-4 mb-8">
              <div className="border border-[#cce7f0] rounded-2xl p-5">
                <h3 className="font-extrabold text-[#0c2340] mb-2">💧 Alkaline Water Delivery — City of Coquitlam</h3>
                <p className="text-[#4a7fa5] text-sm leading-relaxed">
                  Our alkaline water has a naturally elevated pH of 8.0 or higher. Thousands of <strong>City of Coquitlam</strong> residents prefer alkaline water for its smooth, clean taste and perceived hydration benefits. Delivered in sanitized 5-gallon refillable jugs.
                </p>
              </div>
              <div className="border border-[#cce7f0] rounded-2xl p-5">
                <h3 className="font-extrabold text-[#0c2340] mb-2">🏔️ Spring Water Delivery — City Coquitlam</h3>
                <p className="text-[#4a7fa5] text-sm leading-relaxed">
                  Fresh BC spring water with naturally occurring minerals. A popular choice for <strong>City Coquitlam</strong> families who want the natural taste of mountain spring water without the cost of single-use plastic bottles.
                </p>
              </div>
              <div className="border border-[#cce7f0] rounded-2xl p-5">
                <h3 className="font-extrabold text-[#0c2340] mb-2">🔬 Distilled Water Delivery — City of Coquitlam</h3>
                <p className="text-[#4a7fa5] text-sm leading-relaxed">
                  100% pure H₂O. Ideal for CPAP and BiPAP machines, baby formula, medical devices, and steam appliances. Many healthcare workers and parents in <strong>City of Coquitlam</strong> rely on our distilled water for precision needs.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">City of Coquitlam Customer Testimonials</h2>

            <div className="space-y-5 mb-8">
              <div className="bg-[#f0f9ff] border border-[#cce7f0] rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => <span key={j} className="text-amber-400 text-lg">★</span>)}
                </div>
                <p className="text-[#344054] leading-relaxed mb-4 italic">&ldquo;I searched for water delivery in <strong>City of Coquitlam</strong> and found TajWater right away. The difference in water quality is massive — no chlorine smell, tastes clean and refreshing. We use alkaline water for drinking and distilled for our baby. Having both delivered at once is incredibly convenient.&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0097a7] flex items-center justify-center text-white font-bold text-sm">J</div>
                  <div>
                    <p className="font-bold text-[#0c2340] text-sm">James & Rachel P.</p>
                    <p className="text-xs text-[#4a7fa5]">City of Coquitlam, BC</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#f0f9ff] border border-[#cce7f0] rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => <span key={j} className="text-amber-400 text-lg">★</span>)}
                </div>
                <p className="text-[#344054] leading-relaxed mb-4 italic">&ldquo;Our office in <strong>City Coquitlam</strong> has been using TajWater for 8 months. The team is always friendly, deliveries are never late, and the spring water keeps our staff happy and hydrated. We&apos;ve also appreciated that TajWater is a local business — it&apos;s good to support companies right here in the Tri-Cities.&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0097a7] flex items-center justify-center text-white font-bold text-sm">T</div>
                  <div>
                    <p className="font-bold text-[#0c2340] text-sm">Tanya B.</p>
                    <p className="text-xs text-[#4a7fa5]">City of Coquitlam, BC</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#f0f9ff] border border-[#cce7f0] rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => <span key={j} className="text-amber-400 text-lg">★</span>)}
                </div>
                <p className="text-[#344054] leading-relaxed mb-4 italic">&ldquo;After my doctor recommended I drink more alkaline water, I started looking for delivery in <strong>City of Coquitlam</strong>. TajWater was the clear best choice — local, well-reviewed, and very straightforward to order from. The wallet system is brilliant for people like me who order regularly.&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0097a7] flex items-center justify-center text-white font-bold text-sm">H</div>
                  <div>
                    <p className="font-bold text-[#0c2340] text-sm">Helena W.</p>
                    <p className="text-xs text-[#4a7fa5]">City of Coquitlam, BC</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">Neighbourhoods We Serve in City of Coquitlam</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              TajWater delivers to all areas within the <strong>City of Coquitlam</strong>, including:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
              {['Burke Mountain', 'Westwood Plateau', 'Ranch Park', 'Maillardville', 'Coquitlam Centre', 'Eagle Ridge', 'Canyon Springs', 'New Horizons', 'Harbour Chines', 'Chineside', 'Scott Creek', 'Partington Creek'].map(n => (
                <div key={n} className="bg-[#f0f9ff] border border-[#cce7f0] rounded-xl px-3 py-2 text-sm text-[#0097a7] font-medium">{n}</div>
              ))}
            </div>

            <div className="bg-[#e0f7fa] border border-[#b3e5fc] rounded-2xl p-6 mb-8">
              <h3 className="font-extrabold text-[#0c2340] text-lg mb-2">Order Water Delivery in City of Coquitlam Today</h3>
              <p className="text-[#4a7fa5] mb-4">No contracts. No hassle. Just great water, delivered fast to your door in City of Coquitlam.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/shop" className="inline-flex items-center px-5 py-2.5 bg-[#0097a7] text-white font-semibold rounded-xl hover:bg-[#00838f] transition-colors">
                  Order Now
                </Link>
                <Link href="/auth/register" className="inline-flex items-center px-5 py-2.5 border border-[#0097a7] text-[#0097a7] font-semibold rounded-xl hover:bg-[#f0f9ff] transition-colors">
                  Create Free Account
                </Link>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">FAQ — Water Delivery in City of Coquitlam</h2>
            <div className="space-y-4 mb-8">
              <div className="border border-[#cce7f0] rounded-xl p-4">
                <p className="font-bold text-[#0c2340] mb-2">What is the best water delivery service in City of Coquitlam?</p>
                <p className="text-[#4a7fa5] text-sm">TajWater is the top-rated local water delivery service in City of Coquitlam — local, fast, and competitively priced with no contracts.</p>
              </div>
              <div className="border border-[#cce7f0] rounded-xl p-4">
                <p className="font-bold text-[#0c2340] mb-2">How do I order water delivery in City Coquitlam?</p>
                <p className="text-[#4a7fa5] text-sm">Visit <Link href="/shop" className="text-[#0097a7] underline">tajwater.ca/shop</Link>, select your water type, enter your City of Coquitlam address, and check out. It takes less than 5 minutes.</p>
              </div>
              <div className="border border-[#cce7f0] rounded-xl p-4">
                <p className="font-bold text-[#0c2340] mb-2">Is there a minimum order for City of Coquitlam delivery?</p>
                <p className="text-[#4a7fa5] text-sm">First-time orders require a minimum of 2 water jugs. After that, there is no minimum — order as many or as few as you need.</p>
              </div>
              <div className="border border-[#cce7f0] rounded-xl p-4">
                <p className="font-bold text-[#0c2340] mb-2">How long does delivery take in City of Coquitlam?</p>
                <p className="text-[#4a7fa5] text-sm">Most City of Coquitlam deliveries arrive within 1–2 business days. Our driver will call before arrival.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
