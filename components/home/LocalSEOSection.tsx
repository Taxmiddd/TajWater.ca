import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const serviceAreas = [
  { city: 'Vancouver', slug: 'vancouver', schedule: 'Daily' },
  { city: 'Burnaby', slug: 'burnaby', schedule: 'Mon–Sat' },
  { city: 'Richmond', slug: 'richmond', schedule: 'Mon–Sat' },
  { city: 'Surrey', slug: 'surrey', schedule: 'Mon–Sat' },
  { city: 'Coquitlam', slug: 'coquitlam', schedule: 'Tue, Thu, Sat' },
  { city: 'Port Coquitlam', slug: 'port-coquitlam', schedule: 'Tue, Thu, Sat' },
  { city: 'North Vancouver', slug: 'north-vancouver', schedule: 'Mon, Wed, Fri' },
  { city: 'West Vancouver', slug: 'west-vancouver', schedule: 'Tue, Thu, Sat' },
  { city: 'Langley', slug: 'langley', schedule: 'Tue, Thu, Sat' },
  { city: 'Delta', slug: 'delta', schedule: 'Mon, Wed, Fri' },
  { city: 'Port Moody', slug: 'port-moody', schedule: 'Tue, Thu' },
  { city: 'White Rock', slug: 'white-rock', schedule: 'Mon, Wed, Fri' },
  { city: 'Maple Ridge', slug: 'maple-ridge', schedule: 'Wed, Fri' },
  { city: 'Pitt Meadows', slug: 'pitt-meadows', schedule: 'Wed, Fri' },
  { city: 'Squamish', slug: 'squamish', schedule: 'Thursdays' },
  { city: 'Whistler', slug: 'whistler', schedule: 'Thursdays' },
  { city: 'Langley Township', slug: 'langley-township', schedule: 'Tue, Thu, Sat' },
  { city: 'Cloverdale', slug: 'cloverdale', schedule: 'Mon, Wed, Fri' },
  { city: 'Tsawwassen', slug: 'tsawwassen', schedule: 'Mon, Wed, Fri' },
  { city: 'Walnut Grove', slug: 'walnut-grove', schedule: 'Tue, Thu, Sat' },
  { city: 'Mary Hill', slug: 'mary-hill', schedule: 'Tue, Thu, Sat' },
]

