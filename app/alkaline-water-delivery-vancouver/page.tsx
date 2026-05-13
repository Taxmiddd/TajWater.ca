import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Droplets, Zap, Shield, Star, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Alkaline Water Delivery Vancouver — 5-Gallon Jugs $10.99 | Taj Water',
  description: 'Alkaline water delivery in Metro Vancouver. pH balanced alkaline water delivered to your door in 5-gallon jugs. Same-day available, free delivery, no contract. $10.99/jug.',
  keywords: [
    'alkaline water delivery Vancouver',
    'alkaline water delivery Metro Vancouver',
    'alkaline water delivery Burnaby',
    'alkaline water delivery Surrey',
    'alkaline water delivery Coquitlam',
    '5 gallon alkaline water Vancouver',
    'alkaline water jug delivery BC',
    'alkaline water subscription Vancouver',
    'best alkaline water Vancouver',
  ],
  alternates: { canonical: 'https://tajwater.ca/alkaline-water-delivery-vancouver' },
  openGraph: {
    title: 'Alkaline Water Delivery Vancouver — $10.99/Jug | Taj Water',
    description: 'pH balanced alkaline water delivered to your door in Metro Vancouver. Same-day available, free delivery, no contract.',
    url: 'https://tajwater.ca/alkaline-water-delivery-vancouver',
    type: 'website',
    images: [{ url: 'https://tajwater.ca/opengraph-image', width: 1200, height: 630 }],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Product',
      name: 'Alkaline Water — 5-Gallon Jug Delivery',
      description: 'pH balanced alkaline water delivered in BPA-free 5-gallon jugs across Metro Vancouver. Rich in electrolytes and perfect for an active lifestyle.',
      brand: { '@type': 'Brand', name: 'Taj Water' },
      image: 'https://tajwater.ca/opengraph-image',
      sku: 'TW-ALK-5GAL',
      mpn: 'TW-ALK-5GAL',
      offers: {
        '@type': 'Offer',
        price: '10.99',
        priceCurrency: 'CAD',
        priceValidUntil: '2026-12-31',
        availability: 'https://schema.org/InStock',
        url: 'https://tajwater.ca/shop',
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'CAD' },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
            transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
          },
        },
        seller: {
          '@type': 'LocalBusiness',
          name: 'Taj Water',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '1770 McLean Ave',
            addressLocality: 'Port Coquitlam',
            addressRegion: 'BC',
            postalCode: 'V3C 4K8',
            addressCountry: 'CA',
          },
          telephone: '+17785047880',
          url: 'https://tajwater.ca',
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '98',
        bestRating: '5',
        worstRating: '1',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is alkaline water?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Alkaline water is pH balanced water with a higher pH than regular tap water. It contains trace electrolytes — calcium, magnesium, and potassium — and is popular among active and health-conscious individuals for its smooth taste and hydrating qualities.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does alkaline water delivery cost in Vancouver?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Taj Water alkaline water is $10.99 per 5-gallon jug with free delivery across Metro Vancouver. Subscription plans start at $29.99/week. No minimum order, no setup fees, no contracts.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between alkaline water and spring water?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Spring water is sourced from a natural underground spring and retains its natural mineral profile. Alkaline water is processed to have a higher, balanced pH and contains trace electrolytes. Alkaline water is often preferred by people with active lifestyles, while spring water is the most popular everyday choice for families.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you deliver alkaline water to Burnaby, Surrey, and Coquitlam?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Taj Water delivers alkaline water to all 21 Metro Vancouver cities including Burnaby, Surrey, Richmond, Coquitlam, Port Coquitlam, North Vancouver, West Vancouver, Langley, Delta, Port Moody, White Rock, Maple Ridge, Pitt Meadows, Squamish, Whistler, and more. Delivery is free on every order.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is alkaline water safe for babies and children?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Alkaline water is generally not recommended for infants under 12 months. For children over 1 year, alkaline water is safe. Taj Water recommends distilled or spring water for infants — please consult your pediatrician if unsure.',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tajwater.ca' },
        { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://tajwater.ca/shop' },
        { '@type': 'ListItem', position: 3, name: 'Alkaline Water Delivery Vancouver', item: 'https://tajwater.ca/alkaline-water-delivery-vancouver' },
      ],
    },
  ],
}

