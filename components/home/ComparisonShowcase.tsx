/**
 * Detailed comparison showing TajWater vs alternatives
 * Highlights unique selling propositions and local search advantage
 */

export default function ComparisonShowcase() {
  const comparisons = [
    {
      category: 'TajWater vs Big Box Stores (Costco, Walmart)',
      items: [
        { feature: 'Convenience', tajwater: 'Door-to-door delivery', alternative: 'You transport 20-40 lbs home' },
        { feature: 'Pricing', tajwater: '$6.49-$8.99/jug with subscription', alternative: '$8-12/jug (no discounts)' },
        { feature: 'Same-Day Service', tajwater: 'Often available before noon', alternative: 'Not available' },
        { feature: 'No Membership Required', tajwater: '✓ Completely free to join', alternative: 'Costco membership $60/year' },
        { feature: 'Jug Handling', tajwater: 'We swap your empties', alternative: 'You manage storage & returns' },
        { feature: 'Local Service', tajwater: '✓ Port Coquitlam-based, 24/7 support', alternative: 'Corporate call centers' },
      ],
    },
    {
      category: 'TajWater vs Tap Water',
      items: [
        { feature: 'Chlorine Taste', tajwater: 'Eliminated - pure filtered water', alternative: 'Present in most areas' },
        { feature: 'Testing & Certification', tajwater: 'NSF/ANSI tested every batch', alternative: 'Municipal testing only' },
        { feature: 'Minerals Available', tajwater: 'Spring or mineral-enhanced options', alternative: 'Fixed municipal content' },
        { feature: 'Cost per Gallon', tajwater: '$0.45/gallon (bulk)', alternative: '$0.0015/gallon (vs. convenience)' },
        { feature: 'Old Pipe Problems', tajwater: 'No impact - fresh source', alternative: 'Affected by aging infrastructure' },
        { feature: 'Portability', tajwater: 'Easy to transport/store', alternative: 'Fixed to your home' },
      ],
    },
    {
      category: 'TajWater vs Competitors (Culligan, Sparkletts)',
      items: [
        { feature: 'Local Ownership', tajwater: '✓ Metro Vancouver family business', alternative: 'National/international corps' },
        { feature: 'Hidden Fees', tajwater: 'None - transparent pricing', alternative: 'Setup fees, cancellation fees common' },
        { feature: 'Contract Length', tajwater: 'Cancel anytime, no penalty', alternative: '12-24 month contracts typical' },
        { feature: 'Price Guarantee', tajwater: 'Locked rates with subscriptions', alternative: 'Prices can increase' },
        { feature: 'Personalized Service', tajwater: 'Know your driver, same routes', alternative: 'Rotating contractors' },
        { feature: 'Commercial Support', tajwater: 'Dedicated account managers', alternative: 'Standard customer service' },
      ],
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-[#f0f9ff] to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0c2340] mb-4">
            Why TajWater Wins Against <span className="gradient-text">Every Alternative</span>
          </h2>
          <p className="text-[#4a7fa5] text-lg max-w-2xl mx-auto">
            We've compared ourselves against big box stores, tap water, and national competitors. 
            Here's why Metro Vancouver families choose TajWater.
          </p>
        </div>

        <div className="space-y-12">
          {comparisons.map((section) => (
            <div key={section.category} className="bg-white rounded-3xl border-2 border-[#cce7f0] overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-[#0097a7] to-[#00838f] px-6 sm:px-8 py-5">
                <h3 className="text-xl sm:text-2xl font-bold text-white">{section.category}</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#e0f7fa] border-b-2 border-[#cce7f0]">
                      <th className="text-left px-4 sm:px-6 py-4 font-bold text-[#0c2340] text-sm sm:text-base">Feature</th>
                      <th className="text-left px-4 sm:px-6 py-4 font-bold text-white bg-[#0097a7] text-sm sm:text-base">
                        ✓ TajWater
                      </th>
                      <th className="text-left px-4 sm:px-6 py-4 font-bold text-[#0c2340] text-sm sm:text-base">Other Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.items.map((item, idx) => (
                      <tr
                        key={item.feature}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-[#f8feffff]'}
                      >
                        <td className="px-4 sm:px-6 py-4 font-semibold text-[#0c2340] text-sm sm:text-base border-b border-[#cce7f0]">
                          {item.feature}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-[#0097a7] font-semibold text-sm sm:text-base border-b border-[#cce7f0] bg-[#e0f7fa]/30">
                          {item.tajwater}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-[#4a7fa5] text-sm sm:text-base border-b border-[#cce7f0]">
                          {item.alternative}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-[#0097a7] to-[#006064] rounded-3xl p-8 sm:p-12 text-center text-white">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">Made for Metro Vancouver</h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            TajWater is locally owned and operated right here in Port Coquitlam. We understand Metro Vancouver's unique water needs — 
            from the mountains of North Vancouver to the delta communities. We're not a national franchise. We're your neighbors.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '5,000+', desc: 'Happy Families' },
              { label: '21', desc: 'Service Cities' },
              { label: '5+', desc: 'Years Local' },
              { label: '4.8★', desc: 'Customer Rating' },
            ].map((stat) => (
              <div key={stat.desc} className="bg-white/10 backdrop-blur rounded-2xl p-4">
                <p className="text-2xl sm:text-3xl font-bold">{stat.label}</p>
                <p className="text-sm text-[#b3e5fc] mt-1">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
