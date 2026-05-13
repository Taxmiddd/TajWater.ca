import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Best Water for Babies & Toddlers in Metro Vancouver (2026)',
  description: 'Which water is safest for infant formula, baby food, and toddler drinking in Metro Vancouver? A guide to distilled, spring, filtered, and tap water for BC families with young children.',
  keywords: [
    'best water for babies Vancouver',
    'safe water for baby formula Vancouver',
    'distilled water for infant formula Vancouver',
    'baby water delivery Vancouver',
    'water for toddlers Metro Vancouver',
    'infant formula water BC',
    'safe drinking water for babies Vancouver',
    'water delivery for newborn Vancouver',
  ],
  alternates: { canonical: 'https://tajwater.ca/blog/best-water-for-babies-toddlers-metro-vancouver' },
  openGraph: {
    title: 'Best Water for Babies & Toddlers in Metro Vancouver (2026)',
    description: 'Which water is safest for infant formula and toddler drinking in Metro Vancouver? Distilled, spring, filtered, and tap water compared for BC families.',
    url: 'https://tajwater.ca/blog/best-water-for-babies-toddlers-metro-vancouver',
    type: 'article',
    images: [{ url: 'https://tajwater.ca/opengraph-image', width: 1200, height: 630 }],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Best Water for Babies & Toddlers in Metro Vancouver (2026)',
      description: 'Which water is safest for infant formula, baby food, and toddler drinking in Metro Vancouver?',
      datePublished: '2026-05-20',
      dateModified: '2026-05-20',
      author: { '@type': 'Organization', name: 'TajWater', url: 'https://tajwater.ca' },
      publisher: {
        '@type': 'Organization',
        name: 'TajWater',
        url: 'https://tajwater.ca',
        logo: { '@type': 'ImageObject', url: 'https://tajwater.ca/opengraph-image' },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://tajwater.ca/blog/best-water-for-babies-toddlers-metro-vancouver' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What water is best for mixing infant formula in Vancouver?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Health Canada recommends using distilled, purified, or boiled tap water for mixing infant formula. Distilled water is the most reliable choice because it contains no fluoride, chlorine, lead, or other minerals that could interfere with formula\'s precise nutritional balance. TajWater delivers distilled water in 5-gallon jugs to all Metro Vancouver cities.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Vancouver tap water safe for babies?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Metro Vancouver tap water meets Health Canada standards and is generally considered safe for adults. However, for infants under 12 months, Health Canada recommends using distilled or purified water for formula mixing, or boiling tap water for at least 2 minutes and allowing it to cool. The main concern is fluoride (which can cause dental fluorosis in excess) and lead from older household pipes.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can babies drink alkaline water?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Alkaline water (pH 9.5+) is not recommended for infants under 12 months. Babies have a more sensitive digestive system and the elevated pH can interfere with natural stomach acid needed for digestion and nutrient absorption. After 12 months, alkaline water is generally safe for toddlers. For infants, stick to distilled or spring water.',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tajwater.ca' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://tajwater.ca/blog' },
        { '@type': 'ListItem', position: 3, name: 'Best Water for Babies', item: 'https://tajwater.ca/blog/best-water-for-babies-toddlers-metro-vancouver' },
      ],
    },
  ],
}