const cities = [
  { name: 'Vancouver', slug: 'vancouver' },
  { name: 'Burnaby', slug: 'burnaby' },
  { name: 'Richmond', slug: 'richmond' },
  { name: 'Surrey', slug: 'surrey' },
  { name: 'Coquitlam', slug: 'coquitlam' },
  { name: 'Port Coquitlam', slug: 'port-coquitlam' },
  { name: 'North Vancouver', slug: 'north-vancouver' },
  { name: 'West Vancouver', slug: 'west-vancouver' },
  { name: 'Langley', slug: 'langley' },
  { name: 'Delta', slug: 'delta' },
  { name: 'Port Moody', slug: 'port-moody' },
  { name: 'White Rock', slug: 'white-rock' },
  { name: 'Maple Ridge', slug: 'maple-ridge' },
  { name: 'Pitt Meadows', slug: 'pitt-meadows' },
]

export default function AlkalineWaterDeliveryVancouver() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen">

        {/* Hero */}
        <section className="hero-gradient py-20 sm:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5" /> pH Balanced Alkaline Water
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
              Alkaline Water Delivery<br />
              <span className="text-[#b3e5fc]">Metro Vancouver</span>
            </h1>
            <p className="text-[#b3e5fc] text-lg sm:text-xl max-w-3xl mx-auto mb-10">
              pH balanced alkaline water delivered to your home or office in 5-gallon BPA-free jugs.
              Free delivery across all 21 Metro Vancouver cities. Same-day available before 12pm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/shop" className="btn-primary text-lg px-8 py-4">
                Order Alkaline Water — $10.99/Jug
              </Link>
              <Link href="/contact" className="bg-white/20 hover:bg-white/30 text-white font-bold px-8 py-4 rounded-xl transition-colors">
                Get a Subscription Quote
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-white/90 text-sm">
              {['Free Delivery', 'Same-Day Available', 'No Contract', 'Cancel Anytime', 'pH Balanced'].map((f) => (
                <span key={f} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#80deea]" /> {f}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Rating bar */}
        <div className="bg-[#0097a7] py-4">
          <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-6 sm:gap-12 text-white text-sm font-semibold">
            <span className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-300 fill-yellow-300" /> 4.9/5 — 98 Reviews</span>
            <span>Free Delivery on Every Order</span>
            <span>21 Metro Vancouver Cities</span>
            <span>No Minimum Order</span>
          </div>
        </div>

        {/* What is Alkaline Water */}
        <section className="py-20 bg-[#f0f9ff]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-6">
                  What is Alkaline Water?
                </h2>
                <p className="text-[#4a7fa5] leading-relaxed mb-4">
                  Alkaline water is pH balanced water that has been processed to have a higher pH than regular
                  tap or spring water. It contains trace electrolytes — calcium, magnesium, and potassium — that
                  contribute to its balanced composition and smooth taste.
                </p>
                <p className="text-[#4a7fa5] leading-relaxed mb-4">
                  Many customers find alkaline water has a silkier, smoother taste compared to regular water.
                  It is the top choice among Taj Water&apos;s active and health-conscious customers across Metro Vancouver.
                </p>
                <p className="text-[#4a7fa5] leading-relaxed">
                  Sourced, processed, and delivered locally from our Port Coquitlam facility — not shipped from
                  distant warehouses.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-[#cce7f0] overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-[#0097a7] to-[#006064] px-6 py-4">
                  <h3 className="text-white font-bold text-lg">Alkaline Water Specifications</h3>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ['Water Type', 'pH Balanced Alkaline'],
                      ['Electrolytes', 'Ca, Mg, K (trace)'],
                      ['Jug Size', '5 gallon (18.9L)'],
                      ['Jug Material', 'BPA-free polycarbonate'],
                      ['Batch Testing', 'Quality tested every batch'],
                      ['Best For', 'Active lifestyle, hydration'],
                      ['Price', '$10.99/jug one-time'],
                      ['Subscription', 'From $29.99/week'],
                    ].map(([label, value], i) => (
                      <tr key={label} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f0f9ff]'}>
                        <td className="px-5 py-3 font-semibold text-[#0c2340] border-b border-[#cce7f0]">{label}</td>
                        <td className="px-5 py-3 text-[#0097a7] font-medium border-b border-[#cce7f0]">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] text-center mb-4">
              Why Metro Vancouver Residents Choose Alkaline Water
            </h2>
            <p className="text-[#4a7fa5] text-center max-w-2xl mx-auto mb-12 text-lg">
              Alkaline water is the most popular choice among Taj Water&apos;s active, health-conscious customers.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Zap className="w-7 h-7 text-[#0097a7]" />,
                  title: 'Smoother Taste',
                  desc: 'Most people notice a silkier, less "flat" taste compared to regular water — making it easier and more enjoyable to stay hydrated.',
                },
                {
                  icon: <Droplets className="w-7 h-7 text-[#0097a7]" />,
                  title: 'Electrolyte Content',
                  desc: 'Contains trace calcium, magnesium, and potassium — naturally occurring electrolytes that support overall hydration.',
                },
                {
                  icon: <Shield className="w-7 h-7 text-[#0097a7]" />,
                  title: 'pH Balanced',
                  desc: 'Our alkaline water is pH balanced for a clean, smooth drinking experience that many customers prefer over standard tap or spring water.',
                },
                {
                  icon: <CheckCircle className="w-7 h-7 text-[#0097a7]" />,
                  title: 'BPA-Free Jugs',
                  desc: 'Delivered in sanitized, BPA-free 5-gallon polycarbonate jugs. Jugs are collected and cleaned on every delivery.',
                },
                {
                  icon: <Star className="w-7 h-7 text-[#0097a7]" />,
                  title: 'Popular with Active Households',
                  desc: 'Sports-active households in Coquitlam, North Vancouver, and Burnaby choose alkaline water for everyday hydration.',
                },
                {
                  icon: <MapPin className="w-7 h-7 text-[#0097a7]" />,
                  title: 'Locally Delivered',
                  desc: 'Sourced and delivered locally from our Port Coquitlam facility — not shipped from distant warehouses.',
                },
              ].map((item) => (
                <div key={item.title} className="bg-[#f0f9ff] rounded-2xl p-6 border border-[#cce7f0]">
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-[#0c2340] font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-[#4a7fa5] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-[#f0f9ff]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-4">
              Alkaline Water Delivery Pricing — Metro Vancouver
            </h2>
            <p className="text-[#4a7fa5] text-lg mb-12 max-w-2xl mx-auto">
              Transparent pricing. No hidden fees. Free delivery on every order.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                {
                  plan: 'One-Time Order',
                  price: '$10.99',
                  unit: 'per jug',
                  features: ['No commitment', 'Order anytime', 'Free delivery', 'Jug swap included'],
                  cta: 'Order Now',
                  highlight: false,
                },
                {
                  plan: 'Weekly Subscription',
                  price: '$29.99',
                  unit: 'per week',
                  features: ['Weekly delivery', 'Cancel anytime', 'Free delivery', 'Priority scheduling'],
                  cta: 'Subscribe Weekly',
                  highlight: true,
                },
                {
                  plan: 'Monthly Subscription',
                  price: '$59.99',
                  unit: 'per month',
                  features: ['Monthly delivery', 'Cancel anytime', 'Free delivery', 'Dedicated route'],
                  cta: 'Subscribe Monthly',
                  highlight: false,
                },
              ].map((tier) => (
                <div
                  key={tier.plan}
                  className={`rounded-2xl p-6 border-2 ${tier.highlight ? 'border-[#0097a7] bg-white shadow-lg' : 'border-[#cce7f0] bg-white'}`}
                >
                  {tier.highlight && (
                    <div className="text-xs font-bold text-[#0097a7] bg-[#e0f7fa] px-3 py-1 rounded-full inline-block mb-3">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-[#0c2340] font-bold text-lg mb-1">{tier.plan}</h3>
                  <div className="text-3xl font-extrabold text-[#0097a7] mb-1">{tier.price}</div>
                  <div className="text-[#4a7fa5] text-sm mb-5">{tier.unit}</div>
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[#4a7fa5]">
                        <CheckCircle className="w-4 h-4 text-[#0097a7] shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/shop"
                    className={`block text-center font-bold py-3 rounded-xl transition-colors ${tier.highlight ? 'bg-[#0097a7] text-white hover:bg-[#00838f]' : 'bg-[#f0f9ff] text-[#0097a7] border border-[#0097a7] hover:bg-[#e0f7fa]'}`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#4a7fa5]">
              All prices in CAD. Delivery always free. No setup fee. Cancel subscriptions anytime — no penalty.
            </p>
          </div>
        </section>

        {/* Alkaline vs Spring vs Distilled */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] text-center mb-4">
              Alkaline vs Spring vs Distilled Water
            </h2>
            <p className="text-[#4a7fa5] text-center mb-12 max-w-2xl mx-auto">
              Not sure which water type is right for you? Here is a plain-English comparison.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-[#cce7f0] bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#e0f7fa]">
                    <th className="text-left px-5 py-4 font-bold text-[#0c2340]">Feature</th>
                    <th className="text-left px-5 py-4 font-bold text-[#0097a7]">Alkaline</th>
                    <th className="text-left px-5 py-4 font-bold text-[#0c2340]">Spring</th>
                    <th className="text-left px-5 py-4 font-bold text-[#0c2340]">Distilled</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Water Type', 'pH Balanced Alkaline', 'Natural Spring', 'Pure Distilled'],
                    ['Source', 'Processed & balanced', 'Natural underground spring', 'Purified by distillation'],
                    ['Minerals', 'Trace electrolytes (Ca, Mg, K)', 'Natural minerals intact', 'None (pure H₂O)'],
                    ['Taste', 'Silky, smooth', 'Crisp, natural', 'Very flat, pure'],
                    ['Price (5 gal)', '$10.99/jug', '$8.99/jug', '$9.99/jug'],
                    ['Best For', 'Active lifestyle, hydration', 'Everyday drinking, families', 'Medical, CPAP, appliances'],
                    ['Infant Use', 'Not recommended under 12mo', 'Generally safe', 'Recommended for formula'],
                  ].map(([feat, alk, spring, dist], i) => (
                    <tr key={feat} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f8feff]'}>
                      <td className="px-5 py-3 font-semibold text-[#0c2340] border-b border-[#cce7f0]">{feat}</td>
                      <td className="px-5 py-3 text-[#0097a7] font-medium border-b border-[#cce7f0]">{alk}</td>
                      <td className="px-5 py-3 text-[#4a7fa5] border-b border-[#cce7f0]">{spring}</td>
                      <td className="px-5 py-3 text-[#4a7fa5] border-b border-[#cce7f0]">{dist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm">
              <Link href="/spring-water-delivery-vancouver" className="bg-[#f0f9ff] border border-[#cce7f0] rounded-xl p-4 hover:border-[#0097a7] transition-colors text-[#0097a7] font-semibold">
                Spring Water Delivery Vancouver →
              </Link>
              <div className="bg-[#e0f7fa] border-2 border-[#0097a7] rounded-xl p-4 text-[#0097a7] font-bold">
                You are here: Alkaline Water
              </div>
              <Link href="/distilled-water-delivery-vancouver" className="bg-[#f0f9ff] border border-[#cce7f0] rounded-xl p-4 hover:border-[#0097a7] transition-colors text-[#0097a7] font-semibold">
                Distilled Water Delivery Vancouver →
              </Link>
            </div>
          </div>
        </section>

        {/* City Delivery Grid */}
        <section className="py-20 bg-[#f0f9ff]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] mb-4">
              Alkaline Water Delivery — All Metro Vancouver Cities
            </h2>
            <p className="text-[#4a7fa5] mb-10">Free delivery to 21 cities. Same-day available before 12pm.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/areas/${city.slug}`}
                  className="flex flex-col items-center gap-1 bg-white hover:bg-[#e0f7fa] border border-[#cce7f0] hover:border-[#0097a7]/40 rounded-xl px-3 py-3 text-center transition-all group"
                >
                  <MapPin className="w-4 h-4 text-[#0097a7]" />
                  <span className="text-xs font-semibold text-[#0c2340] group-hover:text-[#0097a7] leading-tight">{city.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-[#0c2340] text-center mb-12">
              Alkaline Water Delivery — Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: 'What is alkaline water?',
                  a: 'Alkaline water is pH balanced water that has been processed to have a higher pH than regular tap or spring water. It contains trace electrolytes — calcium, magnesium, and potassium — and is popular among active and health-conscious individuals for its smooth taste and hydrating qualities.',
                },
                {
                  q: 'How much does alkaline water delivery cost in Vancouver?',
                  a: 'Taj Water alkaline water is $10.99 per 5-gallon jug with free delivery across Metro Vancouver. Subscription plans start at $29.99/week. No minimum order, no setup fees, no contracts.',
                },
                {
                  q: 'What is the difference between alkaline water and spring water?',
                  a: 'Spring water is sourced from a natural underground spring and retains its natural mineral profile. Alkaline water is processed to have a higher, balanced pH and contains trace electrolytes. Alkaline water is often preferred by people with active lifestyles, while spring water is the most popular everyday choice for families.',
                },
                {
                  q: 'Do you deliver alkaline water to Burnaby, Surrey, and Coquitlam?',
                  a: 'Yes. Taj Water delivers alkaline water to all 21 Metro Vancouver cities including Burnaby, Surrey, Richmond, Coquitlam, Port Coquitlam, North Vancouver, West Vancouver, Langley, Delta, Port Moody, White Rock, Maple Ridge, Pitt Meadows, Squamish, Whistler, and more. Delivery is free on every order.',
                },
                {
                  q: 'Is alkaline water safe for babies and children?',
                  a: 'Alkaline water is generally not recommended for infants under 12 months. For children over 1 year, alkaline water is safe. Taj Water recommends distilled or spring water for infants — please consult your pediatrician if unsure.',
                },
              ].map((item) => (
                <div key={item.q} className="bg-[#f0f9ff] rounded-2xl border border-[#cce7f0] p-6">
                  <h3 className="text-[#0c2340] font-bold mb-3">{item.q}</h3>
                  <p className="text-[#4a7fa5] text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-[#0097a7] to-[#006064]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Order Alkaline Water Delivery Today
            </h2>
            <p className="text-[#b3e5fc] text-lg mb-8">
              pH balanced alkaline water delivered to your door anywhere in Metro Vancouver.
              Free delivery. Same-day available. No contract required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="bg-white text-[#0097a7] font-bold px-8 py-4 rounded-xl hover:bg-[#f0f9ff] transition-colors text-lg">
                Order Now — $10.99/Jug
              </Link>
              <Link href="/contact" className="bg-white/20 hover:bg-white/30 text-white font-bold px-8 py-4 rounded-xl transition-colors">
                Contact Us
              </Link>
            </div>
            <p className="text-[#80deea] text-sm mt-6">
              Or call us: <a href="tel:+17785047880" className="font-bold text-white hover:underline">778-504-7880</a>
            </p>
          </div>
        </section>

      </main>
    </>
  )
}
