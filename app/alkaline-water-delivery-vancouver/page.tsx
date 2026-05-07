import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Droplets, Zap, Shield, Star, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Alkaline Water Delivery Vancouver — pH 9.5+ | TajWater $12.99/Jug',
  description: 'Alkaline water delivery in Metro Vancouver. pH 9.5+ ionized water delivered to your door in 5-gallon jugs. Same-day available, free delivery, no contract. From $10.39/jug with subscription.',
  keywords: [
    'alkaline water delivery Vancouver',
    'alkaline water delivery Metro Vancouver',
    'ionized water delivery Vancouver',
    'pH 9.5 water delivery Vancouver',
    'alkaline water delivery Burnaby',
    'alkaline water delivery Surrey',
    'alkaline water delivery Coquitlam',
    '5 gallon alkaline water Vancouver',
    'alkaline water jug delivery BC',
    'high pH water delivery Vancouver',
    'alkaline water subscription Vancouver',
    'best alkaline water Vancouver',
  ],
  alternates: { canonical: 'https://tajwater.ca/alkaline-water-delivery-vancouver' },
  openGraph: {
    title: 'Alkaline Water Delivery Vancouver — pH 9.5+ | TajWater',
    description: 'pH 9.5+ ionized alkaline water delivered to your door in Metro Vancouver. Same-day available, free delivery, no contract.',
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
      description: 'pH 9.5+ ionized alkaline water delivered in BPA-free 5-gallon jugs across Metro Vancouver. Micro-clustered molecules for better hydration, rich in electrolytes.',
      brand: { '@type': 'Brand', name: 'TajWater' },
      image: 'https://tajwater.ca/opengraph-image',
      sku: 'TW-ALK-5GAL',
      mpn: 'TW-ALK-5GAL',
      offers: {
        '@type': 'Offer',
        price: '12.99',
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
          name: 'Taj Water Ltd',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '1770 McLean Ave Unit 7',
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
          name: 'What is the pH level of TajWater alkaline water?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'TajWater alkaline water is ionized to pH 9.5 or above. Each batch is tested and certified before delivery. The elevated pH is achieved through an electrolysis ionization process that also micro-clusters water molecules for better cellular absorption.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does alkaline water delivery cost in Vancouver?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'TajWater alkaline water costs $12.99 per 5-gallon jug at the standard rate, or from $10.39/jug with a weekly subscription. Delivery is always free across Metro Vancouver. No minimum order, no setup fees, no contracts.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between alkaline water and spring water?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Spring water has a neutral pH around 7.0–7.4 and is sourced from a natural underground spring. Alkaline water has a pH of 9.5+ and is produced through ionization. Alkaline water is often chosen by people seeking potential benefits like neutralizing acidity, while spring water is preferred for its natural mineral content and taste.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you deliver alkaline water to Burnaby, Surrey, and Coquitlam?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. TajWater delivers alkaline water to all 21 Metro Vancouver cities including Burnaby, Surrey, Richmond, Coquitlam, Port Coquitlam, North Vancouver, West Vancouver, Langley, Delta, Port Moody, White Rock, Maple Ridge, Pitt Meadows, Squamish, Whistler, and more. Delivery is free on every order.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is TajWater alkaline water safe for babies and children?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Alkaline water at pH 9.5 is generally not recommended for infants under 12 months, as babies need neutral pH water for formula. For children over 1 year, alkaline water is safe. TajWater recommends distilled or spring water for infants and speaking with your pediatrician if unsure.',
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
              <Zap className="w-3.5 h-3.5" /> pH 9.5+ Ionized Alkaline Water
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
              Alkaline Water Delivery<br />
              <span className="text-[#b3e5fc]">Metro Vancouver</span>
            </h1>
            <p className="text-[#b3e5fc] text-lg sm:text-xl max-w-3xl mx-auto mb-10">
              pH 9.5+ ionized alkaline water delivered to your home or office in 5-gallon BPA-free jugs.
              Free delivery across all 21 Metro Vancouver cities. Same-day available before 12pm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/shop" className="btn-primary text-lg px-8 py-4">
                Order Alkaline Water — $12.99/Jug
              </Link>
              <Link href="/contact" className="bg-white/20 hover:bg-white/30 text-white font-bold px-8 py-4 rounded-xl transition-colors">
                Get a Subscription Quote
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-white/90 text-sm">
              {['Free Delivery', 'Same-Day Available', 'No Contract', 'Cancel Anytime', 'pH 9.5+'].map((f) => (
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
                  Alkaline water has a pH level above 7.0 — typically between 8 and 9.5. TajWater's alkaline water is
                  ionized to pH 9.5 through an electrolysis process that separates water into alkaline and acidic components.
                </p>
                <p className="text-[#4a7fa5] leading-relaxed mb-4">
                  The ionization process also micro-clusters water molecules, which many people report leads to faster
                  absorption and a smoother, silkier taste compared to regular water.
                </p>
                <p className="text-[#4a7fa5] leading-relaxed">
                  Alkaline water contains trace electrolytes — calcium, magnesium, potassium — that contribute to its
                  elevated pH and are naturally present in ionized water.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-[#cce7f0] overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-[#0097a7] to-[#006064] px-6 py-4">
                  <h3 className="text-white font-bold text-lg">Alkaline Water Specifications</h3>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ['pH Level', '9.5 or above'],
                      ['Process', 'Electrolysis ionization'],
                      ['Electrolytes', 'Ca, Mg, K (trace)'],
                      ['Jug Size', '5 gallon (18.9L)'],
                      ['Jug Material', 'BPA-free polycarbonate'],
                      ['Batch Testing', 'pH tested every batch'],
                      ['Best For', 'Active lifestyle, hydration'],
                      ['Price', '$12.99/jug | From $10.39 (sub)'],
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
              Alkaline water is the most popular choice among TajWater's active, health-conscious customers.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Zap className="w-7 h-7 text-[#0097a7]" />,
                  title: 'Smoother Taste',
                  desc: 'Most people notice a silkier, less "flat" taste compared to neutral-pH water. The micro-clustering reduces harshness.',
                },
                {
                  icon: <Droplets className="w-7 h-7 text-[#0097a7]" />,
                  title: 'Faster Absorption',
                  desc: 'Ionized micro-clustered molecules are reported to absorb at the cellular level faster than standard water molecules.',
                },
                {
                  icon: <Shield className="w-7 h-7 text-[#0097a7]" />,
                  title: 'Electrolyte Content',
                  desc: 'Contains trace calcium, magnesium, and potassium — naturally occurring electrolytes that support overall hydration.',
                },
                {
                  icon: <CheckCircle className="w-7 h-7 text-[#0097a7]" />,
                  title: 'Neutralizes Acidity',
                  desc: 'Many customers with acid reflux or high-acidity diets report relief from drinking alkaline water regularly.',
                },
                {
                  icon: <Star className="w-7 h-7 text-[#0097a7]" />,
                  title: 'Popular with Athletes',
                  desc: 'Sports-active households in Coquitlam, North Vancouver, and Burnaby choose alkaline water for post-workout hydration.',
                },
                {
                  icon: <MapPin className="w-7 h-7 text-[#0097a7]" />,
                  title: 'Locally Delivered',
                  desc: 'Sourced, ionized, and delivered locally from our Port Coquitlam facility — not shipped from distant warehouses.',
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
                  price: '$12.99',
                  unit: 'per jug',
                  features: ['No commitment', 'Order anytime', 'Free delivery', 'Jug swap included'],
                  cta: 'Order Now',
                  highlight: false,
                },
                {
                  plan: 'Bi-Weekly Subscription',
                  price: '$11.49',
                  unit: 'per jug',
                  features: ['Every 2 weeks', 'Cancel anytime', 'Free delivery', 'Priority scheduling'],
                  cta: 'Subscribe & Save',
                  highlight: true,
                },
                {
                  plan: 'Weekly Subscription',
                  price: '$10.39',
                  unit: 'per jug',
                  features: ['Every week', 'Best value', 'Free delivery', 'Dedicated route'],
                  cta: 'Best Value',
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
                  <div className="text-[#4a7fa5] text-sm mb-5">{tier.unit} · 5-gallon jug</div>
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
                    ['pH Level', '9.5+', '7.0–7.4', '7.0 (neutral)'],
                    ['Source', 'Ionized municipal/filtered', 'Natural underground spring', 'Purified by distillation'],
                    ['Minerals', 'Trace electrolytes (Ca, Mg, K)', 'Natural minerals intact', 'None (pure H₂O)'],
                    ['Taste', 'Silky, smooth', 'Crisp, natural', 'Very flat, pure'],
                    ['Price (5 gal)', '$12.99/jug', '$8.99/jug', '$9.99/jug'],
                    ['Best For', 'Active lifestyle, acid reduction', 'Everyday drinking, families', 'Medical, CPAP, appliances'],
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
                  q: 'What is the pH level of TajWater alkaline water?',
                  a: 'TajWater alkaline water is ionized to pH 9.5 or above. Each batch is tested and certified before delivery. The elevated pH is achieved through an electrolysis ionization process that also micro-clusters water molecules for better cellular absorption.',
                },
                {
                  q: 'How much does alkaline water delivery cost in Vancouver?',
                  a: 'TajWater alkaline water costs $12.99 per 5-gallon jug at the standard rate, or from $10.39/jug with a weekly subscription. Delivery is always free across Metro Vancouver. No minimum order, no setup fees, no contracts.',
                },
                {
                  q: 'What is the difference between alkaline water and spring water?',
                  a: 'Spring water has a neutral pH around 7.0–7.4 and is sourced from a natural underground spring. Alkaline water has a pH of 9.5+ and is produced through ionization. Alkaline water is often chosen by people seeking potential benefits like neutralizing acidity, while spring water is preferred for its natural mineral content and taste.',
                },
                {
                  q: 'Do you deliver alkaline water to Burnaby, Surrey, and Coquitlam?',
                  a: 'Yes. TajWater delivers alkaline water to all 21 Metro Vancouver cities including Burnaby, Surrey, Richmond, Coquitlam, Port Coquitlam, North Vancouver, West Vancouver, Langley, Delta, Port Moody, White Rock, Maple Ridge, Pitt Meadows, Squamish, Whistler, and more. Delivery is free on every order.',
                },
                {
                  q: 'Is alkaline water safe for babies and children?',
                  a: 'Alkaline water at pH 9.5 is generally not recommended for infants under 12 months, as babies need neutral pH water for formula. For children over 1 year, alkaline water is safe. TajWater recommends distilled or spring water for infants — please consult your pediatrician if unsure.',
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
              pH 9.5+ ionized alkaline water delivered to your door anywhere in Metro Vancouver.
              Free delivery. Same-day available. No contract required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="bg-white text-[#0097a7] font-bold px-8 py-4 rounded-xl hover:bg-[#f0f9ff] transition-colors text-lg">
                Order Now — $12.99/Jug
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
