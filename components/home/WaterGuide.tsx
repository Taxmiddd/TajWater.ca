'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Droplets, Zap, FlaskConical, CheckCircle } from 'lucide-react'

const types = [
  {
    name: 'Spring Water',
    icon: Droplets,
    ph: '7.2–7.8',
    source: 'Natural underground aquifer, BC mountains',
    minerals: 'Calcium, magnesium, potassium — naturally occurring',
    bestFor: 'Daily drinking, cooking, children and families',
    price: '$8.99',
    href: '/spring-water-delivery-vancouver',
    gradient: 'from-[#0097a7] to-[#00bcd4]',
    lightBg: 'from-[#e0f7fa] to-[#b2ebf2]',
    pill: 'bg-[#0097a7]',
    accent: '#0097a7',
    tag: 'Most Popular',
  },
  {
    name: 'Alkaline Water',
    icon: Zap,
    ph: '8.0–9.5',
    source: 'Purified water with added electrolytes and minerals',
    minerals: 'Calcium, magnesium, potassium — enhanced',
    bestFor: 'Active lifestyles, health-conscious households, post-workout',
    price: '$12.99',
    href: '/alkaline-water-delivery-vancouver',
    gradient: 'from-[#1565c0] to-[#1976d2]',
    lightBg: 'from-[#e3f2fd] to-[#bbdefb]',
    pill: 'bg-[#1565c0]',
    accent: '#1565c0',
    tag: 'Premium',
  },
  {
    name: 'Distilled Water',
    icon: FlaskConical,
    ph: '5.5–7.0',
    source: 'Multi-stage purification: boiling, condensation, filtration',
    minerals: 'None — 99.9% pure H₂O',
    bestFor: 'CPAP machines, steam irons, aquariums, medical & lab use',
    price: '$9.99',
    href: '/distilled-water-delivery-vancouver',
    gradient: 'from-[#006064] to-[#00838f]',
    lightBg: 'from-[#e0f2f1] to-[#b2dfdb]',
    pill: 'bg-[#006064]',
    accent: '#006064',
    tag: 'Ultra Pure',
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cardVariants: any = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function WaterGuide() {
  return (
    <section className="py-24 bg-white" aria-labelledby="water-guide-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#e0f7fa] text-[#0097a7] text-sm font-semibold mb-3">Water Types</span>
          <h2 id="water-guide-heading" className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-4">
            Which Water Is <span className="gradient-text">Right for You?</span>
          </h2>
          <p className="text-[#4a7fa5] text-lg max-w-2xl mx-auto">
            All three types are available for delivery across Metro Vancouver — here&apos;s a plain-English breakdown to help you choose.
          </p>
        </motion.div>

        {/* Water type cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-12">
          {types.map((type, i) => {
            const Icon = type.icon
            return (
              <motion.div
                key={type.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className="group rounded-3xl border border-[#cce7f0] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#0097a7]/10 transition-all duration-300 bg-white flex flex-col"
              >
                {/* Card header with gradient */}
                <div className={`relative bg-gradient-to-br ${type.lightBg} px-6 pt-7 pb-8`}>
                  {/* Tag */}
                  <span className={`absolute top-4 right-4 text-[10px] font-bold text-white px-2.5 py-1 rounded-full ${type.pill}`}>
                    {type.tag}
                  </span>

                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${type.accent}, ${type.accent}cc)` }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-extrabold text-[#0c2340] mb-1">{type.name}</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold" style={{ color: type.accent }}>{type.price}</span>
                    <span className="text-xs text-[#4a7fa5]">/ jug</span>
                  </div>
                </div>

                {/* Card body */}
                <div className="px-6 py-5 flex flex-col gap-3 flex-1">
                  <dl className="flex flex-col gap-2.5 text-sm flex-1">
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: type.accent }}>pH Level</dt>
                      <dd className="text-[#0c2340] font-medium">{type.ph}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: type.accent }}>Source</dt>
                      <dd className="text-[#4a7fa5] text-sm">{type.source}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: type.accent }}>Best For</dt>
                      <dd className="flex items-start gap-2 text-[#0c2340] font-medium">
                        <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: type.accent }} />
                        {type.bestFor}
                      </dd>
                    </div>
                  </dl>

                  <Link
                    href={type.href}
                    className="mt-2 inline-flex items-center justify-center w-full py-2.5 rounded-xl border font-semibold text-sm transition-all duration-200 hover:text-white"
                    style={{
                      borderColor: type.accent + '50',
                      color: type.accent,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = type.accent
                      ;(e.currentTarget as HTMLAnchorElement).style.borderColor = type.accent
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = ''
                      ;(e.currentTarget as HTMLAnchorElement).style.borderColor = type.accent + '50'
                    }}
                  >
                    Learn more →
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Tap water explainer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#f0f9ff] rounded-2xl border border-[#cce7f0] p-6 mb-6"
        >
          <h3 className="text-lg font-extrabold text-[#0c2340] mb-2">Is Vancouver Tap Water Safe to Drink?</h3>
          <p className="text-[#4a7fa5] text-sm leading-relaxed mb-3">
            Metro Vancouver tap water meets all Health Canada guidelines and is technically safe to drink. However, many residents in Burnaby, Surrey, Coquitlam, and Port Coquitlam report a chlorine taste and odour from municipal treatment. Older buildings with aging pipes can also introduce sediment and heavy metals at the tap. TajWater delivers purified, independently tested water so you never have to think about what&apos;s in your glass.
          </p>
          <Link href="/blog/is-vancouver-tap-water-safe-to-drink" className="text-[#0097a7] font-semibold text-sm hover:underline flex items-center gap-1">
            Read the full 2026 Tap Water Safety Report →
          </Link>
        </motion.div>

        <div className="text-center">
          <p className="text-[#4a7fa5] text-sm mb-1">
            Not sure which water is right for you?{' '}
            <Link href="/contact" className="text-[#0097a7] font-semibold hover:underline">Call or WhatsApp us</Link>{' '}
            — or read our full guide:{' '}
            <Link href="/blog/spring-vs-alkaline-vs-distilled-water-vancouver" className="text-[#0097a7] font-semibold hover:underline">
              Spring vs Alkaline vs Distilled →
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
