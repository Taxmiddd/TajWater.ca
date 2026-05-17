import { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Spring Water Delivery Vancouver — 5-Gallon Jugs from $8.99 | TajWater',
  description: 'Natural spring water delivered in 5-gallon BPA-free jugs across Metro Vancouver. $8.99/jug, free delivery, same-day available. No contracts. From TajWater, Port Coquitlam.',
  keywords: [
    'spring water delivery Vancouver',
    'natural spring water delivery Metro Vancouver',
    '5 gallon spring water Vancouver',
    'spring water jug delivery BC',
    'spring water delivery Burnaby',
    'spring water delivery Surrey',
    'spring water delivery Coquitlam',
    'best spring water delivery Vancouver',
  ],
  alternates: { canonical: 'https://tajwater.ca/spring-water-delivery-vancouver' },
  openGraph: {
    title: 'Spring Water Delivery Vancouver — $8.99/Jug Free Delivery | TajWater',
    description: 'Natural spring water in 5-gallon BPA-free jugs. Free delivery across all 21 Metro Vancouver zones. Same-day available before 12pm.',
    url: 'https://tajwater.ca/spring-water-delivery-vancouver',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: '5-Gallon Natural Spring Water Jug Delivery',
  description: 'Fresh natural spring water sourced from BC mountain aquifers, delivered in 5-gallon (20L) BPA-free polycarbonate jugs to homes and offices across Metro Vancouver. Naturally occurring calcium, magnesium, and potassium.',
  brand: { '@type': 'Brand', name: 'Taj Water' },
  category: 'Water Delivery',
  offers: {
    '@type': 'Offer',
    price: '8.99',
    priceCurrency: 'CAD',
    availability: 'https://schema.org/InStock',
    priceValidUntil: '2027-01-01',
    seller: {
      '@type': 'LocalBusiness',
      name: 'TajWater',
      url: 'https://tajwater.ca',
      telephone: '+17785047880',
    },
    areaServed: 'Metro Vancouver, BC, Canada',
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'CAD' },
      deliveryTime: { '@type': 'ShippingDeliveryTime', businessDays: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] } },
    },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '124',
    bestRating: '5',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Where does Taj Water spring water come from?', acceptedAnswer: { '@type': 'Answer', text: 'Taj Water spring water is sourced from protected natural underground aquifers in British Columbia. The water is independently tested for over 200 contaminants and meets or exceeds Health Canada drinking water standards. It contains naturally occurring calcium, magnesium, and potassium at levels beneficial for daily hydration.' } },
    { '@type': 'Question', name: 'Is Taj Water spring water pH balanced?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Taj Water spring water is naturally pH balanced, which is ideal for daily drinking. It retains its natural mineral profile, making it the most popular choice for families and offices across Metro Vancouver.' } },
    { '@type': 'Question', name: 'How much does spring water delivery cost in Vancouver?', acceptedAnswer: { '@type': 'Answer', text: 'Taj Water spring water is $8.99 per 5-gallon (20L) jug with free delivery across all Metro Vancouver zones. Subscription plans start at $29.99/week or $59.99/month. There are no zone surcharges, no minimum orders, and no contracts.' } },
    { '@type': 'Question', name: 'Are Taj Water spring water jugs BPA-free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. All Taj Water 5-gallon jugs are made from BPA-free, food-grade polycarbonate. They are sanitized and inspected before every refill to ensure safety and freshness.' } },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tajwater.ca' },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://tajwater.ca/shop' },
    { '@type': 'ListItem', position: 3, name: 'Spring Water Delivery Vancouver', item: 'https://tajwater.ca/spring-water-delivery-vancouver' },
  ],
}

const cities = ['Vancouver', 'Burnaby', 'Richmond', 'Surrey', 'Coquitlam', 'Port Coquitlam', 'North Vancouver', 'West Vancouver', 'Langley', 'Delta', 'Port Moody', 'White Rock', 'Maple Ridge', 'Squamish']

