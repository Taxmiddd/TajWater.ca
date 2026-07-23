import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Water Delivery in Coquitlam: Customer Reviews & Testimonials (2026)',
  description: 'See what Coquitlam and City of Coquitlam residents say about TajWater\'s alkaline, spring, and distilled water delivery. Real customer testimonials from Coquitlam, BC.',
  keywords: [
    'water delivery Coquitlam',
    'Coquitlam water delivery reviews',
    'City of Coquitlam water delivery',
    'TajWater Coquitlam',
    'alkaline water delivery Coquitlam',
    'spring water delivery Coquitlam',
    'distilled water Coquitlam',
    'water delivery Port Coquitlam',
    'best water delivery Coquitlam BC',
  ],
  alternates: { canonical: '/blog/water-delivery-coquitlam-reviews' },
  openGraph: {
    title: 'Water Delivery in Coquitlam: Customer Reviews & Testimonials (2026)',
    description: 'Real testimonials from City of Coquitlam residents who switched to TajWater\'s premium water delivery service.',
    url: '/blog/water-delivery-coquitlam-reviews',
    type: 'article',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'TajWater Delivery in Coquitlam BC' }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Water Delivery in Coquitlam: Customer Reviews & Testimonials (2026)',
  description: 'Real reviews from Coquitlam and City of Coquitlam residents using TajWater\'s water delivery service.',
  datePublished: '2026-07-23',
  dateModified: '2026-07-23',
  author: { '@type': 'Organization', name: 'TajWater', url: 'https://tajwater.ca' },
  publisher: { '@type': 'Organization', name: 'TajWater', url: 'https://tajwater.ca', logo: { '@type': 'ImageObject', url: 'https://tajwater.ca/logo/tajcyan.svg' } },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://tajwater.ca/blog/water-delivery-coquitlam-reviews' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Does TajWater deliver to Coquitlam?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. TajWater delivers to Coquitlam, City of Coquitlam, Port Coquitlam, and surrounding areas in the Tri-Cities. Delivery is typically within 1–2 business days.' } },
    { '@type': 'Question', name: 'What types of water does TajWater deliver in the City of Coquitlam?', acceptedAnswer: { '@type': 'Answer', text: 'TajWater delivers alkaline water, spring water, and distilled water in 5-gallon jugs to homes and businesses in the City of Coquitlam and across the Tri-Cities.' } },
    { '@type': 'Question', name: 'How much does water delivery cost in Coquitlam?', acceptedAnswer: { '@type': 'Answer', text: 'Water delivery pricing in Coquitlam starts at competitive per-jug rates with flexible delivery schedules. Visit tajwater.ca/shop for current pricing and available packages.' } },
  ],
}

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'City of Coquitlam, BC',
    rating: 5,
    text: 'We switched to TajWater alkaline water delivery in the City of Coquitlam about 6 months ago and the difference is remarkable. Our whole family noticed the taste immediately — much cleaner and smoother than what we were getting from our tap or from the store. The delivery is always on time, the driver is polite, and the prices are very fair. Highly recommend to anyone in Coquitlam!',
  },
  {
    name: 'David & Lisa T.',
    location: 'Coquitlam, BC',
    rating: 5,
    text: 'As a family with two young kids, we were spending a fortune on bottled water every week at Costco. A neighbour in Coquitlam told us about TajWater and we haven\'t looked back. The 5-gallon jugs last us about a week, the delivery arrives when they say it will, and the customer service team is very responsive. It\'s saved us money and we worry a lot less about what\'s in our water.',
  },
  {
    name: 'Priya R.',
    location: 'Coquitlam, BC',
    rating: 5,
    text: 'I run a small home office in Coquitlam and TajWater has been amazing for both my personal drinking water and for the office water cooler. Having fresh alkaline water delivered directly means one less errand. The online ordering system is simple and I love that I can top up my wallet balance and pre-order in advance. Definitely the best water delivery service in Coquitlam.',
  },
  {
    name: 'The Nguyen Family',
    location: 'City of Coquitlam, BC',
    rating: 5,
    text: 'We\'ve been TajWater customers in City of Coquitlam for over a year. The distilled water is perfect for our humidifier and baby formula. Their bottle return system is convenient and the drivers are always friendly. We\'ve recommended TajWater to at least four other families in our Coquitlam neighbourhood — all of them are now customers too!',
  },
  {
    name: 'Gurpreet S.',
    location: 'Coquitlam, BC',
    rating: 5,
    text: 'Outstanding service! I was skeptical about water delivery at first but TajWater made the whole process very easy. Setting up delivery in Coquitlam took less than 5 minutes online. The spring water tastes incredibly fresh and the delivery schedule is very reliable. Will definitely keep using TajWater for years to come.',
  },
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

          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[#e0f7fa] text-[#0097a7] mb-4">Customer Reviews</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-4 leading-tight">
            Water Delivery in Coquitlam: What Our Customers Say (2026)
          </h1>
          <p className="text-[#4a7fa5] text-sm mb-8">Published July 23, 2026 · 6 min read · By TajWater</p>

          <div className="text-[#0c2340]">
            <p className="text-lg text-[#4a7fa5] leading-relaxed mb-8">
              <strong className="text-[#0c2340]">Coquitlam families and businesses love TajWater.</strong> Since launching water delivery across the Tri-Cities — including Coquitlam, City of Coquitlam, and Port Coquitlam — we&apos;ve had the privilege of serving hundreds of happy households. Here&apos;s what real customers in <strong>Coquitlam</strong> have to say about their experience.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-6">Real Reviews from Coquitlam Customers</h2>

            <div className="space-y-6 mb-12">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-[#f0f9ff] border border-[#cce7f0] rounded-2xl p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <span key={j} className="text-amber-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-[#344054] leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#0097a7] flex items-center justify-center text-white font-bold text-sm">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-[#0c2340] text-sm">{t.name}</p>
                      <p className="text-xs text-[#4a7fa5]">{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">Why Coquitlam Residents Choose TajWater</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              The <strong>City of Coquitlam</strong> gets its municipal water from Metro Vancouver&apos;s Coquitlam Reservoir — one of the region&apos;s primary water sources. While the source water is clean, many Coquitlam residents still notice chloramine taste and odour at the tap, especially in older buildings and during seasonal treatment changes.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              That&apos;s why more and more households across <strong>Coquitlam</strong> are choosing premium water delivery. TajWater offers:
            </p>
            <ul className="list-disc pl-6 text-[#4a7fa5] space-y-2 mb-8">
              <li><strong className="text-[#0c2340]">Alkaline water</strong> — naturally balanced pH for clean, refreshing hydration</li>
              <li><strong className="text-[#0c2340]">Spring water</strong> — fresh, natural mineral water sourced from BC springs</li>
              <li><strong className="text-[#0c2340]">Distilled water</strong> — pure H₂O, ideal for CPAP machines, baby formula, and medical use</li>
              <li><strong className="text-[#0c2340]">Flexible delivery</strong> — schedule delivery to your Coquitlam address on your schedule</li>
              <li><strong className="text-[#0c2340]">Wallet top-up system</strong> — pre-load credits for seamless recurring orders</li>
            </ul>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">Serving All of Coquitlam and City of Coquitlam</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              TajWater proudly serves all neighbourhoods across <strong>Coquitlam</strong> and <strong>City of Coquitlam</strong>, including Burke Mountain, Westwood Plateau, Ranch Park, Maillardville, and more. Our drivers know the Tri-Cities well and deliver efficiently to both residential homes and commercial offices.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-8">
              Whether you live in a detached home in the <strong>City of Coquitlam</strong> or a condo near the Coquitlam Centre, we can deliver fresh water right to your door — usually within 1–2 business days.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">Start Water Delivery in Coquitlam Today</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-6">
              Joining hundreds of happy <strong>Coquitlam</strong> customers is easy. Simply create an account, choose your water type, and schedule your first delivery. We offer competitive pricing, no long-term contracts, and a 100% satisfaction guarantee.
            </p>

            <div className="bg-[#e0f7fa] border border-[#b3e5fc] rounded-2xl p-6 mb-8">
              <h3 className="font-extrabold text-[#0c2340] text-lg mb-2">Ready to get started?</h3>
              <p className="text-[#4a7fa5] mb-4">Order online and get fresh water delivered to your Coquitlam home or office.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/shop" className="inline-flex items-center px-5 py-2.5 bg-[#0097a7] text-white font-semibold rounded-xl hover:bg-[#00838f] transition-colors">
                  Shop Now
                </Link>
                <Link href="/areas" className="inline-flex items-center px-5 py-2.5 border border-[#0097a7] text-[#0097a7] font-semibold rounded-xl hover:bg-[#f0f9ff] transition-colors">
                  View Delivery Areas
                </Link>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">Frequently Asked Questions — Water Delivery in Coquitlam</h2>

            <div className="space-y-4 mb-8">
              <div className="border border-[#cce7f0] rounded-xl p-4">
                <p className="font-bold text-[#0c2340] mb-2">Does TajWater deliver to Coquitlam?</p>
                <p className="text-[#4a7fa5] text-sm">Yes. TajWater delivers to Coquitlam, City of Coquitlam, Port Coquitlam, and surrounding Tri-Cities areas. Delivery is typically within 1–2 business days.</p>
              </div>
              <div className="border border-[#cce7f0] rounded-xl p-4">
                <p className="font-bold text-[#0c2340] mb-2">What types of water do you deliver in the City of Coquitlam?</p>
                <p className="text-[#4a7fa5] text-sm">We deliver alkaline water, spring water, and distilled water in 5-gallon jugs to homes and businesses throughout Coquitlam.</p>
              </div>
              <div className="border border-[#cce7f0] rounded-xl p-4">
                <p className="font-bold text-[#0c2340] mb-2">How much does water delivery cost in Coquitlam?</p>
                <p className="text-[#4a7fa5] text-sm">Pricing is competitive and transparent — no hidden fees or contracts. Visit our <Link href="/shop" className="text-[#0097a7] underline">shop page</Link> for current pricing.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
