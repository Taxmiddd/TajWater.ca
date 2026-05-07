import { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Time to Switch Your Water Delivery Provider in Metro Vancouver?',
  description: 'Missed deliveries, hidden fees, locked contracts — if your current water delivery company isn\'t meeting your needs, switching to a local Metro Vancouver provider is easier than you think.',
  alternates: {
    canonical: 'https://tajwater.ca/blog/switching-water-delivery-providers-metro-vancouver',
  },
  openGraph: {
    type: 'article',
    title: 'Time to Switch Your Water Delivery Provider in Metro Vancouver? | TajWater',
    description: 'Signs it\'s time to switch water delivery companies — and how to do it without hassle in Metro Vancouver.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Time to Switch Your Water Delivery Provider in Metro Vancouver?',
  description: 'Missed deliveries, hidden fees, locked contracts — if your current water delivery company isn\'t meeting your needs, here\'s how to switch easily.',
  author: { '@type': 'Organization', name: 'TajWater', url: 'https://tajwater.ca' },
  publisher: {
    '@type': 'Organization',
    name: 'TajWater',
    logo: { '@type': 'ImageObject', url: 'https://tajwater.ca/logo/tajcyan.svg' },
  },
  datePublished: '2026-05-06',
  dateModified: '2026-05-06',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://tajwater.ca/blog/switching-water-delivery-providers-metro-vancouver' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I cancel my current water delivery subscription in BC?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Contact your current provider by phone or email and request a cancellation. Ask for a written confirmation. Return any rented coolers or equipment before your final billing date to avoid pickup fees. Check your original agreement for any notice period required — typically 30 days.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will I lose my water jug deposit when I switch providers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No — your bottle deposit belongs to you. When you cancel with your current provider and return their jugs, they are required to refund your deposit. If your jugs are compatible with your new provider, they may be accepted into the new jug pool, saving you a new deposit.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I switch water delivery providers without a gap in service?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You do not need to wait for your cancellation to finalize before placing your first order with TajWater. Simply order your first delivery and cancel your old service in parallel. TajWater can often deliver same-day for orders placed before 12pm.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is TajWater cheaper than most water delivery services in Metro Vancouver?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TajWater spring water starts at $8.99 per 5-gallon jug with free delivery — no contracts, no cancellation fees, and no zone surcharges across all 21 Metro Vancouver cities. Subscription customers pay from $6.49 per jug.',
      },
    },
  ],
}

const reasons = [
  {
    title: 'Missed or unreliable deliveries',
    body: 'Your business or family depends on having clean water available. If your provider regularly misses delivery windows, shows up on the wrong day, or gives you no notice when a delivery is skipped — that\'s a problem worth fixing. Reliable scheduling is not a luxury; it\'s the baseline expectation.',
  },
  {
    title: 'Prices that keep creeping up',
    body: 'Many water delivery contracts include annual price adjustment clauses buried in the fine print. You might have signed up at one rate and found yourself paying significantly more a year or two later with no warning. If you\'re paying more than you expected and can\'t find the pricing published anywhere, that\'s a red flag.',
  },
  {
    title: 'Contracts you didn\'t fully understand',
    body: 'Some providers require 12 to 24 month commitments with early termination fees. If pausing your delivery for a vacation, changing your schedule, or cancelling entirely comes with friction or financial penalties — you\'re not in a flexible service relationship.',
  },
  {
    title: 'Customer service that doesn\'t pick up',
    body: 'When you have a question about your delivery, an issue with your order, or need to make a change, you should be able to reach someone quickly. If you\'re being routed through national call centres with long hold times or your emails go unanswered for days, it\'s time to work with a local team.',
  },
  {
    title: 'Lack of pricing transparency',
    body: 'If you had to call or submit a form just to find out what a jug of water costs, that\'s intentional. Providers who don\'t publish their pricing online make it harder to compare and easier to raise rates without notice. Transparent pricing is a basic sign of a trustworthy service.',
  },
  {
    title: 'Limited delivery coverage in your area',
    body: 'Some larger providers cover only select parts of Metro Vancouver, leaving suburban and outer zones underserved or charged extra. If you\'re in Langley, Maple Ridge, Squamish, or anywhere outside the urban core and you\'re being told your area has limited availability — look for a provider that actually covers your zone.',
  },
]

