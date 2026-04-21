'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import Script from 'next/script'

const faqs = [
  {
    q: 'How quickly can I get my first water delivery?',
    a: 'For most zones, TajWater offers same-day delivery if you order before 12pm. Otherwise, next-day delivery is always available across Metro Vancouver.',
  },
  {
    q: 'What areas does TajWater deliver to?',
    a: 'We deliver to 16+ zones across Metro Vancouver and the Sea-to-Sky corridor: Vancouver, Burnaby, Richmond, Surrey, Langley, Coquitlam, Port Coquitlam, Port Moody, North Vancouver, West Vancouver, Delta, Maple Ridge, Pitt Meadows, White Rock, Squamish, and Whistler.',
  },
  {
    q: 'What is the difference between Alkaline, Spring, and Distilled water?',
    a: 'Spring water comes from natural underground sources and contains beneficial minerals. Alkaline water has a higher pH level (8-9) that some believe offers health benefits. Distilled water is purified through boiling and condensation, removing virtually all minerals — ideal for medical equipment, CPAP machines, and lab use.',
  },
  {
    q: 'How does the bottle deposit and return system work?',
    a: 'When you first order, there is a one-time $12 bottle deposit per jug. On your next delivery, simply leave your empty jugs outside your door and our driver will swap them for full ones. The deposit stays on your account as long as you keep ordering.',
  },
  {
    q: 'Do I need to be home for my water delivery?',
    a: 'No! Most customers leave a note on their order telling us where to leave the jugs (e.g., front porch, garage, side door). Our drivers will swap your empties and place the new jugs wherever you specify.',
  },
  {
    q: 'Are your water jugs BPA-free?',
    a: 'Yes. All our 5-gallon (20L) jugs are made from BPA-free, food-grade polycarbonate. They are regularly sanitized and inspected before each refill to ensure safety and quality.',
  },
  {
    q: 'Can I pause or cancel my subscription?',
    a: 'Absolutely. You can pause, change frequency, or cancel your subscription anytime from your customer dashboard — no fees, no questions asked.',
  },
  {
    q: 'Do you offer commercial water delivery for offices?',
    a: 'Yes! We offer dedicated commercial accounts with custom pricing, Net-30 invoicing, and a dedicated account manager for businesses needing 10+ jugs per delivery. Contact us for a custom quote.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <Script
        id="homepage-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e0f7fa] text-[#0097a7] text-sm font-semibold mb-3">
              <HelpCircle className="w-3.5 h-3.5" /> FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-[#4a7fa5] text-lg max-w-xl mx-auto">
              Everything you need to know about our water delivery service.
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="bg-[#f0f9ff] rounded-2xl border border-[#cce7f0] overflow-hidden hover:border-[#0097a7]/30 transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                  aria-expanded={openIndex === i}
                >
                  <span className="font-semibold text-[#0c2340] text-[15px]">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-[#0097a7]" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-[#4a7fa5] text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
