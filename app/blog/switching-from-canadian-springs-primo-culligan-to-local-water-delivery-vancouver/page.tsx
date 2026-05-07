import { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Switching from Canadian Springs, Primo, or Culligan in Metro Vancouver',
  description: 'Thinking of switching your water delivery provider in Vancouver? Compare Canadian Springs, Primo Water, and Culligan to TajWater — pricing, contracts, and service.',
  alternates: {
    canonical: 'https://tajwater.ca/blog/switching-from-canadian-springs-primo-culligan-to-local-water-delivery-vancouver',
  },
  openGraph: {
    type: 'article',
    title: 'Switching from Canadian Springs, Primo, or Culligan in Metro Vancouver | TajWater',
    description: 'A plain comparison of the major water delivery providers in Metro Vancouver — what you pay, what you get, and how to switch without hassle.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Switching from Canadian Springs, Primo, or Culligan to a Local Water Delivery Service in Metro Vancouver',
  description: 'A plain comparison of the major water delivery providers in Metro Vancouver — pricing, contracts, delivery fees, and how to switch.',
  author: { '@type': 'Organization', name: 'TajWater', url: 'https://tajwater.ca' },
  publisher: {
    '@type': 'Organization',
    name: 'TajWater',
    logo: { '@type': 'ImageObject', url: 'https://tajwater.ca/logo/tajcyan.svg' },
  },
  datePublished: '2026-05-06',
  dateModified: '2026-05-06',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://tajwater.ca/blog/switching-from-canadian-springs-primo-culligan-to-local-water-delivery-vancouver' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I cancel my Canadian Springs subscription in BC?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Canadian Springs requires you to call customer service to cancel. Give at least 30 days notice and confirm the cancellation number in writing (email). Return all rented coolers before your final billing date or a pickup fee applies. Owned jugs are yours to keep; rented jugs must be returned.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there an early termination fee for Primo Water or Culligan in Vancouver?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Both Primo Water and Culligan use contract-based plans in BC. Early termination fees typically range from $50 to $150 depending on how many months remain on your contract. Review your original agreement for the exact amount. TajWater never charges cancellation fees — you can cancel anytime at no cost.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is cheaper — Canadian Springs or TajWater in Metro Vancouver?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "TajWater is consistently cheaper. Canadian Springs charges $12–$16 per 5-gallon jug plus a $5–$10 delivery fee in most Metro Vancouver zones. TajWater charges $8.99/jug for spring water with free delivery on every order. Subscription customers pay from $6.49/jug. On a typical household order of 4 jugs, TajWater saves you $15–$30 per delivery.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use my existing 5-gallon jugs with TajWater?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "If your existing jugs are BPA-free and in good condition, TajWater can often accept them into our jug pool after inspection. Contact us before switching so we can confirm compatibility. You won't be charged a deposit for accepted jugs.",
      },
    },
  ],
}