export default function SwitchingProvidersPost() {
  return (
    <>
      <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-[#4a7fa5] mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          {' › '}
          <Link href="/blog" className="hover:underline">Blog</Link>
          {' › '}
          <span className="text-[#0c2340]">Switching Water Delivery Providers</span>
        </nav>

        <header className="mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-[#e0f7fa] text-[#0097a7] text-xs font-semibold mb-4">
            Buyer&apos;s Guide
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-4 leading-tight">
            Time to Switch Your Water Delivery Provider in Metro Vancouver?
          </h1>
          <p className="text-[#4a7fa5] text-lg leading-relaxed">
            If your current water delivery company keeps missing deliveries, raises prices without warning,
            locks you into contracts, or just doesn&apos;t answer the phone — you have options.
            Switching to a reliable local provider in Metro Vancouver is simpler than most people think,
            and the difference in service quality can be immediate.
          </p>
          <p className="text-sm text-[#4a7fa5] mt-4">Published May 2026 · 6 min read</p>
        </header>

        {/* Signs it's time to switch */}
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#0c2340] mb-6">
            6 Signs Your Current Water Delivery Provider Isn&apos;t Working for You
          </h2>
          <div className="space-y-6">
            {reasons.map((r, i) => (
              <div key={r.title} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#e0f7fa] text-[#0097a7] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-[#0c2340] mb-1">{r.title}</h3>
                  <p className="text-[#4a7fa5] text-sm leading-relaxed">{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What to look for */}
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#0c2340] mb-4">
            What to Look for in a Replacement Water Delivery Service
          </h2>
          <p className="text-[#4a7fa5] leading-relaxed mb-6">
            Before switching, it&apos;s worth knowing what a well-run water delivery service looks like.
            Here is a simple checklist to compare any provider against:
          </p>
          <div className="overflow-x-auto rounded-2xl border border-[#cce7f0]">
            <table className="w-full text-sm bg-white">
              <thead>
                <tr className="bg-[#e0f7fa]">
                  <th scope="col" className="text-left px-5 py-3 font-bold text-[#0c2340]">What to check</th>
                  <th scope="col" className="text-left px-5 py-3 font-bold text-[#0c2340]">Green flag</th>
                  <th scope="col" className="text-left px-5 py-3 font-bold text-[#0c2340]">Red flag</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Pricing', 'Published clearly on website', 'Quote required — call us'],
                  ['Delivery fee', 'Free or included in jug price', 'Added at checkout or per delivery'],
                  ['Contracts', 'No commitment required', '12–24 month lock-in'],
                  ['Cancellation', 'Cancel anytime, no fee', 'Early termination penalties'],
                  ['Same-day delivery', 'Available in most zones', 'Not offered'],
                  ['Customer service', 'Local team, real phone number', 'National call centre only'],
                  ['Service area', 'Covers your exact city', 'Gaps or surcharges in outer zones'],
                ].map(([check, green, red], i, arr) => (
                  <tr key={check} className={i < arr.length - 1 ? 'border-b border-[#cce7f0]' : ''}>
                    <td className="px-5 py-3 font-medium text-[#0c2340]">{check}</td>
                    <td className="px-5 py-3 text-emerald-600 font-medium">{green}</td>
                    <td className="px-5 py-3 text-[#4a7fa5]">{red}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* How TajWater compares */}
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#0c2340] mb-4">How TajWater Compares</h2>
          <p className="text-[#4a7fa5] leading-relaxed mb-4">
            TajWater is a Metro Vancouver–based water delivery company operating out of Port Coquitlam.
            Here is exactly what we offer — no fine print:
          </p>
          <ul className="space-y-3 text-[#4a7fa5] text-sm leading-relaxed">
            {[
              'Spring water from $8.99 per 5-gallon jug — published, fixed, no surprises',
              'Alkaline water at $12.99/jug and distilled at $9.99/jug',
              'Subscription customers pay from $6.49/jug — pause or cancel anytime',
              'Free delivery on every order across all 21 Metro Vancouver zones',
              'Same-day delivery for orders placed before 12pm',
              'No contracts, no annual price adjustments, no early termination fees',
              'Local Port Coquitlam team — real people who answer the phone',
              'One-time $12 bottle deposit, refunded in full when you stop service',
            ].map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="text-[#0097a7] font-bold mt-0.5">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* How to switch */}
        <section className="mb-12 bg-[#f0f9ff] rounded-2xl border border-[#cce7f0] p-6">
          <h2 className="text-2xl font-extrabold text-[#0c2340] mb-6">How to Switch in 3 Steps</h2>
          <ol className="space-y-5">
            {[
              {
                step: '1',
                title: 'Cancel with your current provider',
                body: 'Call or email your current water delivery company and request cancellation in writing. Ask for a cancellation confirmation number. Note any equipment return deadlines. You don\'t need to wait for this to complete before your first TajWater order.',
              },
              {
                step: '2',
                title: 'Place your first TajWater order',
                body: 'Visit tajwater.ca/shop, choose your water type and quantity, and select a delivery window. No account setup fee, no minimum order, no contract to sign. You can order while your old service is still technically active.',
              },
              {
                step: '3',
                title: 'Ask about your existing jugs',
                body: 'If you own BPA-free 5-gallon jugs in good condition, contact us before your first delivery. We may be able to accept them, saving you the bottle deposit on your first order.',
              },
            ].map((item) => (
              <li key={item.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0097a7] text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div>
                  <p className="font-bold text-[#0c2340] mb-1">{item.title}</p>
                  <p className="text-[#4a7fa5] text-sm leading-relaxed">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 text-center">
            <Link
              href="/shop"
              className="inline-block bg-[#0097a7] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#007a87] transition-colors"
            >
              Order Your First Delivery →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#0c2340] mb-6">
            Common Questions About Switching Water Delivery in Metro Vancouver
          </h2>
          <div className="space-y-5">
            {faqSchema.mainEntity.map((item) => (
              <div key={item.name} className="border-b border-[#cce7f0] pb-5">
                <h3 className="font-bold text-[#0c2340] mb-2">{item.name}</h3>
                <p className="text-[#4a7fa5] text-sm leading-relaxed">{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-[#0097a7] to-[#006064] rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-extrabold mb-3">Ready for Reliable Water Delivery?</h2>
          <p className="text-[#b3e5fc] mb-6 max-w-xl mx-auto">
            TajWater delivers spring, alkaline, and distilled 5-gallon water jugs to all 21 Metro Vancouver
            zones. No contracts, no delivery fees, same-day available before 12pm.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="inline-block bg-white text-[#0097a7] font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-shadow"
            >
              Order Water Delivery
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-white/20 text-white font-bold px-8 py-3 rounded-xl border-2 border-white/40 hover:bg-white/30 transition-colors"
            >
              Ask a Question
            </Link>
          </div>
          <p className="text-[#b3e5fc] text-sm mt-4">
            Call us: <a href="tel:+17785047880" className="text-white font-semibold hover:underline">+1 778-504-7880</a>
          </p>
        </section>

        {/* Related */}
        <nav className="mt-12 pt-8 border-t border-[#cce7f0]" aria-label="Related articles">
          <h3 className="text-sm font-semibold text-[#4a7fa5] mb-4 uppercase tracking-wide">Related Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: '/blog/how-much-does-water-delivery-cost-metro-vancouver', label: 'How much does water delivery cost in Metro Vancouver?' },
              { href: '/blog/spring-vs-alkaline-vs-distilled-water-vancouver', label: 'Spring vs Alkaline vs Distilled — Which Is Right for You?' },
              { href: '/blog/is-vancouver-tap-water-safe-to-drink', label: 'Is Vancouver Tap Water Safe to Drink?' },
              { href: '/areas', label: 'View All Delivery Areas in Metro Vancouver' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-[#0097a7] hover:underline leading-snug">
                {link.label} →
              </Link>
            ))}
          </div>
        </nav>
      </article>
    </>
  )
}