export default function BestWaterBabiesVancouver() {
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
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white">Family Guide</span>
              <span className="text-[#b3e5fc] text-sm">May 20, 2026</span>
              <span className="text-[#b3e5fc] text-sm">· 6 min read</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Best Water for Babies & Toddlers in Metro Vancouver (2026)
            </h1>
          </div>
        </section>

        <article className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="bg-[#fff3e0] border border-[#ffcc02] rounded-2xl p-5 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#ff9800] shrink-0 mt-0.5" />
                <p className="text-sm text-[#6d4c41]">
                  <strong>Important:</strong> This article is for general information only. Always consult your pediatrician
                  or family doctor for personalized guidance on your baby&apos;s water and formula needs.
                </p>
              </div>
            </div>

            <p className="text-[#4a7fa5] text-lg leading-relaxed mb-8">
              When a new baby arrives, every decision feels significant — including the water you use for formula and drinking.
              Metro Vancouver families often wonder whether tap water is safe, whether they need to buy special water, and which type of
              water is best for their newborn, infant, or toddler. This guide walks through each option clearly.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-12 mb-6">What Health Canada Recommends</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Health Canada&apos;s guidance for infant water is:
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'For infants under 12 months mixing formula: use distilled, purified, or boiled (then cooled) tap water',
                'Boiling tap water for at least 2 minutes destroys bacteria and removes some chlorine but does not remove fluoride, lead, or nitrates',
                'Avoid well water without testing — rural BC well water can contain bacteria, nitrates, and arsenic',
                'Avoid softened water — water softeners replace minerals with sodium, which is not appropriate for infant formula',
                'Alkaline water is not recommended for infants under 12 months',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[#4a7fa5]">
                  <CheckCircle className="w-4 h-4 text-[#0097a7] shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-12 mb-6">Water Type Comparison for Babies and Toddlers</h2>

            <div className="overflow-x-auto rounded-2xl border border-[#cce7f0] bg-white shadow-sm mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#e0f7fa]">
                    <th className="text-left px-5 py-4 font-bold text-[#0c2340]">Water Type</th>
                    <th className="text-left px-5 py-4 font-bold text-[#0c2340]">0–6 Months</th>
                    <th className="text-left px-5 py-4 font-bold text-[#0c2340]">6–12 Months</th>
                    <th className="text-left px-5 py-4 font-bold text-[#0c2340]">1–3 Years</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Distilled Water', '✓ Best for formula', '✓ Good for formula', '✓ Safe (add mineral variety in diet)'],
                    ['Spring Water', 'Boil first if used', '✓ Generally safe', '✓ Good everyday choice'],
                    ['Filtered Tap Water (RO)', '✓ Good for formula', '✓ Good', '✓ Good'],
                    ['Metro Vancouver Tap Water', 'Boil first — then safe', '✓ Safe (not boiled)', '✓ Safe'],
                    ['Alkaline Water (pH 9.5)', '✗ Not recommended', '✗ Not recommended', '✓ Safe after 12 months'],
                    ['Softened Water', '✗ Avoid — high sodium', '✗ Avoid', '✗ Avoid for formula'],
                    ['Well Water (untested)', '✗ Avoid', '✗ Avoid', '✗ Avoid until tested'],
                  ].map(([type, age0, age6, age1], i) => (
                    <tr key={type} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f8feff]'}>
                      <td className="px-5 py-3 font-semibold text-[#0c2340] border-b border-[#cce7f0]">{type}</td>
                      <td className={`px-5 py-3 border-b border-[#cce7f0] ${age0.startsWith('✓') ? 'text-[#0097a7] font-medium' : age0.startsWith('✗') ? 'text-red-500' : 'text-[#4a7fa5]'}`}>{age0}</td>
                      <td className={`px-5 py-3 border-b border-[#cce7f0] ${age6.startsWith('✓') ? 'text-[#0097a7] font-medium' : age6.startsWith('✗') ? 'text-red-500' : 'text-[#4a7fa5]'}`}>{age6}</td>
                      <td className={`px-5 py-3 border-b border-[#cce7f0] ${age1.startsWith('✓') ? 'text-[#0097a7] font-medium' : age1.startsWith('✗') ? 'text-red-500' : 'text-[#4a7fa5]'}`}>{age1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-12 mb-4">Why Distilled Water is the Safest Choice for Infant Formula</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Infant formula is precisely engineered to provide the correct balance of nutrients for a newborn. When you add
              water to formula, you are diluting it — and any minerals or chemicals in that water directly affect the nutritional
              equation. This is why water purity matters more for formula than for anything else.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Distilled water contains <strong className="text-[#0c2340]">no fluoride</strong> — excess fluoride intake in infants
              can cause dental fluorosis (white spots on developing teeth). Health Canada&apos;s position is that formula-fed infants
              who receive fluoridated water as their main liquid source may be at risk for dental fluorosis.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Distilled water also contains <strong className="text-[#0c2340]">no lead</strong>. Metro Vancouver&apos;s water treatment
              removes lead before it leaves the facility, but lead can leach from older household plumbing and fixtures between the
              main and your tap — particularly in homes built before 1990.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-8">
              Finally, distilled water has <strong className="text-[#0c2340]">no chlorine or chloramines</strong>, which
              Metro Vancouver water uses as disinfectants. While safe for adults, some parents prefer to avoid these
              chemicals for their newborns.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-12 mb-4">Is Metro Vancouver Tap Water Safe for Babies?</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Metro Vancouver tap water is considered safe by all regulatory standards and is safe for adults and older children.
              For infants specifically, the main concerns are:
            </p>
            <div className="space-y-4 mb-8">
              {[
                {
                  concern: 'Fluoride',
                  detail: 'Metro Vancouver does not add fluoride to its water (unlike many other Canadian municipalities). However, some municipalities within Metro Vancouver have higher natural fluoride levels. If you are in an area with fluoridated water, distilled water for formula is the safer choice.',
                },
                {
                  concern: 'Lead from older pipes',
                  detail: 'Homes built before 1990 may have lead solder in pipes or lead-brass fixtures. GVRD water is treated to minimize corrosivity, but lead exposure risk remains for older homes. Distilled or filtered water eliminates this risk.',
                },
                {
                  concern: 'Boiling advisory compliance',
                  detail: 'Metro Vancouver issues occasional boil advisories due to turbidity or infrastructure work. During a boil advisory, tap water — even boiled — may not be suitable for infant formula. Delivered bottled water is unaffected by municipal advisories.',
                },
              ].map((item) => (
                <div key={item.concern} className="bg-white rounded-xl border border-[#cce7f0] p-5">
                  <p className="font-bold text-[#0c2340] mb-2">{item.concern}</p>
                  <p className="text-[#4a7fa5] text-sm leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-12 mb-4">When Can Babies Start Drinking Spring Water?</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Most pediatricians and Health Canada guidance indicates that spring water is generally fine for infants
              over 6 months, particularly once they have started solids and their digestive system has matured.
              Spring water&apos;s natural mineral content — calcium, magnesium — is appropriate at this stage.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-8">
              TajWater spring water has a naturally balanced mineral profile and neutral pH, making it suitable for
              children at this stage. Many Metro Vancouver families switch from distilled to spring water for everyday
              toddler drinking once their child is past 12 months.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-12 mb-4">Practical Guide for Metro Vancouver Families</h2>

            <div className="space-y-5 mb-8">
              {[
                {
                  stage: 'Newborn to 6 months (formula-fed)',
                  rec: 'Use distilled water for all formula mixing. It is the safest option and eliminates concerns about fluoride, lead, chlorine, and other dissolved minerals. Order a weekly subscription of distilled water so you never run out.',
                  water: 'Distilled Water — $7.99–$9.99/jug',
                },
                {
                  stage: '6–12 months (formula + starting solids)',
                  rec: 'Continue with distilled for formula. For cooking purees and baby food, tap water is fine or you can use spring water. As your baby starts drinking water from a cup (small amounts), both spring and distilled are appropriate.',
                  water: 'Distilled for formula / Spring for food',
                },
                {
                  stage: '12 months+ (toddlers)',
                  rec: 'Spring water is an excellent choice for everyday toddler drinking. It provides natural minerals, has a pleasant taste, and encourages kids to drink more water. Alkaline water is safe for toddlers over 12 months but is not necessary.',
                  water: 'Spring Water — $6.49–$8.99/jug',
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#cce7f0] p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#0097a7] text-white font-bold text-sm flex items-center justify-center shrink-0">{i + 1}</div>
                    <div>
                      <p className="font-bold text-[#0c2340] mb-2">{item.stage}</p>
                      <p className="text-[#4a7fa5] text-sm leading-relaxed mb-3">{item.rec}</p>
                      <p className="text-xs font-semibold text-[#0097a7] bg-[#e0f7fa] px-3 py-1 rounded-full inline-block">{item.water}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-12 mb-4">Bottom Line</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              For Metro Vancouver families with young babies: <strong className="text-[#0c2340]">distilled water is the safest and most
              recommended choice for formula</strong>. It eliminates all the variables — fluoride, lead, chlorine, mineral imbalance —
              and gives you peace of mind that you are using the purest water possible.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-8">
              For toddlers and older children, spring water is an excellent everyday choice that is convenient, tastes good, and
              contains the natural minerals growing bodies need. TajWater delivers both to your door, anywhere in Metro Vancouver.
            </p>

            {/* CTA */}
            <div className="bg-gradient-to-r from-[#0097a7] to-[#006064] rounded-3xl p-8 text-center text-white mt-12">
              <h3 className="text-2xl font-extrabold mb-3">Distilled Water Delivery for Your Family</h3>
              <p className="text-[#b3e5fc] mb-6">
                Distilled water for baby formula — delivered weekly to your door anywhere in Metro Vancouver.
                $7.99/jug on subscription. Free delivery. No contract.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/distilled-water-delivery-vancouver" className="bg-white text-[#0097a7] font-bold px-6 py-3 rounded-xl hover:bg-[#f0f9ff] transition-colors">
                  Distilled Water Delivery
                </Link>
                <Link href="/shop" className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                  Order Now
                </Link>
              </div>
            </div>

            {/* Related posts */}
            <div className="mt-12">
              <h3 className="text-xl font-extrabold text-[#0c2340] mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { href: '/blog/spring-vs-alkaline-vs-distilled-water-vancouver', title: 'Spring vs Alkaline vs Distilled Water: Which Should You Drink in Vancouver?' },
                  { href: '/distilled-water-delivery-vancouver', title: 'Distilled Water Delivery Metro Vancouver — CPAP & Medical Use' },
                  { href: '/blog/water-delivery-vs-home-water-filter-metro-vancouver', title: 'Water Delivery vs Home Water Filter in Metro Vancouver' },
                  { href: '/blog/is-vancouver-tap-water-safe-to-drink', title: 'Is Vancouver Tap Water Safe to Drink in 2026?' },
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