export default function SpringWaterPage() {
  return (
    <>
      <Script id="product-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="py-24 hero-gradient">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold mb-4">Spring Water Delivery</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
              Natural Spring Water Delivery<br />Across Metro Vancouver
            </h1>
            <p className="text-[#b3e5fc] text-xl max-w-2xl mx-auto mb-8">
              Fresh BC mountain spring water in 5-gallon BPA-free jugs. $8.99 per jug — free delivery — same-day available before 12pm.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/shop" className="px-8 py-4 bg-white text-[#0097a7] font-bold rounded-2xl hover:shadow-xl transition-all">
                Order Spring Water →
              </Link>
              <Link href="/contact" className="px-8 py-4 border-2 border-white/40 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all">
                Get a Quote
              </Link>
            </div>
          </div>
        </section>

        {/* Price & specs */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-[#0c2340] mb-6">About Our Spring Water</h2>
                <dl className="space-y-4">
                  {[
                    { label: 'Source', value: 'Natural underground aquifer, British Columbia' },
                    { label: 'Water Type', value: 'pH Balanced Natural Spring' },
                    { label: 'Minerals', value: 'Calcium, magnesium, potassium — naturally occurring' },
                    { label: 'Testing', value: '200+ contaminant tests per batch' },
                    { label: 'Jug size', value: '5 gallon (20 litres), BPA-free polycarbonate' },
                    { label: 'Best for', value: 'Daily drinking, cooking, families, offices' },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-4 border-b border-[#f0f9ff] pb-3">
                      <dt className="w-28 shrink-0 text-sm font-semibold text-[#0097a7]">{item.label}</dt>
                      <dd className="text-sm text-[#4a7fa5]">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="bg-[#f0f9ff] rounded-3xl border border-[#cce7f0] p-8">
                <h3 className="text-xl font-extrabold text-[#0c2340] mb-6">Spring Water Pricing</h3>
                <div className="space-y-3">
                  {[
                    { tier: 'One-Time Order', price: '$8.99/jug', note: 'Free delivery' },
                    { tier: 'Weekly Subscription', price: '$29.99/week', note: 'Cancel anytime' },
                    { tier: 'Monthly Subscription', price: '$59.99/month', note: 'Cancel anytime' },
                  ].map((row) => (
                    <div key={row.tier} className="flex justify-between items-center py-2 border-b border-[#cce7f0]">
                      <span className="text-sm font-medium text-[#0c2340]">{row.tier}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#0097a7]">{row.price}</span>
                        <span className="block text-xs text-[#4a7fa5]">{row.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#4a7fa5] mt-4">All prices in CAD. Delivery always free. No setup fee.</p>
                <Link href="/shop" className="block mt-6 text-center bg-[#0097a7] text-white font-bold py-3 rounded-xl hover:bg-[#007a87] transition-colors">
                  Order Spring Water Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why spring */}
        <section className="py-20 bg-[#f0f9ff]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-[#0c2340] text-center mb-4">Why Choose Spring Water for Your Home or Office?</h2>
            <p className="text-[#4a7fa5] text-center max-w-2xl mx-auto mb-12">
              Spring water is the most popular water type we deliver across Metro Vancouver — and for good reason.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { title: 'Natural mineral content', body: 'Spring water retains naturally occurring calcium, magnesium, and potassium — minerals that contribute to daily nutritional intake and give water its pleasant, clean taste.' },
                { title: 'Naturally pH Balanced', body: 'Natural spring water is naturally pH balanced — retaining its mineral profile as nature intended. It\'s the most natural state of drinking water for everyday use.' },
                { title: 'Great taste', body: 'Because spring water retains its mineral profile, it has a noticeably cleaner, fresher taste than tap water (which often carries a chlorine aftertaste) or distilled water (which can taste flat).' },
                { title: 'Safe for all ages', body: 'The mineral content and neutral pH make spring water suitable for adults, children, and infants (for formula preparation). It\'s the safest all-purpose drinking water for families.' },
                { title: 'Independently tested', body: 'Every batch of Taj Water spring water is tested for over 200 contaminants including heavy metals, bacteria, chlorine, and chloramines. Certificates available on request.' },
                { title: 'Most affordable delivered water', body: 'At $8.99 per 5-gallon jug, spring water is the most cost-effective option we offer. That works out to roughly $0.45 per litre — far less than single-use bottled water.' },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl border border-[#cce7f0] p-6">
                  <h3 className="font-bold text-[#0c2340] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#4a7fa5] leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compare water types */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-[#0c2340] text-center mb-4">Spring vs Alkaline vs Distilled — At a Glance</h2>
            <p className="text-[#4a7fa5] text-center mb-10">All three are available for delivery across Metro Vancouver. Not sure which is right for you? <Link href="/blog/spring-vs-alkaline-vs-distilled-water-vancouver" className="text-[#0097a7] font-semibold hover:underline">Read our full guide →</Link></p>
            <div className="overflow-x-auto rounded-2xl border border-[#cce7f0]">
              <table className="w-full text-sm bg-white">
                <thead>
                  <tr className="bg-[#e0f7fa]">
                    <th className="text-left px-5 py-3 font-bold text-[#0c2340]">Type</th>
                    <th className="text-left px-5 py-3 font-bold text-[#0097a7]">Spring</th>
                    <th className="text-left px-5 py-3 font-bold text-[#4a7fa5]">Alkaline</th>
                    <th className="text-left px-5 py-3 font-bold text-[#4a7fa5]">Distilled</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Price/jug', '$8.99', '$10.99', '$9.99'],
                    ['Water Type', 'Natural Spring', 'pH Balanced Alkaline', 'Pure Distilled'],
                    ['Minerals', 'Natural', 'Trace electrolytes', 'None'],
                    ['Best for', 'Daily drinking, all ages', 'Active lifestyles', 'Medical equipment, CPAP'],
                    ['Taste', 'Clean, fresh', 'Smooth, slightly sweet', 'Flat, pure'],
                  ].map(([label, s, a, d], i) => (
                    <tr key={label} className={i < 4 ? 'border-b border-[#cce7f0]' : ''}>
                      <td className="px-5 py-3 font-medium text-[#0c2340]">{label}</td>
                      <td className="px-5 py-3 font-semibold text-[#0097a7]">{s}</td>
                      <td className="px-5 py-3 text-[#4a7fa5]">{a}</td>
                      <td className="px-5 py-3 text-[#4a7fa5]">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Cities */}
        <section className="py-20 bg-[#f0f9ff]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-[#0c2340] text-center mb-4">Spring Water Delivery Across Metro Vancouver</h2>
            <p className="text-[#4a7fa5] text-center mb-10">Free delivery to all zones — same price everywhere, no surcharges.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {cities.map((city) => (
                <Link key={city} href={`/areas/${city.toLowerCase().replace(' ', '-')}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#cce7f0] hover:border-[#0097a7]/40 hover:bg-[#e0f7fa] text-sm font-medium text-[#0c2340] hover:text-[#0097a7] transition-all">
                  💧 {city}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-[#0c2340] text-center mb-10">Spring Water Delivery — FAQ</h2>
            <div className="space-y-5">
              {faqSchema.mainEntity.map((item) => (
                <div key={item.name} className="border-b border-[#cce7f0] pb-5">
                  <h3 className="font-bold text-[#0c2340] mb-2">{item.name}</h3>
                  <p className="text-[#4a7fa5] text-sm leading-relaxed">{item.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-[#0097a7] to-[#006064]">
          <div className="max-w-3xl mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-extrabold mb-3">Order Spring Water Delivery Today</h2>
            <p className="text-[#b3e5fc] mb-6">$8.99/jug · Free delivery · Same-day before 12pm · No contracts</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/shop" className="px-8 py-3 bg-white text-[#0097a7] font-bold rounded-xl hover:shadow-lg transition-shadow">Order Now</Link>
              <Link href="/alkaline-water-delivery-vancouver" className="px-8 py-3 bg-white/20 text-white font-semibold rounded-xl border-2 border-white/40 hover:bg-white/30 transition-colors">Compare Alkaline Water</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
