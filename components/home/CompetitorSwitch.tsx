import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function CompetitorSwitch() {
  return (
    <section className="py-24 bg-white" aria-labelledby="switch-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* Service descriptions — keyword-rich server-rendered prose */}
        <div>
          <h2 id="switch-heading" className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] text-center mb-4">
            Water Delivery, Filter Installation &amp; Commercial Supply — Metro Vancouver
          </h2>
          <p className="text-[#4a7fa5] text-center max-w-3xl mx-auto mb-12">
            TajWater offers three core services to homes and businesses across all 21 Metro Vancouver delivery zones.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                heading: '5-Gallon Water Jug Delivery — Home & Office',
                body: 'Fresh 5-gallon (20L) BPA-free water jugs delivered to your home or office across Metro Vancouver. Choose spring water at $8.99/jug, alkaline water at $12.99/jug, or distilled water at $9.99/jug. Free delivery on every order. Same-day delivery available for orders placed before 12pm. Subscription customers save from $6.49/jug. Our jug swap system means you leave empties on your doorstep and we replace them — no hassle, no heavy lifting.',
                link: '/shop',
                linkText: 'Order water delivery',
              },
              {
                heading: 'Water Filter Installation — Vancouver & Lower Mainland',
                body: 'Certified installation of under-sink reverse osmosis systems, whole-home multi-stage filters, and countertop filtration units across Metro Vancouver. All work is backed by a 2-year parts and labour warranty. We provide a free water quality assessment before installation. Annual filter replacement plans available. Serving Vancouver, Burnaby, Coquitlam, Richmond, Surrey, Langley, and all Metro Vancouver cities.',
                link: '/services',
                linkText: 'View filter services',
              },
              {
                heading: 'Commercial Water Delivery — Offices, Restaurants & Gyms',
                body: 'Businesses across Metro Vancouver rely on TajWater for bulk water supply. We offer custom pricing for commercial accounts requiring 10 or more jugs per delivery, Net-30 invoicing for approved businesses, dedicated account management, and priority delivery scheduling. Whether you run a restaurant in Vancouver, an office in Burnaby, or a gym in Surrey — contact us for a commercial water delivery quote.',
                link: '/contact',
                linkText: 'Get a commercial quote',
              },
            ].map((item) => (
              <div key={item.heading} className="bg-[#f0f9ff] rounded-2xl border border-[#cce7f0] p-6 flex flex-col gap-3">
                <h3 className="text-base font-extrabold text-[#0c2340]">{item.heading}</h3>
                <p className="text-[#4a7fa5] text-sm leading-relaxed flex-1">{item.body}</p>
                <Link href={item.link} className="text-sm font-semibold text-[#0097a7] hover:underline mt-auto">
                  {item.linkText} →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor switch table */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] text-center mb-3">
            Switching Water Delivery Providers in Metro Vancouver?
          </h2>
          <p className="text-[#4a7fa5] text-center max-w-3xl mx-auto mb-8">
            Many Metro Vancouver households switch to TajWater from providers that missed deliveries,
            raised prices without notice, or locked them into long contracts. Here is a plain comparison of what you get.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-[#cce7f0]">
            <table className="w-full text-sm bg-white">
              <thead>
                <tr className="bg-[#e0f7fa]">
                  <th scope="col" className="text-left px-5 py-3 font-bold text-[#0c2340]">Feature</th>
                  <th scope="col" className="text-left px-5 py-3 font-bold text-[#0097a7]">TajWater</th>
                  <th scope="col" className="text-left px-5 py-3 font-bold text-[#4a7fa5]">National Providers</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Spring water (5 gallon)', '$8.99/jug', '$12–$18/jug'],
                  ['Delivery fee', 'Always free', 'Often $5–$15 extra'],
                  ['Pricing published online', 'Yes — fully transparent', 'Rarely — quote required'],
                  ['Contract required', 'Never', 'Often 12–24 months'],
                  ['Cancel or pause', 'Anytime, no penalty', 'Early exit fees common'],
                  ['Same-day delivery', 'Yes (order before 12pm)', 'Rarely available'],
                  ['Local customer service', 'Port Coquitlam team', 'National call centre'],
                  ['Service area in Metro Vancouver', '21 cities', 'Varies — gaps common'],
                ].map(([feat, taj, nat], i, arr) => (
                  <tr key={feat} className={i < arr.length - 1 ? 'border-b border-[#cce7f0]' : ''}>
                    <td className="px-5 py-3 font-medium text-[#0c2340]">{feat}</td>
                    <td className="px-5 py-3 font-semibold text-[#0097a7]">{taj}</td>
                    <td className="px-5 py-3 text-[#4a7fa5]">{nat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-sm text-[#4a7fa5] mt-4">
            Ready to switch?{' '}
            <Link href="/contact" className="text-[#0097a7] font-semibold hover:underline">
              Contact us
            </Link>{' '}
            and we will schedule your first delivery within 24 hours.
          </p>
        </div>

        {/* NAP block — critical local SEO signal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-[#cce7f0] pt-12">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0c2340] mb-5">
              TajWater — Water Delivery Company, Port Coquitlam BC
            </h2>
            <address className="not-italic space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#0097a7] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#0c2340]">Taj Water Ltd</p>
                  <p className="text-[#4a7fa5]">1770 McLean Ave Unit 7, Port Coquitlam, BC V3C 4K8</p>
                  <p className="text-[#4a7fa5]">Canada</p>
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
                <div className="text-[#4a7fa5] leading-relaxed">
                  <p>Monday – Friday: 7:00 AM – 7:00 PM PST</p>
                  <p>Saturday: 8:00 AM – 6:00 PM PST</p>
                  <p>Sunday: 9:00 AM – 5:00 PM PST</p>
                </div>
              </div>
            </address>
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#0c2340] mb-4">Quick Links</h3>
            <nav aria-label="Quick links" className="grid grid-cols-2 gap-2">
              {[
                { label: 'Order Water Delivery', href: '/shop' },
                { label: 'Our Services', href: '/services' },
                { label: 'Delivery Areas', href: '/areas' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'About TajWater', href: '/about' },
                { label: 'Water Delivery Blog', href: '/blog' },
                { label: 'Vancouver Water Delivery', href: '/areas/vancouver' },
                { label: 'Burnaby Water Delivery', href: '/areas/burnaby' },
                { label: 'Surrey Water Delivery', href: '/areas/surrey' },
                { label: 'Coquitlam Water Delivery', href: '/areas/coquitlam' },
                { label: 'Richmond Water Delivery', href: '/areas/richmond' },
                { label: 'Langley Water Delivery', href: '/areas/langley' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-[#0097a7] hover:underline truncate">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

      </div>
    </section>
  )
}