const providers = [
  {
    name: 'Canadian Springs',
    price: '$12–$16/jug',
    delivery: '$5–$10/delivery',
    contract: '12–24 months',
    cancel: 'Early termination fee',
    sameDay: 'No',
    local: 'National call centre',
    areas: 'Select Metro Vancouver zones',
  },
  {
    name: 'Primo Water',
    price: '$13–$17/jug',
    delivery: 'Often included above min.',
    contract: 'Contract required',
    cancel: 'Fee varies',
    sameDay: 'No',
    local: 'National call centre',
    areas: 'Select zones',
  },
  {
    name: 'Culligan Vancouver',
    price: 'Quote-based',
    delivery: 'Varies',
    contract: 'Usually required',
    cancel: 'Early exit fees',
    sameDay: 'No',
    local: 'Regional office',
    areas: 'Vancouver & nearby',
  },
  {
    name: 'TajWater',
    price: '$8.99–$12.99/jug',
    delivery: 'Always free',
    contract: 'Never',
    cancel: 'Anytime, no fee',
    sameDay: 'Yes (before 12pm)',
    local: 'Port Coquitlam team',
    areas: '21 Metro Vancouver zones',
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
            Buyer's Guide
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-4 leading-tight">
            Switching from Canadian Springs, Primo Water, or Culligan in Metro Vancouver — A Plain Comparison
          </h1>
          <p className="text-[#4a7fa5] text-lg leading-relaxed">
            Thousands of Metro Vancouver households switch water delivery providers every year — usually because of rising prices,
            locked-in contracts, missed deliveries, or poor customer service. This guide walks through exactly what the major national
            providers charge, what the fine print looks like, and what switching to a local Metro Vancouver company actually saves you.
          </p>
          <p className="text-sm text-[#4a7fa5] mt-4">Published May 2026 · 7 min read</p>
        </header>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-[#0c2340] mb-4">Why Metro Vancouver Residents Switch Water Delivery Providers</h2>
          <p className="text-[#4a7fa5] leading-relaxed mb-4">
            The three most common reasons customers contact TajWater after leaving a national provider:
          </p>
          <ol className="list-decimal list-inside text-[#4a7fa5] space-y-3 leading-relaxed mb-4">
            <li>
              <strong className="text-[#0c2340]">Price creep.</strong> Canadian Springs, Primo Water, and Culligan all use annual price adjustment clauses buried in their contracts. Customers who started at $12/jug in 2022 are often paying $16–$18/jug by 2025 with no warning.
            </li>
            <li>
              <strong className="text-[#0c2340]">Missed deliveries.</strong> National providers route their Metro Vancouver deliveries through regional hubs. When routes get consolidated or drivers change, delivery windows shift with no communication.
            </li>
            <li>
              <strong className="text-[#0c2340]">Call centre frustration.</strong> Changing a delivery date, disputing an invoice, or pausing a subscription all require calling a national call centre — often with 20–40 minute hold times. Local providers can be reached directly.
            </li>
          </ol>
          <p className="text-[#4a7fa5] leading-relaxed">
            We have also heard from customers who simply did not know there was a local Metro Vancouver water delivery option available.
            National brands advertise heavily; smaller local companies often do not.
          </p>
        </section>

        {/* Comparison table */}
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-[#0c2340] mb-4">Side-by-Side Comparison: Canadian Springs vs Primo vs Culligan vs TajWater</h2>
          <p className="text-[#4a7fa5] leading-relaxed mb-6">
            The prices below are based on publicly available information and customer-reported pricing as of early 2026 for the Metro Vancouver area.
            National provider pricing varies by zone, account history, and promotion, so your actual rate may differ.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-[#cce7f0] mb-4">
            <table className="w-full text-sm bg-white">
              <thead>
                <tr className="bg-[#e0f7fa]">
                  <th scope="col" className="text-left px-4 py-3 font-bold text-[#0c2340]">Provider</th>
                  <th scope="col" className="text-left px-4 py-3 font-bold text-[#0c2340]">5-Gal Jug Price</th>
                  <th scope="col" className="text-left px-4 py-3 font-bold text-[#0c2340]">Delivery Fee</th>
                  <th scope="col" className="text-left px-4 py-3 font-bold text-[#0c2340]">Contract</th>
                  <th scope="col" className="text-left px-4 py-3 font-bold text-[#0c2340]">Same-Day</th>
                  <th scope="col" className="text-left px-4 py-3 font-bold text-[#0c2340]">Service Area</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((p, i) => (
                  <tr
                    key={p.name}
                    className={[
                      i < providers.length - 1 ? 'border-b border-[#cce7f0]' : '',
                      p.name === 'TajWater' ? 'bg-[#f0f9ff]' : '',
                    ].join(' ')}
                  >
                    <td className={`px-4 py-3 font-semibold ${p.name === 'TajWater' ? 'text-[#0097a7]' : 'text-[#0c2340]'}`}>{p.name}</td>
                    <td className="px-4 py-3 text-[#0c2340]">{p.price}</td>
                    <td className="px-4 py-3 text-[#4a7fa5]">{p.delivery}</td>
                    <td className="px-4 py-3 text-[#4a7fa5]">{p.contract}</td>
                    <td className="px-4 py-3 text-[#4a7fa5]">{p.sameDay}</td>
                    <td className="px-4 py-3 text-[#4a7fa5]">{p.areas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#4a7fa5]">
            * National provider prices are customer-reported and may vary. TajWater prices are published and fixed — no hidden adjustments.
          </p>
        </section>

        {/* Section 2 — Canadian Springs */}
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-[#0c2340] mb-4">Canadian Springs in Metro Vancouver — What Customers Say</h2>
          <p className="text-[#4a7fa5] leading-relaxed mb-4">
            Canadian Springs (owned by Cott Beverages) is one of the largest bottled water delivery companies in Canada.
            They operate in Metro Vancouver through a regional routing network based out of the Lower Mainland.
          </p>
          <h3 className="text-lg font-bold text-[#0c2340] mb-2">Canadian Springs pricing in BC</h3>
          <p className="text-[#4a7fa5] leading-relaxed mb-4">
            As of 2025–2026, Canadian Springs charges approximately $12–$16 per 5-gallon jug in Metro Vancouver,
            with a delivery fee of $5–$10 per delivery depending on your zone and order frequency.
            Subscription plans lock in pricing for the contract term but typically include annual adjustment clauses.
          </p>
          <h3 className="text-lg font-bold text-[#0c2340] mb-2">Canadian Springs contracts and cancellation</h3>
          <p className="text-[#4a7fa5] leading-relaxed mb-4">
            Canadian Springs uses 12–24 month service agreements in most residential accounts. Cancelling early
            typically triggers a fee equal to 2–3 months of service charges. Customers who want to pause delivery
            during a vacation must call in advance — there is no self-serve dashboard for schedule management.
          </p>
          <p className="text-[#4a7fa5] leading-relaxed">
            How to cancel Canadian Springs: Call 1-800-565-6691, reference your account number, and request a
            cancellation confirmation in writing. Allow 30 days for the final delivery and equipment pickup.
          </p>
        </section>

        {/* Section 3 — Primo */}
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-[#0c2340] mb-4">Primo Water Delivery in Vancouver — What You Need to Know</h2>
          <p className="text-[#4a7fa5] leading-relaxed mb-4">
            Primo Water Corporation acquired several regional water brands in BC and operates a home delivery business across Metro Vancouver.
            Primo pricing is quote-based — the published "exchange" price at grocery stores ($8–$10 per fill) does not apply to home delivery service.
          </p>
          <p className="text-[#4a7fa5] leading-relaxed mb-4">
            Primo home delivery pricing in Metro Vancouver typically runs $13–$17 per jug. Their routes are less frequent than local providers,
            and customers in suburban areas like Langley, Maple Ridge, and Pitt Meadows often report longer delivery windows.
          </p>
          <p className="text-[#4a7fa5] leading-relaxed">
            Primo also rents cooler dispensers at $10–$15/month. This is an ongoing cost that does not appear in the per-jug quote.
            TajWater offers cooler dispensers for sale so you own the equipment outright.
          </p>
        </section>

        {/* Section 4 — Culligan */}
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-[#0c2340] mb-4">Culligan Vancouver — Delivery vs. Filter System</h2>
          <p className="text-[#4a7fa5] leading-relaxed mb-4">
            Culligan of Vancouver focuses primarily on water softeners and whole-home filtration, not jug delivery.
            Their bottled water delivery service is available but is not their core offering — wait times for service
            calls and equipment issues can be longer than with dedicated water delivery companies.
          </p>
          <p className="text-[#4a7fa5] leading-relaxed mb-4">
            Culligan equipment rental contracts run 3–5 years in many cases. If you're specifically looking for
            5-gallon jug delivery (not a water softener or filtration rental), a dedicated delivery company
            like TajWater is almost always more cost-effective and flexible.
          </p>
          <p className="text-[#4a7fa5] leading-relaxed">
            For water filter installation, TajWater offers certified installation of under-sink RO systems and whole-home
            filters starting from $399 (supply + install) with a 2-year warranty — without the long-term rental lock-in.
            See our <Link href="/services" className="text-[#0097a7] font-semibold hover:underline">water filter installation service</Link>.
          </p>
        </section>

        {/* How to switch section */}
        <section className="mb-10 bg-[#f0f9ff] rounded-2xl border border-[#cce7f0] p-6">
          <h2 className="text-2xl font-extrabold text-[#0c2340] mb-4">How to Switch to TajWater in 3 Steps</h2>
          <ol className="space-y-4 text-[#4a7fa5] leading-relaxed">
            <li className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-[#0097a7] text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <strong className="text-[#0c2340]">Cancel your existing provider.</strong> Call your current provider or log in to your account and request cancellation. Note any return deadlines for rented equipment. You do not need to wait for the cancellation to complete before ordering from TajWater.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-[#0097a7] text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <strong className="text-[#0c2340]">Place your first TajWater order online.</strong> Visit <Link href="/shop" className="text-[#0097a7] font-semibold hover:underline">tajwater.ca/shop</Link>, choose your water type and quantity, select a delivery window, and pay online. No account setup fee, no minimum, no contract.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-[#0097a7] text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <strong className="text-[#0c2340]">Tell us about your existing jugs.</strong> If you own BPA-free 5-gallon jugs from your previous provider, contact us before your first delivery — we may be able to accept them into our pool, saving you the deposit.
              </div>
            </li>
          </ol>
          <div className="mt-6 text-center">
            <Link
              href="/shop"
              className="inline-block bg-[#0097a7] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#007a87] transition-colors"
            >
              Order Water Delivery Now →
            </Link>
          </div>
        </section>

        {/* Savings calculation */}
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-[#0c2340] mb-4">How Much Does Switching Save You?</h2>
          <p className="text-[#4a7fa5] leading-relaxed mb-4">
            A typical Metro Vancouver household orders 4–6 five-gallon jugs every two weeks.
            Here is what that looks like with Canadian Springs versus TajWater:
          </p>
          <div className="overflow-x-auto rounded-2xl border border-[#cce7f0]">
            <table className="w-full text-sm bg-white">
              <thead>
                <tr className="bg-[#e0f7fa]">
                  <th scope="col" className="text-left px-5 py-3 font-bold text-[#0c2340]">Scenario</th>
                  <th scope="col" className="text-left px-5 py-3 font-bold text-[#4a7fa5]">Canadian Springs</th>
                  <th scope="col" className="text-left px-5 py-3 font-bold text-[#0097a7]">TajWater</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['4 spring water jugs', '$52–$64 + $7 delivery = $59–$71', '$35.96, delivery free'],
                  ['6 spring water jugs', '$78–$96 + $7 delivery = $85–$103', '$53.94, delivery free'],
                  ['4 jugs, bi-weekly for 1 year', '$1,534–$1,846/year', '$935/year'],
                  ['6 jugs, bi-weekly for 1 year', '$2,210–$2,678/year', '$1,402/year'],
                ].map(([scenario, springs, taj], i, arr) => (
                  <tr key={scenario} className={i < arr.length - 1 ? 'border-b border-[#cce7f0]' : ''}>
                    <td className="px-5 py-3 font-medium text-[#0c2340]">{scenario}</td>
                    <td className="px-5 py-3 text-[#4a7fa5]">{springs}</td>
                    <td className="px-5 py-3 font-semibold text-[#0097a7]">{taj}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#4a7fa5] mt-2">* Canadian Springs prices are estimates based on customer-reported 2025–2026 pricing in Metro Vancouver.</p>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-[#0c2340] mb-6">Frequently Asked Questions About Switching Water Delivery in Vancouver</h2>
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
          <h2 className="text-2xl font-extrabold mb-3">Ready to Switch?</h2>
          <p className="text-[#b3e5fc] mb-6 max-w-xl mx-auto">
            TajWater delivers 5-gallon spring, alkaline, and distilled water to homes and offices across all 21
            Metro Vancouver zones. No contracts, no delivery fees, same-day available.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="inline-block bg-white text-[#0097a7] font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-shadow"
            >
              Order Your First Delivery
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-white/20 text-white font-bold px-8 py-3 rounded-xl border-2 border-white/40 hover:bg-white/30 transition-colors"
            >
              Ask a Question
            </Link>
          </div>
          <p className="text-[#b3e5fc] text-sm mt-4">
            Or call us directly: <a href="tel:+17785047880" className="text-white font-semibold hover:underline">+1 778-504-7880</a>
          </p>
        </section>

        {/* Navigation */}
        <nav className="mt-12 pt-8 border-t border-[#cce7f0]" aria-label="Related articles">
          <h3 className="text-sm font-semibold text-[#4a7fa5] mb-4 uppercase tracking-wide">Related Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: '/blog/how-much-does-water-delivery-cost-metro-vancouver', label: 'How much does water delivery cost in Metro Vancouver?' },
              { href: '/blog/spring-vs-alkaline-vs-distilled-water-vancouver', label: 'Spring vs Alkaline vs Distilled Water — Which Is Right for You?' },
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
