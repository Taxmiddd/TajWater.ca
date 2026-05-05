import Link from 'next/link'

const types = [
  {
    name: 'Spring Water',
    ph: '7.2–7.8',
    source: 'Natural underground aquifer, BC mountains',
    minerals: 'Calcium, magnesium, potassium — naturally occurring',
    bestFor: 'Daily drinking, cooking, children and families',
    price: '$8.99/jug',
  },
  {
    name: 'Alkaline Water',
    ph: '8.0–9.5',
    source: 'Purified water with added electrolytes and minerals',
    minerals: 'Calcium, magnesium, potassium — enhanced',
    bestFor: 'Active lifestyles, health-conscious households, post-workout hydration',
    price: '$12.99/jug',
  },
  {
    name: 'Distilled Water',
    ph: '5.5–7.0',
    source: 'Multi-stage purification: boiling, condensation, filtration',
    minerals: 'None — 99.9% pure H₂O',
    bestFor: 'CPAP machines, steam irons, aquariums, laboratory, medical use',
    price: '$9.99/jug',
  },
]

export default function WaterGuide() {
  return (
    <section className="py-24 bg-[#f0f9ff]" aria-labelledby="water-guide-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="water-guide-heading" className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-4">
            Spring vs Alkaline vs Distilled Water — Which Should You Choose?
          </h2>
          <p className="text-[#4a7fa5] text-lg max-w-2xl mx-auto">
            All three are available for delivery across Metro Vancouver. Here is a plain-English breakdown
            to help you pick the right water for your home or office.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {types.map((type) => (
            <div key={type.name} className="bg-white rounded-2xl border border-[#cce7f0] p-6 flex flex-col gap-3">
              <h3 className="text-lg font-extrabold text-[#0c2340]">{type.name}</h3>
              <dl className="flex flex-col gap-2 text-sm flex-1">
                <div>
                  <dt className="text-xs font-semibold text-[#0097a7] uppercase tracking-wide mb-0.5">pH Level</dt>
                  <dd className="text-[#0c2340]">{type.ph}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-[#0097a7] uppercase tracking-wide mb-0.5">Source</dt>
                  <dd className="text-[#4a7fa5]">{type.source}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-[#0097a7] uppercase tracking-wide mb-0.5">Minerals</dt>
                  <dd className="text-[#4a7fa5]">{type.minerals}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-[#0097a7] uppercase tracking-wide mb-0.5">Best For</dt>
                  <dd className="text-[#0c2340] font-medium">{type.bestFor}</dd>
                </div>
              </dl>
              <div className="mt-auto pt-3 border-t border-[#cce7f0]">
                <span className="text-xl font-extrabold text-[#0097a7]">{type.price}</span>
                <span className="text-xs text-[#4a7fa5] ml-1">delivered free</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#cce7f0] p-6 mb-8">
          <h3 className="text-lg font-extrabold text-[#0c2340] mb-3">
            Is Vancouver Tap Water Safe to Drink?
          </h3>
          <p className="text-[#4a7fa5] text-sm leading-relaxed">
            Metro Vancouver tap water meets all Health Canada guidelines and is technically safe to drink.
            However, many residents in Burnaby, Surrey, Coquitlam, and Port Coquitlam report a chlorine taste
            and odour from municipal treatment. Older buildings with aging pipes can also introduce sediment and
            heavy metals at the tap. TajWater delivers purified, independently tested water so you never have
            to think about what is in your glass. Our spring and alkaline water is tested for over 200 contaminants
            and contains zero chlorine, chloramines, or fluoride.
          </p>
        </div>

        <div className="text-center">
          <p className="text-[#4a7fa5] text-sm mb-4">
            Not sure which water is right for you?{' '}
            <Link href="/contact" className="text-[#0097a7] font-semibold hover:underline">
              Call or WhatsApp us
            </Link>{' '}
            and we will recommend the best option for your household.
          </p>
        </div>
      </div>
    </section>
  )
}
