import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Spring vs Alkaline vs Distilled Water: Which Should You Drink in Vancouver?',
  description: 'A plain-English breakdown of the three water types delivered across Metro Vancouver — what they are, how they differ, pH levels, minerals, and which is right for your household or office.',
  keywords: [
    'spring water vs alkaline water Vancouver',
    'distilled water vs spring water BC',
    'alkaline water benefits Vancouver',
    'which water type should I drink Vancouver',
    'water delivery options Metro Vancouver',
  ],
  alternates: { canonical: '/blog/spring-vs-alkaline-vs-distilled-water-vancouver' },
  openGraph: {
    title: 'Spring vs Alkaline vs Distilled Water — Which Is Right for You?',
    description: 'Plain-English breakdown of the three water types TajWater delivers across Metro Vancouver.',
    url: '/blog/spring-vs-alkaline-vs-distilled-water-vancouver',
    type: 'article',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Spring vs Alkaline vs Distilled Water Vancouver' }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Spring vs Alkaline vs Distilled Water: Which Should You Drink in Vancouver?',
  description: 'A plain-English breakdown of the three water types delivered across Metro Vancouver.',
  datePublished: '2026-04-15',
  dateModified: '2026-05-17',
  author: {
    '@type': 'Person',
    name: 'Taj Water Team',
    url: 'https://tajwater.ca/about',
    worksFor: { '@type': 'Organization', name: 'Taj Water', url: 'https://tajwater.ca' },
  },
  publisher: { '@type': 'Organization', name: 'TajWater', url: 'https://tajwater.ca', logo: { '@type': 'ImageObject', url: 'https://tajwater.ca/logo/tajcyan.svg' } },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://tajwater.ca/blog/spring-vs-alkaline-vs-distilled-water-vancouver' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is the difference between spring water and alkaline water?', acceptedAnswer: { '@type': 'Answer', text: 'Spring water comes from a natural underground source and contains naturally occurring minerals like calcium, magnesium, and potassium, with a neutral pH of 7.2–7.8. Alkaline water is purified water that has been enhanced with added minerals to raise its pH to 8.0–9.5. Both are safe to drink; the difference is mineral content and pH level.' } },
    { '@type': 'Question', name: 'Is distilled water safe to drink every day?', acceptedAnswer: { '@type': 'Answer', text: 'Distilled water is safe to drink but is not ideal as your only water source because the purification process removes all minerals, including beneficial ones like calcium and magnesium. It is best used for CPAP machines, steam irons, aquariums, and laboratory purposes. For daily drinking, spring or alkaline water is a better choice.' } },
    { '@type': 'Question', name: 'Which water type is best for CPAP machines in Vancouver?', acceptedAnswer: { '@type': 'Answer', text: 'Distilled water is the recommended water type for CPAP machines. It prevents mineral buildup in the humidifier chamber. TajWater delivers 5-gallon distilled water jugs across Metro Vancouver starting at $9.99 per jug with free delivery.' } },
    { '@type': 'Question', name: 'Does alkaline water have real health benefits?', acceptedAnswer: { '@type': 'Answer', text: 'Some studies suggest alkaline water may help with acid reflux and hydration, but the scientific evidence is not conclusive. Many people simply prefer its smoother taste. It is a safe choice with no known downsides for healthy adults.' } },
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

          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[#e0f7fa] text-[#0097a7] mb-4">Water Guide</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-4 leading-tight">
            Spring vs Alkaline vs Distilled Water: Which Should You Drink in Vancouver?
          </h1>
          <p className="text-[#4a7fa5] text-sm mb-8">Published April 15, 2026 · 6 min read · By TajWater</p>

          <div className="prose prose-slate max-w-none text-[#0c2340]">

            <p className="text-lg text-[#4a7fa5] leading-relaxed mb-8">
              TajWater delivers three types of 5-gallon water jugs across Metro Vancouver: spring, alkaline, and distilled.
              Most customers pick spring water by default — but understanding the differences helps you make the right choice
              for your household, office, or specific health needs.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">The Short Answer</h2>
            <ul className="space-y-2 mb-8 text-[#4a7fa5]">
              <li><strong className="text-[#0c2340]">Spring water</strong> — best for everyday drinking and cooking. Natural minerals, neutral pH, great taste.</li>
              <li><strong className="text-[#0c2340]">Alkaline water</strong> — best for health-conscious households and active people. Higher pH, enhanced minerals.</li>
              <li><strong className="text-[#0c2340]">Distilled water</strong> — best for CPAP machines, steam irons, aquariums, and lab use. Mineral-free.</li>
            </ul>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">Spring Water</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Spring water is sourced from natural underground aquifers and contains minerals that occur naturally in the water
              as it filters through rock and soil. The mineral profile — typically calcium, magnesium, and potassium — gives
              spring water its characteristic clean taste that most people associate with high-quality bottled water.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Spring water delivered by TajWater across Metro Vancouver has a neutral pH of approximately 7.2–7.8. It is tested
              for over 200 contaminants and contains no added chlorine, chloramines, or fluoride — the compounds that give
              Vancouver and Burnaby tap water its occasional taste and odour.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-6">
              <strong className="text-[#0c2340]">Price:</strong> $8.99 per 5-gallon jug, free delivery across Metro Vancouver.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">Alkaline Water</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Alkaline water is purified water that has been enhanced with minerals — typically calcium, magnesium, and
              potassium — to raise its pH level to 8.0–9.5. The higher pH is what defines it as &ldquo;alkaline.&rdquo; Unlike spring
              water, the mineral content in alkaline water is added during a controlled purification process rather than
              occurring naturally.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Some studies suggest alkaline water may help with acid reflux and improve hydration after exercise, though the
              scientific evidence is not conclusive. What most alkaline water drinkers consistently report is a noticeably
              smoother taste compared to neutral water. Many find it more pleasant to drink in large quantities.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-6">
              <strong className="text-[#0c2340]">Best for:</strong> Health-conscious households, people with acid reflux, athletes, anyone who wants to increase their daily water intake.
              <br />
              <strong className="text-[#0c2340]">Price:</strong> $10.99 per 5-gallon jug, free delivery across Metro Vancouver.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">Distilled Water</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Distilled water is produced by boiling water until it becomes steam, then condensing that steam back into liquid.
              This process removes virtually all dissolved solids — minerals, salts, heavy metals, and organic compounds — leaving
              water that is 99.9% pure H₂O with a pH of approximately 5.5–7.0.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Because distilled water contains no minerals, it is not recommended as your primary drinking water source for long
              periods. However, it is the correct choice for specific applications where mineral-free water is required:
            </p>
            <ul className="space-y-1 mb-4 text-[#4a7fa5]">
              <li>CPAP and BiPAP humidifier chambers (prevents mineral scale buildup)</li>
              <li>Steam irons and garment steamers</li>
              <li>Aquariums and reptile enclosures requiring controlled mineral levels</li>
              <li>Laboratory and scientific equipment</li>
              <li>Car batteries and cooling systems</li>
              <li>Dental equipment and medical devices</li>
            </ul>
            <p className="text-[#4a7fa5] leading-relaxed mb-6">
              <strong className="text-[#0c2340]">Price:</strong> $9.99 per 5-gallon jug, free delivery across Metro Vancouver.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">Side-by-Side Comparison</h2>
            <div className="overflow-x-auto rounded-xl border border-[#cce7f0] mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#e0f7fa]">
                    <th className="text-left px-4 py-3 font-bold text-[#0c2340]">Property</th>
                    <th className="text-left px-4 py-3 font-bold text-[#0c2340]">Spring</th>
                    <th className="text-left px-4 py-3 font-bold text-[#0c2340]">Alkaline</th>
                    <th className="text-left px-4 py-3 font-bold text-[#0c2340]">Distilled</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['pH level', '7.2–7.8', '8.0–9.5', '5.5–7.0'],
                    ['Minerals', 'Natural', 'Added', 'None'],
                    ['Taste', 'Clean, neutral', 'Smooth, slightly sweet', 'Flat, neutral'],
                    ['Best for drinking', '✓ Yes', '✓ Yes', '△ Not ideal long-term'],
                    ['CPAP machines', '✗ No', '✗ No', '✓ Yes — required'],
                    ['Price per 5-gal jug', '$8.99', '$10.99', '$9.99'],
                    ['Delivery', 'Free', 'Free', 'Free'],
                  ].map(([prop, spring, alk, dist], i) => (
                    <tr key={prop} className={i < 6 ? 'border-b border-[#cce7f0]' : ''}>
                      <td className="px-4 py-3 font-medium text-[#0c2340]">{prop}</td>
                      <td className="px-4 py-3 text-[#4a7fa5]">{spring}</td>
                      <td className="px-4 py-3 text-[#4a7fa5]">{alk}</td>
                      <td className="px-4 py-3 text-[#4a7fa5]">{dist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">Which Should You Choose?</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              For most Metro Vancouver households, <strong className="text-[#0c2340]">spring water is the right choice</strong>. It tastes
              great, contains beneficial minerals, and is the most affordable option at $8.99 per jug.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Choose <strong className="text-[#0c2340]">alkaline water</strong> if you or someone in your household has acid reflux,
              you prefer a smoother-tasting water, or you want the potential hydration benefits that some athletes report.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Choose <strong className="text-[#0c2340]">distilled water</strong> if you use a CPAP machine, need water for
              specific equipment, or require mineral-free water for medical or laboratory purposes. Many households
              order both — spring water for drinking and distilled for their CPAP.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-8">
              Not sure? <Link href="/contact" className="text-[#0097a7] font-semibold hover:underline">Contact TajWater</Link> and
              we will help you pick the right water for your situation. All three types are available for
              delivery across all 21 zones in Metro Vancouver, including Vancouver, Burnaby, Surrey, Coquitlam,
              Richmond, Langley, and Port Coquitlam.
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
              <h3 className="font-extrabold text-[#0c2340] text-lg mb-2">Order Water Delivery Across Metro Vancouver</h3>
              <p className="text-[#4a7fa5] text-sm mb-4">
                TajWater delivers spring, alkaline, and distilled water to 21 cities across Metro Vancouver.
                Free delivery on every order. Same-day available before 12pm.
              </p>
              <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0097a7] text-white font-bold text-sm hover:bg-[#00838f] transition-colors">
                Shop Water Delivery →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
