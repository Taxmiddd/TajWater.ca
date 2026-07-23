import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Water Delivery in Port Coquitlam, BC — Premium Home & Office Delivery (2026)',
  description: 'TajWater delivers fresh alkaline, spring, and distilled water to Port Coquitlam (PoCo) homes and businesses. Fast, reliable water delivery across Port Coquitlam, BC.',
  keywords: [
    'water delivery Port Coquitlam',
    'Port Coquitlam water delivery',
    'PoCo water delivery',
    'alkaline water Port Coquitlam',
    'spring water Port Coquitlam',
    'distilled water Port Coquitlam',
    'water delivery Tri-Cities BC',
    'TajWater Port Coquitlam',
    '5 gallon water delivery Port Coquitlam',
  ],
  alternates: { canonical: '/blog/water-delivery-port-coquitlam' },
  openGraph: {
    title: 'Water Delivery in Port Coquitlam, BC — Premium Home & Office Delivery (2026)',
    description: 'Premium 5-gallon water delivery across Port Coquitlam. Alkaline, spring, and distilled water delivered to your door.',
    url: '/blog/water-delivery-port-coquitlam',
    type: 'article',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Water Delivery Port Coquitlam BC' }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Water Delivery in Port Coquitlam, BC — Premium Home & Office Delivery (2026)',
  description: 'Everything Port Coquitlam residents need to know about TajWater\'s water delivery service — water types, pricing, delivery areas, and why locals choose TajWater.',
  datePublished: '2026-07-23',
  dateModified: '2026-07-23',
  author: { '@type': 'Organization', name: 'TajWater', url: 'https://tajwater.ca' },
  publisher: { '@type': 'Organization', name: 'TajWater', url: 'https://tajwater.ca', logo: { '@type': 'ImageObject', url: 'https://tajwater.ca/logo/tajcyan.svg' } },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://tajwater.ca/blog/water-delivery-port-coquitlam' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Does TajWater deliver water to Port Coquitlam?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. TajWater delivers alkaline water, spring water, and distilled water in 5-gallon jugs to homes and businesses across Port Coquitlam (PoCo), BC. Delivery usually arrives within 1–2 business days.' } },
    { '@type': 'Question', name: 'Where is TajWater located in Port Coquitlam?', acceptedAnswer: { '@type': 'Answer', text: 'TajWater\'s main facility is located at Unit-7, 1770 McLean Ave, Port Coquitlam, BC V3C 4K8. Customers can also arrange store pickup at this address Monday to Friday.' } },
    { '@type': 'Question', name: 'What water types does TajWater deliver to Port Coquitlam?', acceptedAnswer: { '@type': 'Answer', text: 'TajWater delivers three water types to Port Coquitlam: alkaline water (naturally high pH), spring water (fresh mineral water), and distilled water (pure H₂O for medical and appliance use).' } },
    { '@type': 'Question', name: 'Can I pick up water in Port Coquitlam instead of having it delivered?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! TajWater offers free store pickup at our Port Coquitlam location at 1770 McLean Ave. You can place a pickup order online and we\'ll have your water ready for you.' } },
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

          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[#e0f7fa] text-[#0097a7] mb-4">Local Guide</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-4 leading-tight">
            Premium Water Delivery in Port Coquitlam, BC (2026 Guide)
          </h1>
          <p className="text-[#4a7fa5] text-sm mb-8">Published July 23, 2026 · 6 min read · By TajWater</p>

          <div className="text-[#0c2340]">
            <p className="text-lg text-[#4a7fa5] leading-relaxed mb-8">
              <strong className="text-[#0c2340]">TajWater is based right here in Port Coquitlam</strong> — which means water delivery to <strong>Port Coquitlam</strong> (PoCo) is as fast and reliable as it gets. Our facility at 1770 McLean Ave in Port Coquitlam serves as the heart of our operation, allowing us to deliver fresh, premium water across all of Port Coquitlam and the surrounding Tri-Cities in as little as one business day.
            </p>

            <div className="bg-[#e0f7fa] border-l-4 border-[#0097a7] rounded-r-xl p-5 mb-8">
              <p className="font-bold text-[#0c2340] mb-1">📍 TajWater Port Coquitlam</p>
              <p className="text-[#4a7fa5] text-sm">Unit-7, 1770 McLean Ave, Port Coquitlam, BC V3C 4K8</p>
              <p className="text-[#4a7fa5] text-sm">Mon–Fri · Store Pickup Available</p>
            </div>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">Why Port Coquitlam Residents Choose Premium Water Delivery</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              <strong>Port Coquitlam</strong> receives its municipal water supply from Metro Vancouver, sourced from the Coquitlam Reservoir in the Coast Mountains. While the source water is technically clean, many <strong>Port Coquitlam</strong> residents still experience:
            </p>
            <ul className="list-disc pl-6 text-[#4a7fa5] space-y-2 mb-8">
              <li>Chloramine taste and odour (particularly noticeable in hot water)</li>
              <li>Hard water mineral deposits on taps, kettles, and appliances</li>
              <li>Concerns about aging building infrastructure and pipe quality</li>
              <li>Preference for alkaline water for health and hydration benefits</li>
              <li>Medical or appliance needs requiring pure distilled water</li>
            </ul>
            <p className="text-[#4a7fa5] leading-relaxed mb-8">
              For these reasons, <strong>Port Coquitlam</strong> has become one of our fastest-growing delivery areas. Hundreds of PoCo families, home offices, and small businesses have made the switch to TajWater.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">Water Types Available in Port Coquitlam</h2>

            <div className="space-y-4 mb-8">
              <div className="border border-[#cce7f0] rounded-2xl p-5">
                <h3 className="font-extrabold text-[#0c2340] mb-2">💧 Alkaline Water</h3>
                <p className="text-[#4a7fa5] text-sm leading-relaxed">Our most popular option in <strong>Port Coquitlam</strong>. Alkaline water has a naturally elevated pH (8.0+) that many customers find noticeably smoother and more refreshing than tap water. Great for everyday drinking and staying hydrated throughout the day.</p>
              </div>
              <div className="border border-[#cce7f0] rounded-2xl p-5">
                <h3 className="font-extrabold text-[#0c2340] mb-2">🏔️ Spring Water</h3>
                <p className="text-[#4a7fa5] text-sm leading-relaxed">Natural BC spring water with naturally occurring minerals. If you prefer a lighter, crisp taste with balanced mineral content, spring water is the ideal choice for Port Coquitlam households.</p>
              </div>
              <div className="border border-[#cce7f0] rounded-2xl p-5">
                <h3 className="font-extrabold text-[#0c2340] mb-2">🔬 Distilled Water</h3>
                <p className="text-[#4a7fa5] text-sm leading-relaxed">Pure H₂O with all minerals and impurities removed. Ideal for CPAP machines, steam irons, baby formula, and any application requiring absolute purity. Many <strong>Port Coquitlam</strong> medical professionals and caregivers rely on our distilled water delivery.</p>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">What Port Coquitlam Customers Say</h2>

            <div className="space-y-5 mb-8">
              <div className="bg-[#f0f9ff] border border-[#cce7f0] rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => <span key={j} className="text-amber-400 text-lg">★</span>)}
                </div>
                <p className="text-[#344054] leading-relaxed mb-4 italic">&ldquo;Being a <strong>Port Coquitlam</strong> resident and knowing that TajWater is based right here in PoCo made the choice easy. The alkaline water is fantastic, delivery is always on time, and the drivers know our area perfectly. I&apos;ve recommended TajWater to everyone on my street.&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0097a7] flex items-center justify-center text-white font-bold text-sm">K</div>
                  <div>
                    <p className="font-bold text-[#0c2340] text-sm">Kevin L.</p>
                    <p className="text-xs text-[#4a7fa5]">Port Coquitlam, BC</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#f0f9ff] border border-[#cce7f0] rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => <span key={j} className="text-amber-400 text-lg">★</span>)}
                </div>
                <p className="text-[#344054] leading-relaxed mb-4 italic">&ldquo;We run a small daycare in <strong>Port Coquitlam</strong> and switched to distilled water from TajWater for the children. Parents love that we&apos;re using pure, premium water. TajWater has been incredibly professional — reliable, affordable, and local. Exactly what PoCo businesses need.&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0097a7] flex items-center justify-center text-white font-bold text-sm">M</div>
                  <div>
                    <p className="font-bold text-[#0c2340] text-sm">Maria S.</p>
                    <p className="text-xs text-[#4a7fa5]">Port Coquitlam, BC</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#f0f9ff] border border-[#cce7f0] rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => <span key={j} className="text-amber-400 text-lg">★</span>)}
                </div>
                <p className="text-[#344054] leading-relaxed mb-4 italic">&ldquo;I&apos;ve lived in <strong>Port Coquitlam</strong> for 12 years and tried a few water delivery companies over the years. TajWater stands out because they&apos;re actually local — they understand the community, their prices are honest, and the water quality is noticeably better. The wallet top-up feature makes recurring orders very convenient.&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0097a7] flex items-center justify-center text-white font-bold text-sm">A</div>
                  <div>
                    <p className="font-bold text-[#0c2340] text-sm">Amir H.</p>
                    <p className="text-xs text-[#4a7fa5]">Port Coquitlam, BC</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">How to Get Water Delivered in Port Coquitlam</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">Ordering water delivery in Port Coquitlam is simple:</p>
            <ol className="list-decimal pl-6 text-[#4a7fa5] space-y-2 mb-8">
              <li>Create a free account at <Link href="/auth/register" className="text-[#0097a7] underline">tajwater.ca</Link></li>
              <li>Choose your water type — alkaline, spring, or distilled</li>
              <li>Select your Port Coquitlam delivery zone and address</li>
              <li>Complete checkout — we accept card, Google Pay, Apple Pay, and wallet credits</li>
              <li>Your water is delivered to your Port Coquitlam door within 1–2 business days</li>
            </ol>

            <div className="bg-[#e0f7fa] border border-[#b3e5fc] rounded-2xl p-6 mb-8">
              <h3 className="font-extrabold text-[#0c2340] text-lg mb-2">Start your Port Coquitlam water delivery today</h3>
              <p className="text-[#4a7fa5] mb-4">Join hundreds of satisfied Port Coquitlam customers. No contracts, no hassle.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/shop" className="inline-flex items-center px-5 py-2.5 bg-[#0097a7] text-white font-semibold rounded-xl hover:bg-[#00838f] transition-colors">
                  Shop Now
                </Link>
                <Link href="/areas" className="inline-flex items-center px-5 py-2.5 border border-[#0097a7] text-[#0097a7] font-semibold rounded-xl hover:bg-[#f0f9ff] transition-colors">
                  View Delivery Areas
                </Link>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">Frequently Asked Questions — Port Coquitlam Water Delivery</h2>
            <div className="space-y-4 mb-8">
              <div className="border border-[#cce7f0] rounded-xl p-4">
                <p className="font-bold text-[#0c2340] mb-2">Does TajWater deliver to Port Coquitlam?</p>
                <p className="text-[#4a7fa5] text-sm">Yes — Port Coquitlam is one of our primary delivery areas. TajWater is headquartered in Port Coquitlam, so local delivery is fast and reliable.</p>
              </div>
              <div className="border border-[#cce7f0] rounded-xl p-4">
                <p className="font-bold text-[#0c2340] mb-2">Can I pick up water at your Port Coquitlam location?</p>
                <p className="text-[#4a7fa5] text-sm">Yes! Free store pickup is available at Unit-7, 1770 McLean Ave, Port Coquitlam, BC V3C 4K8, Monday through Friday.</p>
              </div>
              <div className="border border-[#cce7f0] rounded-xl p-4">
                <p className="font-bold text-[#0c2340] mb-2">How much does water delivery cost in Port Coquitlam?</p>
                <p className="text-[#4a7fa5] text-sm">See our <Link href="/shop" className="text-[#0097a7] underline">shop page</Link> for current pricing. We offer competitive per-jug rates with no hidden fees or lock-in contracts.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
