import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Is Vancouver Tap Water Safe to Drink in 2026?',
  description: 'Metro Vancouver tap water meets Health Canada guidelines — but chlorine taste, aging pipes, and building-level contamination affect many residents in Burnaby, Surrey, and Coquitlam. Here is what the data says.',
  keywords: [
    'is Vancouver tap water safe to drink',
    'Vancouver tap water quality 2026',
    'Metro Vancouver water quality report',
    'chlorine in Vancouver tap water',
    'tap water vs bottled water Vancouver',
    'Burnaby water quality',
    'Surrey tap water safe',
  ],
  alternates: { canonical: '/blog/is-vancouver-tap-water-safe-to-drink' },
  openGraph: {
    title: 'Is Vancouver Tap Water Safe to Drink in 2026?',
    description: 'What the Metro Vancouver water quality data actually says — and when delivery water makes more sense.',
    url: '/blog/is-vancouver-tap-water-safe-to-drink',
    type: 'article',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Vancouver Tap Water Safety Guide 2026' }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Is Vancouver Tap Water Safe to Drink in 2026?',
  description: 'Metro Vancouver tap water meets Health Canada guidelines — but chlorine, aging pipes, and building-level contamination affect many residents.',
  datePublished: '2026-04-22',
  dateModified: '2026-04-22',
  author: { '@type': 'Organization', name: 'TajWater', url: 'https://tajwater.ca' },
  publisher: { '@type': 'Organization', name: 'TajWater', url: 'https://tajwater.ca', logo: { '@type': 'ImageObject', url: 'https://tajwater.ca/logo/tajcyan.svg' } },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://tajwater.ca/blog/is-vancouver-tap-water-safe-to-drink' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Is Metro Vancouver tap water safe to drink?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Metro Vancouver tap water meets all Health Canada drinking water guidelines and is considered safe to drink. However, chlorine and chloramines used in treatment cause taste and odour issues for many residents, and older buildings with galvanized or lead pipes can introduce contaminants at the tap level.' } },
    { '@type': 'Question', name: 'Does Vancouver tap water have chlorine?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Metro Vancouver uses chloramine (a combination of chlorine and ammonia) to disinfect the municipal water supply. While safe at regulated levels, many residents in Vancouver, Burnaby, and Surrey notice a distinct chlorine-like taste and odour, especially in hot water and after rainfall when treatment levels are increased.' } },
    { '@type': 'Question', name: 'Does Vancouver tap water have fluoride?', acceptedAnswer: { '@type': 'Answer', text: 'No. Metro Vancouver does not fluoridate its tap water. This is a common point of confusion — Metro Vancouver stopped fluoridation in 1992. Surrey and some other municipalities previously added fluoride but have since discontinued the practice.' } },
    { '@type': 'Question', name: 'Why does my tap water taste bad in Vancouver?', acceptedAnswer: { '@type': 'Answer', text: 'The most common causes of bad-tasting tap water in Metro Vancouver are chloramine disinfection treatment (most common), seasonal changes in reservoir water composition, aging pipes in older buildings, and hot water heater sediment. The municipal water supply itself is technically safe — the taste issue often originates in the building plumbing, not the source water.' } },
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

          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[#e0f7fa] text-[#0097a7] mb-4">Water Quality</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-4 leading-tight">
            Is Vancouver Tap Water Safe to Drink in 2026?
          </h1>
          <p className="text-[#4a7fa5] text-sm mb-8">Published April 22, 2026 · 7 min read · By TajWater</p>

          <div className="text-[#0c2340]">
            <p className="text-lg text-[#4a7fa5] leading-relaxed mb-8">
              <strong className="text-[#0c2340]">The short answer: technically yes.</strong> Metro Vancouver tap water meets all
              Health Canada drinking water quality guidelines. But &ldquo;safe&rdquo; and &ldquo;good to drink&rdquo; are not always the
              same thing — and for a significant portion of Metro Vancouver residents, the gap between those two
              definitions drives them to water delivery.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">Where Metro Vancouver&apos;s Water Comes From</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Metro Vancouver draws its drinking water from three mountain reservoirs in the Coast Mountains: Capilano,
              Seymour, and Coquitlam. These are protected watersheds — no logging, no agriculture, no public access — which
              means the source water quality is among the highest of any major Canadian city.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              The water is then treated at the Seymour-Capilano Filtration Plant (opened 2009) and the Coquitlam
              Water Treatment Plant, where it is filtered, disinfected, and distributed through approximately
              10,000 kilometres of water mains across the region.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">The Chloramine Issue</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Metro Vancouver uses <strong className="text-[#0c2340]">chloramine</strong> — a combination of chlorine and ammonia —
              as its primary disinfectant. Chloramine is more stable than chlorine alone, meaning it stays active
              longer in the distribution system and reaches the far ends of the network more effectively.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              However, chloramine produces a more noticeable taste and odour than straight chlorine for many people.
              The &ldquo;swimming pool&rdquo; or &ldquo;bleach&rdquo; taste that Vancouver, Burnaby, and Surrey residents sometimes notice —
              especially in summer when temperatures rise — is chloramine at work.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Chloramine levels in Metro Vancouver tap water are regulated at a maximum of 3 mg/L, well within
              Health Canada&apos;s guidelines of 3 mg/L. Safe to drink — but noticeably present in taste for sensitive
              individuals.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">The Building Pipe Problem</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Here is where it gets more complicated. The municipal water supply is safe when it leaves the treatment
              plant. But what happens between the water main on your street and your kitchen tap depends entirely
              on your building&apos;s plumbing.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Buildings constructed before 1990 in Vancouver, Burnaby, New Westminster, and Surrey may have galvanized
              steel or copper pipes with lead solder joints. As water sits in these pipes — especially overnight —
              it can leach small amounts of lead, copper, and rust into the water at the tap.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Health Canada&apos;s maximum acceptable concentration for lead in drinking water is 5 micrograms per litre (µg/L).
              Testing by Metro Vancouver shows that first-draw water from older buildings — the water that has been
              sitting in the pipes overnight — can occasionally exceed this threshold in buildings with lead solder.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-6">
              If you live in an apartment or house built before 1990, particularly in East Vancouver, Burnaby Heights,
              or older parts of Surrey and New Westminster, this is worth knowing.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">Does Vancouver Tap Water Have Fluoride?</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              <strong className="text-[#0c2340]">No.</strong> Metro Vancouver stopped fluoridating its water supply in 1992.
              Surrey discontinued fluoridation in 2004. Most municipalities in the region have no fluoride in their
              tap water today.
            </p>
            <p className="text-[#4a7fa5] leading-relaxed mb-6">
              This is a common source of confusion because many other Canadian cities (Toronto, Calgary, Ottawa)
              still fluoridate. If you moved to BC from another province and are wondering whether your water is
              fluoridated, the answer for Metro Vancouver is almost certainly no.
            </p>

            <h2 className="text-2xl font-extrabold text-[#0c2340] mt-10 mb-4">When Does Delivered Water Make More Sense?</h2>
            <p className="text-[#4a7fa5] leading-relaxed mb-4">
              Delivered bottled water is not necessary for most Metro Vancouver households from a safety perspective.
              But there are specific situations where it is the right call:
            </p>
            <ul className="space-y-3 mb-6 text-[#4a7fa5]">
              <li><strong className="text-[#0c2340]">Older buildings with unknown pipe materials</strong> — if you live in a pre-1990 building and notice a metallic taste, delivered water removes the uncertainty entirely.</li>
              <li><strong className="text-[#0c2340]">Newborns and young children</strong> — Health Canada recommends extra caution with lead exposure for infants. Delivered spring or distilled water eliminates pipe-related lead risk.</li>
              <li><strong className="text-[#0c2340]">Taste sensitivity</strong> — if chloramine taste bothers you, delivered water that contains zero chlorine or chloramines is a consistent, noticeable upgrade.</li>
              <li><strong className="text-[#0c2340]">CPAP machines</strong> — distilled water is required. Tap water, even good tap water, causes mineral buildup in CPAP humidifier chambers.</li>
              <li><strong className="text-[#0c2340]">Cooking and coffee/tea</strong> — mineral content affects flavour. Spring water&apos;s natural mineral balance typically produces better-tasting food and beverages.</li>
            </ul>

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
              <h3 className="font-extrabold text-[#0c2340] text-lg mb-2">Pure Water Delivered Across Metro Vancouver</h3>
              <p className="text-[#4a7fa5] text-sm mb-4">
                TajWater delivers independently tested spring, alkaline, and distilled water to 21 cities across
                Metro Vancouver. Zero chlorine. Zero chloramines. Free delivery on every order.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0097a7] text-white font-bold text-sm hover:bg-[#00838f] transition-colors">
                  Order Water Delivery →
                </Link>
                <Link href="/areas" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#0097a7] text-[#0097a7] font-semibold text-sm hover:bg-[#0097a7] hover:text-white transition-colors">
                  Check Your Delivery Area →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
