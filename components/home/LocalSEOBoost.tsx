/**
 * Local SEO Optimization Module
 * Implements advanced local search optimization for all 21 cities
 */

import Link from 'next/link'
import { MapPin, Phone, Clock } from 'lucide-react'

export default function LocalSEOBoost() {
  const cityGroups = [
    {
      region: 'Central Metro',
      cities: [
        { name: 'Vancouver', slug: 'vancouver', highlight: 'Downtown to Marpole' },
        { name: 'Burnaby', slug: 'burnaby', highlight: 'Metrotown to Brentwood' },
        { name: 'Richmond', slug: 'richmond', highlight: 'City Centre & Steveston' },
      ],
    },
    {
      region: 'South Metro',
      cities: [
        { name: 'Surrey', slug: 'surrey', highlight: 'Newton to South Surrey' },
        { name: 'Delta', slug: 'delta', highlight: 'Ladner & Tsawwassen' },
        { name: 'White Rock', slug: 'white-rock', highlight: 'Beachside & Hillcrest' },
      ],
    },
    {
      region: 'East Metro',
      cities: [
        { name: 'Coquitlam', slug: 'coquitlam', highlight: 'Burke Mountain & Westwood' },
        { name: 'Port Coquitlam', slug: 'port-coquitlam', highlight: 'Our Home Base' },
        { name: 'Port Moody', slug: 'port-moody', highlight: 'Inlet Centre & Heritage' },
        { name: 'Maple Ridge', slug: 'maple-ridge', highlight: 'Albion & Haney' },
        { name: 'Pitt Meadows', slug: 'pitt-meadows', highlight: 'Central Pitt Meadows' },
      ],
    },
    {
      region: 'North Metro',
      cities: [
        { name: 'North Vancouver', slug: 'north-vancouver', highlight: 'Lynn Valley & Deep Cove' },
        { name: 'West Vancouver', slug: 'west-vancouver', highlight: 'Dundarave & Ambleside' },
      ],
    },
    {
      region: 'Tri-Cities & Beyond',
      cities: [
        { name: 'Langley', slug: 'langley', highlight: 'City & Township' },
        { name: 'Langley Township', slug: 'langley-township', highlight: 'Fort Langley & Aldergrove' },
        { name: 'Walnut Grove', slug: 'walnut-grove', highlight: 'Family Neighborhoods' },
        { name: 'Cloverdale', slug: 'cloverdale', highlight: 'Clayton Heights' },
        { name: 'Mary Hill', slug: 'mary-hill', highlight: 'Port Coquitlam Area' },
        { name: 'Tsawwassen', slug: 'tsawwassen', highlight: 'Delta Beachside' },
      ],
    },
    {
      region: 'Sea-to-Sky',
      cities: [
        { name: 'Squamish', slug: 'squamish', highlight: 'Gateway North' },
        { name: 'Whistler', slug: 'whistler', highlight: 'Peak-to-Peak Service' },
      ],
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-[#f0f9ff] to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="w-8 h-8 text-[#0097a7]" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340]">
              Water Delivery Across All of Metro Vancouver
            </h2>
          </div>
          <p className="text-[#4a7fa5] text-lg max-w-3xl mx-auto">
            From Vancouver to Whistler, we deliver to 21+ cities. Same-day delivery available in most zones.
            No matter where you live in Metro Vancouver, TajWater has you covered.
          </p>
        </div>

        {/* City Groups by Region */}
        <div className="space-y-8">
          {cityGroups.map((group) => (
            <div key={group.region} className="bg-white rounded-2xl border-2 border-[#cce7f0] overflow-hidden">
              <div className="bg-gradient-to-r from-[#0097a7] to-[#006064] px-6 py-4">
                <h3 className="text-lg font-bold text-white">{group.region}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {group.cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/areas/${city.slug}`}
                    className="group p-4 rounded-xl bg-[#f0f9ff] border-2 border-[#cce7f0] hover:border-[#0097a7] hover:shadow-md transition-all"
                  >
                    <h4 className="font-bold text-[#0c2340] group-hover:text-[#0097a7] transition-colors mb-1">
                      {city.name}
                    </h4>
                    <p className="text-xs text-[#4a7fa5]">{city.highlight}</p>
                    <div className="mt-2 flex items-center gap-2 text-[#0097a7] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Learn More →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Key Information Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border-2 border-[#cce7f0] p-6 text-center">
            <MapPin className="w-8 h-8 text-[#0097a7] mx-auto mb-3" />
            <h4 className="font-bold text-[#0c2340] mb-2">21 Service Cities</h4>
            <p className="text-sm text-[#4a7fa5]">
              Complete coverage from Vancouver to Whistler, and everywhere in between.
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-[#cce7f0] p-6 text-center">
            <Clock className="w-8 h-8 text-[#0097a7] mx-auto mb-3" />
            <h4 className="font-bold text-[#0c2340] mb-2">Same-Day Delivery</h4>
            <p className="text-sm text-[#4a7fa5]">
              Most areas offer same-day delivery for orders placed before 12pm.
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-[#cce7f0] p-6 text-center">
            <Phone className="w-8 h-8 text-[#0097a7] mx-auto mb-3" />
            <h4 className="font-bold text-[#0c2340] mb-2">24/7 Support</h4>
            <p className="text-sm text-[#4a7fa5]">
              Questions? Call us or check our FAQ — we're here to help.
            </p>
          </div>
        </div>

        {/* Service Area Details */}
        <div className="mt-12 bg-gradient-to-r from-[#0097a7] to-[#006064] rounded-3xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">Why Choose TajWater in Your Area?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Local Knowledge',
                desc: 'We know Metro Vancouver\'s neighborhoods, traffic patterns, and delivery challenges better than any national company.',
              },
              {
                title: 'Same Pricing Everywhere',
                desc: 'No rural premiums or surcharges. Whether you\'re in Downtown Vancouver or rural Aldergrove, you pay the same rate.',
              },
              {
                title: 'Quick Response Times',
                desc: 'Our Port Coquitlam warehouse means faster fulfillment and same-day service availability.',
              },
              {
                title: 'Community Focus',
                desc: 'We sponsor local events, support local organizations, and genuinely care about each Metro Vancouver community.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <h4 className="font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-[#b3e5fc]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
