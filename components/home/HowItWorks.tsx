'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ClipboardList, Truck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: ClipboardList,
    step: '01',
    title: 'Place Your Order',
    desc: 'Choose your water type, quantity, and delivery window online — or give us a call. Takes less than 2 minutes.',
    color: '#0097a7',
    highlight: 'Takes 2 minutes',
  },
  {
    icon: Truck,
    step: '02',
    title: 'We Prepare & Deliver',
    desc: 'Every jug is quality-checked and sanitized before dispatch. Track your driver in real-time on the day of delivery.',
    color: '#1565c0',
    highlight: 'Real-time tracking',
  },
  {
    icon: CheckCircle2,
    step: '03',
    title: 'Enjoy Pure Water',
    desc: 'Fresh, clean water at your door. Return empty jugs on the next delivery — no trips to the store, ever again.',
    color: '#006064',
    highlight: 'Bottle swap included',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 section-gradient relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #0097a720 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#e0f7fa] text-[#0097a7] text-sm font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-4">
            Pure Water in <span className="gradient-text">3 Simple Steps</span>
          </h2>
          <p className="text-[#4a7fa5] text-lg max-w-xl mx-auto">
            From order to doorstep — we&apos;ve made it effortless to stay hydrated every day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-[5.5rem] left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px pointer-events-none">
            <div className="relative w-full h-full flex items-center">
              <div className="w-full border-t-2 border-dashed border-[#0097a7]/25" />
              {/* Animated dot traveling across */}
              <motion.div
                className="absolute w-3 h-3 rounded-full bg-[#0097a7]/60"
                animate={{ left: ['0%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{ top: '-4px' }}
              />
            </div>
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.14, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="relative group"
              >
                <div className="relative bg-white rounded-3xl p-8 text-center shadow-sm border border-[#cce7f0] group-hover:border-[#0097a7]/40 group-hover:shadow-xl group-hover:shadow-[#0097a7]/10 transition-all duration-300 h-full flex flex-col">
                  {/* Step badge */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className="px-4 py-1 rounded-full text-xs font-extrabold text-white tracking-wide shadow-md"
                      style={{ background: step.color }}
                    >
                      STEP {step.step}
                    </span>
                  </div>

                  {/* Icon circle */}
                  <motion.div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 mt-4"
                    style={{ background: `linear-gradient(135deg, ${step.color}18, ${step.color}38)` }}
                    whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.4 } }}
                  >
                    <Icon className="w-9 h-9" style={{ color: step.color }} />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-extrabold text-[#0c2340] mb-3">{step.title}</h3>
                  <p className="text-[#4a7fa5] text-sm leading-relaxed mb-5 flex-1">{step.desc}</p>

                  {/* Highlight badge */}
                  <div className="mt-auto">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ color: step.color, background: `${step.color}14` }}
                    >
                      ✓ {step.highlight}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-14"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#0097a7] to-[#1565c0] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#0097a7]/25 hover:-translate-y-0.5 transition-all duration-300"
          >
            Start your first order <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
