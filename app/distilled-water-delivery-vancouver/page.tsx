import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Droplets, Shield, Star, MapPin, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Distilled Water Delivery Vancouver — CPAP & Medical Use | TajWater $9.99/Jug',
  description: 'Distilled water delivery in Metro Vancouver. 100% pure distilled water for CPAP machines, medical use, babies, and appliances. 5-gallon jugs, free delivery, same-day available. From $7.99/jug on subscription.',
  keywords: [
    'distilled water delivery Vancouver',
    'distilled water delivery Metro Vancouver',
    'CPAP water delivery Vancouver',
    'distilled water Vancouver',
    'pure distilled water delivery BC',
    'distilled water for CPAP Metro Vancouver',
    'distilled water delivery Burnaby',
    'distilled water delivery Surrey',
    'distilled water delivery Coquitlam',
    '5 gallon distilled water Vancouver',
    'distilled water for babies Vancouver',
    'distilled water for humidifier Vancouver',
    'distilled water subscription Vancouver',
  ],
  alternates: { canonical: 'https://tajwater.ca/distilled-water-delivery-vancouver' },
  openGraph: {
    title: 'Distilled Water Delivery Vancouver — CPAP & Medical | TajWater',
    description: '100% pure distilled water delivered to your door in Metro Vancouver. Perfect for CPAP machines, babies, and appliances. Free delivery, no contract.',
    url: 'https://tajwater.ca/distilled-water-delivery-vancouver',
    type: 'website',
    images: [{ url: 'https://tajwater.ca/opengraph-image', width: 1200, height: 630 }],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Product',
      name: 'Distilled Water — 5-Gallon Jug Delivery',
      description: '100% pure distilled water delivered in BPA-free 5-gallon jugs across Metro Vancouver. Free of all minerals, chlorine, and contaminants. Ideal for CPAP machines, humidifiers, baby formula, medical equipment, and appliances.',
      brand: { '@type': 'Brand', name: 'Taj Water' },
      image: 'https://tajwater.ca/opengraph-image',
      sku: 'TW-DIST-5GAL',
      mpn: 'TW-DIST-5GAL',
      offers: {
        '@type': 'Offer',
        price: '9.99',
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
        ratingValue: '4.8',
        reviewCount: '76',
        bestRating: '5',
        worstRating: '1',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is TajWater distilled water safe for CPAP machines?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Taj Water distilled water is 100% mineral-free and meets the purity requirements for CPAP and BiPAP humidifier chambers. Using distilled water prevents mineral buildup (white scale) in your humidifier, extends machine life, and reduces the risk of bacterial growth. It is the recommended water type for all major CPAP brands.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does distilled water delivery cost in Vancouver?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Taj Water distilled water costs $9.99 per 5-gallon jug on a one-time basis. Subscription plans start at $29.99/week or $59.99/month. Delivery is always free across Metro Vancouver. There is no minimum order, no setup fee, and no contract required.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use distilled water for baby formula?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, distilled water is recommended by many pediatricians for mixing infant formula because it contains no fluoride, chlorine, or other minerals that could interfere with formula nutrition ratios. Health Canada recommends using distilled or purified water for formula if your local tap water quality is uncertain. Taj Water distilled water is ideal for this purpose.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is distilled water good for besides CPAP machines?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Distilled water is ideal for: CPAP and BiPAP humidifiers, baby formula, steam irons (prevents mineral staining), humidifiers (prevents white dust), aquariums (allows precise mineral control), car batteries and cooling systems, medical equipment sterilization, laboratory use, and any application requiring pure H₂O without dissolved solids.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you deliver distilled water to North Vancouver, Burnaby, and Surrey?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Taj Water delivers distilled water to all 21 Metro Vancouver cities including North Vancouver, Burnaby, Surrey, Richmond, Vancouver, Coquitlam, Port Coquitlam, West Vancouver, Langley, Delta, Port Moody, White Rock, Maple Ridge, Pitt Meadows, Squamish, Whistler, and more. Delivery is always free.',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tajwater.ca' },
        { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://tajwater.ca/shop' },
        { '@type': 'ListItem', position: 3, name: 'Distilled Water Delivery Vancouver', item: 'https://tajwater.ca/distilled-water-delivery-vancouver' },
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

export default function DistilledWaterDeliveryVancouver() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen">

        {/* Hero */}
        <section className="hero-gradient py-20 sm:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Shield className="w-3.5 h-3.5" /> 100% Pure Distilled Water — Zero Minerals
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
              Distilled Water Delivery<br />
              <span className="text-[#b3e5fc]">Metro Vancouver</span>
            </h1>
            <p className="text-[#b3e5fc] text-lg sm:text-xl max-w-3xl mx-auto mb-10">
              100% pure distilled water in 5-gallon BPA-free jugs. Ideal for CPAP machines, baby formula,
              humidifiers, and sensitive applications. Free delivery, same-day available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/shop" className="btn-primary text-lg px-8 py-4">
                Order Distilled Water — $9.99/Jug
              </Link>
              <Link href="/contact" className="bg-white/20 hover:bg-white/30 text-white font-bold px-8 py-4 rounded-xl transition-colors">
                Get a Subscription Quote
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-white/90 text-sm">
              {['Free Delivery', 'Same-Day Available', 'No Contract', 'CPAP-Safe', '100% Pure H₂O'].map((f) => (
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
            <span className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-300 fill-yellow-300" /> 4.8/5 — 76 Reviews</span>
            <span>Free Delivery on Every Order</span>
            <span>21 Metro Vancouver Cities</span>
            <span>No Minimum Order</span>
          </div>
        </div>

        {/* What is Distilled Water */}
        <section className="py-20 bg-[#f0f9ff]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-6">
                  What is Distilled Water?
                </h2>
                <p className="text-[#4a7fa5] leading-relaxed mb-4">
                  Distilled water is produced by boiling water and collecting the steam, which condenses back into pure
                  liquid water. This process removes virtually all minerals, chemicals, bacteria, and dissolved solids,
                  leaving behind only H₂O molecules.
                </p>
                <p className="text-[#4a7fa5] leading-relaxed mb-4">
                  The result is water with a total dissolved solids (TDS) level near zero — making it the purest water
                  available and the preferred choice for medical devices, sensitive applications, and anywhere
                  mineral-free water is required.
                </p>
                <p className="text-[#4a7fa5] leading-relaxed">
                  TajWater's distilled water is produced locally in Port Coquitlam and delivered in sealed BPA-free
                  5-gallon jugs to maintain purity from production to your door.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-[#cce7f0] overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-[#0097a7] to-[#006064] px-6 py-4">
                  <h3 className="text-white font-bold text-lg">Distilled Water Specifications</h3>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ['Water Type', '100% Pure Distilled'],
                      ['Process', 'Distillation (boil + condense)'],
                      ['Minerals', 'None — pure H₂O'],
                      ['Jug Size', '5 gallon (18.9L)'],
                      ['Jug Material', 'BPA-free polycarbonate'],
                      ['Best For', 'CPAP, formula, appliances'],
                      ['Price', '$9.99/jug one-time'],
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

        {/* Use Cases */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] text-center mb-4">
              What Is Distilled Water Used For?
            </h2>
            <p className="text-[#4a7fa5] text-center max-w-2xl mx-auto mb-12 text-lg">
              Distilled water is the right choice whenever purity matters. Here are the most common uses in Metro Vancouver households.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Heart className="w-7 h-7 text-[#0097a7]" />,
                  title: 'CPAP & BiPAP Machines',
                  desc: 'The #1 reason Metro Vancouver residents order distilled water. Required by all major CPAP brands for humidifier chambers. Prevents mineral scale buildup and bacterial growth.',
                },
                {
                  icon: <Shield className="w-7 h-7 text-[#0097a7]" />,
                  title: 'Baby Formula & Infant Use',
                  desc: 'Recommended by Health Canada for mixing infant formula. Zero fluoride, chlorine, or minerals that could interfere with formula\'s precise nutritional ratios. Safe from birth.',
                },
                {
                  icon: <Droplets className="w-7 h-7 text-[#0097a7]" />,
                  title: 'Humidifiers & Steam Irons',
                  desc: 'Prevents the white mineral dust and calcium deposits that clog humidifiers and cause white staining on clothes from steam irons. Extends appliance life significantly.',
                },
                {
                  icon: <CheckCircle className="w-7 h-7 text-[#0097a7]" />,
                  title: 'Medical Equipment',
                  desc: 'Used for sterilization, dental equipment, nebulizers, and other medical devices that require mineral-free water. Safe for all medical-grade applications.',
                },
                {
                  icon: <Star className="w-7 h-7 text-[#0097a7]" />,
                  title: 'Aquariums & Fish Tanks',
                  desc: 'Gives aquarium owners complete control over water chemistry. Start with pure water, then add exactly the minerals and pH adjusters your fish species require.',
                },
                {
                  icon: <MapPin className="w-7 h-7 text-[#0097a7]" />,
                  title: 'Car Batteries & Radiators',
                  desc: 'Required for topping up car batteries and some cooling systems. Mineral content in tap or spring water can accelerate corrosion and reduce battery life.',
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

        {/* CPAP spotlight */}
        <section className="py-20 bg-[#f0f9ff]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border-2 border-[#0097a7] p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] mb-4 text-center">
                CPAP Water Delivery in Metro Vancouver
              </h2>
              <p className="text-[#4a7fa5] text-center mb-8 max-w-2xl mx-auto">
                If you use a CPAP or BiPAP machine, distilled water is not optional — it is required.
                TajWater makes it effortless with scheduled delivery so you never run out.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-bold text-[#0c2340] mb-3">Why CPAP machines need distilled water</h3>
                  <ul className="space-y-2 text-sm text-[#4a7fa5]">
                    {[
                      'Prevents mineral scale in humidifier chamber',
                      'Reduces bacterial and mold growth risk',
                      'Maintains consistent humidity output',
                      'Required by all major CPAP brands',
                      'Extends machine lifespan by years',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#0097a7] shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-[#0c2340] mb-3">TajWater CPAP subscription</h3>
                  <ul className="space-y-2 text-sm text-[#4a7fa5]">
                    {[
                      'Weekly or monthly delivery schedule',
                      'Never run out — automatic delivery',
                      'From $29.99/week subscription',
                      'Same-day available if you run out',
                      'Cancel or pause anytime',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#0097a7] shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="text-center">
                <Link href="/shop" className="btn-primary px-8 py-4 text-lg">
                  Set Up CPAP Water Subscription
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-4">
              Distilled Water Delivery Pricing — Metro Vancouver
            </h2>
            <p className="text-[#4a7fa5] text-lg mb-12 max-w-2xl mx-auto">
              Transparent pricing. No hidden fees. Free delivery on every order.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                {
                  plan: 'One-Time Order',
                  price: '$9.99',
                  unit: 'per jug',
                  features: ['No commitment', 'Order anytime', 'Free delivery', 'Jug swap included'],
                  cta: 'Order Now',
                  highlight: false,
                },
                {
                  plan: 'Weekly Subscription',
                  price: '$29.99',
                  unit: 'per week',
                  features: ['Weekly delivery', 'Cancel anytime', 'Free delivery', 'Auto-replenishment'],
                  cta: 'Best for CPAP',
                  highlight: true,
                },
                {
                  plan: 'Monthly Subscription',
                  price: '$59.99',
                  unit: 'per month',
                  features: ['Monthly delivery', 'Cancel anytime', 'Free delivery', 'Priority scheduling'],
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

        {/* Water type comparison */}
        <section className="py-20 bg-[#f0f9ff]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] text-center mb-4">
              Distilled vs Spring vs Alkaline Water
            </h2>
            <p className="text-[#4a7fa5] text-center mb-12 max-w-2xl mx-auto">
              Choose the right water type for your needs.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-[#cce7f0] bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#e0f7fa]">
                    <th className="text-left px-5 py-4 font-bold text-[#0c2340]">Feature</th>
                    <th className="text-left px-5 py-4 font-bold text-[#0097a7]">Distilled</th>
                    <th className="text-left px-5 py-4 font-bold text-[#0c2340]">Spring</th>
                    <th className="text-left px-5 py-4 font-bold text-[#0c2340]">Alkaline</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Water Type', 'Pure Distilled', 'Natural Spring', 'pH Balanced Alkaline'],
                    ['Minerals', 'None — pure H₂O', 'Natural minerals', 'Trace electrolytes'],
                    ['Taste', 'Very flat, pure', 'Crisp, natural', 'Silky, smooth'],
                    ['Price (5 gal)', '$9.99/jug', '$8.99/jug', '$10.99/jug'],
                    ['Best For', 'CPAP, medical, appliances', 'Everyday drinking', 'Active lifestyle'],
                    ['Infant Safe', 'Yes — recommended', 'Generally safe', 'Not under 12 months'],
                    ['Appliance Safe', 'Yes — ideal', 'No (mineral scale)', 'No (mineral scale)'],
                  ].map(([feat, dist, spring, alk], i) => (
                    <tr key={feat} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f8feff]'}>
                      <td className="px-5 py-3 font-semibold text-[#0c2340] border-b border-[#cce7f0]">{feat}</td>
                      <td className="px-5 py-3 text-[#0097a7] font-medium border-b border-[#cce7f0]">{dist}</td>
                      <td className="px-5 py-3 text-[#4a7fa5] border-b border-[#cce7f0]">{spring}</td>
                      <td className="px-5 py-3 text-[#4a7fa5] border-b border-[#cce7f0]">{alk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm">
              <Link href="/spring-water-delivery-vancouver" className="bg-white border border-[#cce7f0] rounded-xl p-4 hover:border-[#0097a7] transition-colors text-[#0097a7] font-semibold">
                Spring Water Delivery Vancouver →
              </Link>
              <Link href="/alkaline-water-delivery-vancouver" className="bg-white border border-[#cce7f0] rounded-xl p-4 hover:border-[#0097a7] transition-colors text-[#0097a7] font-semibold">
                Alkaline Water Delivery Vancouver →
              </Link>
              <div className="bg-[#e0f7fa] border-2 border-[#0097a7] rounded-xl p-4 text-[#0097a7] font-bold">
                You are here: Distilled Water
              </div>
            </div>
          </div>
        </section>

        {/* City Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] mb-4">
              Distilled Water Delivery — All Metro Vancouver Cities
            </h2>
            <p className="text-[#4a7fa5] mb-10">Free delivery to 21 cities. Same-day available before 12pm.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/areas/${city.slug}`}
                  className="flex flex-col items-center gap-1 bg-[#f0f9ff] hover:bg-[#e0f7fa] border border-[#cce7f0] hover:border-[#0097a7]/40 rounded-xl px-3 py-3 text-center transition-all group"
                >
                  <MapPin className="w-4 h-4 text-[#0097a7]" />
                  <span className="text-xs font-semibold text-[#0c2340] group-hover:text-[#0097a7] leading-tight">{city.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-[#f0f9ff]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-[#0c2340] text-center mb-12">
              Distilled Water Delivery — FAQ
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Is Taj Water distilled water safe for CPAP machines?',
                  a: 'Yes. Taj Water distilled water is 100% mineral-free and meets the purity requirements for CPAP and BiPAP humidifier chambers. Using distilled water prevents mineral buildup (white scale) in your humidifier, extends machine life, and reduces the risk of bacterial growth. It is the recommended water type for all major CPAP brands.',
                },
                {
                  q: 'How much does distilled water delivery cost in Vancouver?',
                  a: 'Taj Water distilled water costs $9.99 per 5-gallon jug on a one-time basis. Subscription plans start at $29.99/week or $59.99/month. Delivery is always free across Metro Vancouver. There is no minimum order, no setup fee, and no contract required.',
                },
                {
                  q: 'Can I use distilled water for baby formula?',
                  a: 'Yes, distilled water is recommended by many pediatricians for mixing infant formula because it contains no fluoride, chlorine, or other minerals that could interfere with formula nutrition ratios. Taj Water distilled water is ideal for this purpose.',
                },
                {
                  q: 'What is distilled water good for besides CPAP machines?',
                  a: 'Distilled water is ideal for: CPAP and BiPAP humidifiers, baby formula, steam irons (prevents mineral staining), humidifiers (prevents white dust), aquariums (allows precise mineral control), car batteries and cooling systems, medical equipment sterilization, and any application requiring pure H₂O without dissolved solids.',
                },
                {
                  q: 'Do you deliver distilled water to North Vancouver, Burnaby, and Surrey?',
                  a: 'Yes. Taj Water delivers distilled water to all 21 Metro Vancouver cities including North Vancouver, Burnaby, Surrey, Richmond, Vancouver, Coquitlam, Port Coquitlam, West Vancouver, Langley, Delta, Port Moody, White Rock, Maple Ridge, Pitt Meadows, Squamish, Whistler, and more. Delivery is always free.',
                },
              ].map((item) => (
                <div key={item.q} className="bg-white rounded-2xl border border-[#cce7f0] p-6">
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
              Order Distilled Water Delivery Today
            </h2>
            <p className="text-[#b3e5fc] text-lg mb-8">
              100% pure distilled water for CPAP machines, baby formula, and appliances —
              delivered free to your door anywhere in Metro Vancouver.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="bg-white text-[#0097a7] font-bold px-8 py-4 rounded-xl hover:bg-[#f0f9ff] transition-colors text-lg">
                Order Now — $9.99/Jug
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