export default function LocalSEOSection() {
  return (
    <section className="py-24 bg-white border-t border-[#cce7f0]" aria-labelledby="local-seo-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Service Area Grid */}
        <div className="mb-20">
          <h2 id="local-seo-heading" className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] text-center mb-4">
            5-Gallon Water Delivery Across All of Metro Vancouver
          </h2>
          <p className="text-[#4a7fa5] text-center max-w-3xl mx-auto mb-10 text-lg">
            TajWater delivers spring, alkaline, and distilled water to 21 zones across Metro Vancouver and the Sea-to-Sky corridor.
            Free delivery, same-day available before 12pm, no minimum order.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {serviceAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/areas/${area.slug}`}
                className="group flex flex-col items-center gap-1 bg-[#f0f9ff] hover:bg-[#e0f7fa] border border-[#cce7f0] hover:border-[#0097a7]/40 rounded-xl px-3 py-3 text-center transition-all"
              >
                <MapPin className="w-4 h-4 text-[#0097a7]" />
                <span className="text-xs font-semibold text-[#0c2340] group-hover:text-[#0097a7] leading-tight">{area.city}</span>
                <span className="text-[10px] text-[#4a7fa5]">{area.schedule}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Services Overview — keyword-rich prose */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div>
            <h3 className="text-lg font-extrabold text-[#0c2340] mb-3">
              5-Gallon Water Jug Delivery — Metro Vancouver
            </h3>
            <p className="text-[#4a7fa5] text-sm leading-relaxed">
              TajWater delivers 5-gallon (20L) BPA-free water jugs to homes and offices across Metro Vancouver.
              Choose from natural spring water ($8.99/jug), alkaline water ($12.99/jug), or distilled water ($9.99/jug).
              Free delivery on every order. Same-day delivery available for orders placed before 12pm.
              Our jug swap system means you never need to think about empties — leave them out and we replace them on your next delivery.
              Subscribe for weekly or bi-weekly delivery and save from $6.49/jug.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#0c2340] mb-3">
              Water Filter Installation — Vancouver &amp; Lower Mainland
            </h3>
            <p className="text-[#4a7fa5] text-sm leading-relaxed">
              TajWater&apos;s certified technicians install under-sink reverse osmosis systems, whole-home filtration systems,
              and countertop water filters across Metro Vancouver. Every installation comes with a 2-year parts and labour warranty
              and a free water quality assessment. We service Vancouver, Burnaby, Surrey, Richmond, Coquitlam, and all
              Metro Vancouver cities. Annual filter replacement plans available from $79/year.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#0c2340] mb-3">
              Commercial Water Delivery — Offices, Restaurants &amp; Businesses
            </h3>
            <p className="text-[#4a7fa5] text-sm leading-relaxed">
              Metro Vancouver businesses trust TajWater for reliable commercial water supply. We offer custom pricing
              for offices, restaurants, gyms, hotels, and industrial facilities requiring 10 or more jugs per delivery.
              Net-30 invoicing, dedicated account management, and priority delivery scheduling available for approved accounts.
              Contact us for a commercial water delivery quote anywhere in Metro Vancouver.
            </p>
          </div>
        </div>

        {/* Competitor switch section */}
        <div className="bg-[#f0f9ff] rounded-3xl border border-[#cce7f0] p-8 mb-20">
          <h3 className="text-2xl font-extrabold text-[#0c2340] mb-3 text-center">
            Switching Water Delivery Providers in Metro Vancouver?
          </h3>
          <p className="text-[#4a7fa5] text-center max-w-3xl mx-auto mb-8">
            Many Metro Vancouver residents switch to TajWater from providers that raised prices without notice,
            missed deliveries, or required long contracts — looking for better pricing, more flexible scheduling,
            and faster local service. Here is what you get when you switch:
          </p>
          <div className="overflow-x-auto rounded-2xl border border-[#cce7f0] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#e0f7fa]">
                  <th scope="col" className="text-left px-5 py-3 font-bold text-[#0c2340]">Feature</th>
                  <th scope="col" className="text-left px-5 py-3 font-bold text-[#0097a7]">TajWater</th>
                  <th scope="col" className="text-left px-5 py-3 font-bold text-[#4a7fa5]">National Providers</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Delivery fee', 'Always free', 'Often $5–$15/delivery'],
                  ['Pricing transparency', 'Fully listed online', 'Quote required'],
                  ['Contract required', 'Never', 'Often 12–24 months'],
                  ['Same-day delivery', 'Yes (before 12pm)', 'Rarely available'],
                  ['Cancel anytime', 'Yes — no penalty', 'Early termination fees common'],
                  ['Local customer service', 'Port Coquitlam team', 'Call centre'],
                  ['Spring water (5 gal)', '$8.99/jug', '$12–$18/jug'],
                ].map(([feat, taj, nat], i) => (
                  <tr key={feat} className={i < 6 ? 'border-b border-[#cce7f0]' : ''}>
                    <td className="px-5 py-3 font-medium text-[#0c2340]">{feat}</td>
                    <td className="px-5 py-3 font-semibold text-[#0097a7]">{taj}</td>
                    <td className="px-5 py-3 text-[#4a7fa5]">{nat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-sm text-[#4a7fa5] mt-4">
            Switching is easy — <Link href="/contact" className="text-[#0097a7] font-semibold hover:underline">contact us</Link> and
            we will schedule your first delivery within 24 hours.
          </p>
        </div>

        {/* NAP + Contact block — critical for local SEO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-extrabold text-[#0c2340] mb-4">TajWater — Contact &amp; Location</h3>
            <address className="not-italic space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#0097a7] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#0c2340]">Taj Water Ltd</p>
                  <p className="text-[#4a7fa5]">1770 McLean Ave Unit 7</p>
                  <p className="text-[#4a7fa5]">Port Coquitlam, BC V3C 4K8, Canada</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#0097a7] shrink-0" />
                <a href="tel:+17785047880" className="text-[#0097a7] font-semibold hover:underline">+1 778-504-7880</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#0097a7] shrink-0" />
                <a href="mailto:info@tajwater.ca" className="text-[#0097a7] font-semibold hover:underline">info@tajwater.ca</a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#0097a7] shrink-0 mt-0.5" />
                <div className="text-[#4a7fa5]">
                  <p>Monday – Friday: 7:00 AM – 7:00 PM</p>
                  <p>Saturday: 8:00 AM – 6:00 PM</p>
                  <p>Sunday: 9:00 AM – 5:00 PM</p>
                </div>
              </div>
            </address>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#0c2340] mb-4">Water Delivery Service Area</h3>
            <p className="text-[#4a7fa5] text-sm leading-relaxed mb-3">
              TajWater delivers drinking water to all major cities in Metro Vancouver and the Sea-to-Sky corridor:
            </p>
            <p className="text-[#4a7fa5] text-sm leading-relaxed">
              <strong className="text-[#0c2340]">Daily delivery:</strong> Vancouver<br />
              <strong className="text-[#0c2340]">Mon–Sat:</strong> Burnaby, Richmond, Surrey<br />
              <strong className="text-[#0c2340]">Mon, Wed, Fri:</strong> North Vancouver, Delta, White Rock, Tsawwassen<br />
              <strong className="text-[#0c2340]">Tue, Thu, Sat:</strong> Coquitlam, Port Coquitlam, Port Moody, Langley, Langley Township, West Vancouver, Walnut Grove, Cloverdale, Mary Hill<br />
              <strong className="text-[#0c2340]">Wed, Fri:</strong> Maple Ridge, Pitt Meadows<br />
              <strong className="text-[#0c2340]">Thursdays:</strong> Squamish, Whistler
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
