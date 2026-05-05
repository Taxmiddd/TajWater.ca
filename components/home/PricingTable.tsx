import Link from 'next/link'

const tiers = [
  { qty: '1–4 jugs', price: '$8.99', unit: 'per jug', delivery: 'Free delivery', note: 'Perfect for home use' },
  { qty: '5–9 jugs', price: '$7.99', unit: 'per jug', delivery: 'Free delivery', note: 'Great for families' },
  { qty: '10+ jugs', price: '$7.49', unit: 'per jug', delivery: 'Free + priority', note: 'Best for offices' },
  { qty: 'Subscription', price: 'From $6.49', unit: 'per jug', delivery: 'Free + scheduled', note: 'Maximum savings' },
]

export default function PricingTable() {
  return (
    <section className="py-24 bg-white" aria-labelledby="pricing-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="pricing-heading" className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-4">
            Transparent Water Delivery Pricing in Metro Vancouver
          </h2>
          <p className="text-[#4a7fa5] text-lg max-w-2xl mx-auto">
            No hidden fees. No contracts required. Free delivery on every order across all 21 service zones.
            A one-time $12 bottle deposit applies per jug on your first order — returned when you stop service.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {tiers.map((tier) => (
            <div
              key={tier.qty}
              className="rounded-2xl border border-[#cce7f0] bg-[#f0f9ff] p-6 flex flex-col gap-2"
            >
              <p className="text-sm font-semibold text-[#0097a7] uppercase tracking-wide">{tier.qty}</p>
              <p className="text-3xl font-extrabold text-[#0c2340]">{tier.price}</p>
              <p className="text-xs text-[#4a7fa5]">{tier.unit}</p>
              <hr className="border-[#cce7f0] my-2" />
              <p className="text-sm text-[#0c2340] font-medium">{tier.delivery}</p>
              <p className="text-xs text-[#4a7fa5]">{tier.note}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto mb-10">
          <table className="w-full text-sm border-collapse">
            <caption className="sr-only">Water type pricing comparison for Metro Vancouver delivery</caption>
            <thead>
              <tr className="bg-[#e0f7fa]">
                <th scope="col" className="text-left px-4 py-3 font-bold text-[#0c2340] rounded-tl-xl">Water Type</th>
                <th scope="col" className="text-left px-4 py-3 font-bold text-[#0c2340]">Size</th>
                <th scope="col" className="text-left px-4 py-3 font-bold text-[#0c2340]">Starting Price</th>
                <th scope="col" className="text-left px-4 py-3 font-bold text-[#0c2340] rounded-tr-xl">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#cce7f0]">
                <td className="px-4 py-3 font-medium text-[#0c2340]">Spring Water</td>
                <td className="px-4 py-3 text-[#4a7fa5]">5 gallon (20L)</td>
                <td className="px-4 py-3 font-semibold text-[#0097a7]">$8.99/jug</td>
                <td className="px-4 py-3 text-[#4a7fa5]">Everyday drinking, cooking</td>
              </tr>
              <tr className="border-b border-[#cce7f0]">
                <td className="px-4 py-3 font-medium text-[#0c2340]">Alkaline Water</td>
                <td className="px-4 py-3 text-[#4a7fa5]">5 gallon (20L)</td>
                <td className="px-4 py-3 font-semibold text-[#0097a7]">$12.99/jug</td>
                <td className="px-4 py-3 text-[#4a7fa5]">Health-conscious households</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-[#0c2340]">Distilled Water</td>
                <td className="px-4 py-3 text-[#4a7fa5]">5 gallon (20L)</td>
                <td className="px-4 py-3 font-semibold text-[#0097a7]">$9.99/jug</td>
                <td className="px-4 py-3 text-[#4a7fa5]">CPAP machines, lab use, steam irons</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-center text-sm text-[#4a7fa5] mb-6">
          All prices in CAD. Delivery is free on all orders across Metro Vancouver including Vancouver, Burnaby,
          Richmond, Surrey, Langley, Coquitlam, Port Coquitlam, Port Moody, North Vancouver, West Vancouver,
          Delta, Maple Ridge, White Rock, Pitt Meadows, Squamish, and Whistler.
        </p>

        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#0097a7] text-white font-bold text-base hover:bg-[#00838f] transition-colors shadow-lg"
          >
            Order Water Delivery Now
          </Link>
        </div>
      </div>
    </section>
  )
}
