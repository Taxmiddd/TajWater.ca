'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import Script from 'next/script'

const faqSections = [
  {
    title: 'General Questions',
    icon: '❓',
    faqs: [
      {
        q: 'How quickly can I get my first water delivery?',
        a: 'For most zones, TajWater offers same-day delivery if you order before 12pm. Otherwise, next-day delivery is always available across Metro Vancouver. We deliver Monday through Saturday depending on your area.',
      },
      {
        q: 'What areas does TajWater deliver to?',
        a: 'We deliver to 21+ zones across Metro Vancouver and the Sea-to-Sky corridor: Vancouver, Burnaby, Richmond, Surrey, Langley, Coquitlam, Port Coquitlam, Port Moody, North Vancouver, West Vancouver, Delta, Maple Ridge, Pitt Meadows, White Rock, Squamish, and Whistler.',
      },
      {
        q: 'Do you offer commercial water delivery?',
        a: 'Yes! We offer dedicated commercial accounts with custom pricing, Net-30 invoicing, and a dedicated account manager for businesses needing 10+ jugs per delivery. Contact us for a custom quote.',
      },
      {
        q: 'Can I pause or cancel my subscription?',
        a: 'Absolutely. You can pause, change frequency, or cancel your subscription anytime from your customer dashboard — no fees, no questions asked. No hidden cancellation charges ever.',
      },
    ],
  },
  {
    title: 'Water Quality & Types',
    icon: '💧',
    faqs: [
      {
        q: 'What is the difference between Spring, Alkaline, and Distilled water?',
        a: 'Spring water comes from natural underground sources and contains beneficial minerals (7.2-7.8 pH). Alkaline water has a higher pH level (8.0-9.5) that some believe offers health benefits. Distilled water is purified through boiling and condensation, removing virtually all minerals — ideal for medical equipment, CPAP machines, and lab use.',
      },
      {
        q: 'Are your water jugs BPA-free?',
        a: 'Yes. All our 5-gallon (20L) jugs are made from BPA-free, food-grade polycarbonate. They are regularly sanitized and inspected before each refill to ensure safety and quality. We meet NSF/ANSI standards.',
      },
      {
        q: 'How is your water tested and certified?',
        a: 'Every batch of TajWater is tested for quality and safety according to NSF/ANSI standards. We maintain records of all testing and can provide documentation upon request. You\'re drinking water that meets or exceeds municipal standards.',
      },
      {
        q: 'Is your water purified or filtered?',
        a: 'Our water undergoes multi-stage purification: source testing → filtration → UV treatment → quality verification. This removes contaminants and chlorine while retaining beneficial minerals (in spring and alkaline options).',
      },
    ],
  },
  {
    title: 'Pricing & Billing',
    icon: '💰',
    faqs: [
      {
        q: 'How much does water delivery cost?',
        a: 'TajWater pricing starts at $8.99 per 5-gallon jug for spring water, $12.99 for alkaline, and $9.99 for distilled. Delivery is always FREE on every order. Bulk orders (10+) and subscriptions bring prices down to $6.49/jug. No hidden fees ever.',
      },
      {
        q: 'What is the bottle deposit?',
        a: 'When you first order, there is a one-time $12 bottle deposit per jug (e.g., $36 deposit for 3 jugs). On your next delivery, our driver swaps your empties for full ones. The deposit stays on your account as long as you order. You get it back when you cancel.',
      },
      {
        q: 'Are there any hidden fees or contracts?',
        a: 'Zero hidden fees. No setup fees, no cancellation fees, no delivery minimums. Our subscription is completely flexible — you can pause, change frequency, or cancel anytime without penalty. Just transparent pricing.',
      },
      {
        q: 'Do you offer bulk discounts?',
        a: 'Yes! Orders of 10+ jugs get a 15-20% discount. Commercial accounts receive custom pricing based on your volume and needs. Contact us to discuss options.',
      },
    ],
  },
  {
    title: 'Delivery & Service',
    icon: '🚚',
    faqs: [
      {
        q: 'Do I need to be home when the water is delivered?',
        a: 'No! Most customers leave a note with their delivery instructions — we place your new jugs and pick up your empties without you needing to be present. Leave instructions in your order notes.',
      },
      {
        q: 'How does the jug return system work?',
        a: 'On your first order, a $12 bottle deposit applies per jug. On every subsequent delivery, our driver swaps your empties for fresh full jugs. You simply leave the empty jugs outside. The deposit stays on account as long as you order.',
      },
      {
        q: 'What if I run out of water between deliveries?',
        a: 'Contact us for a rush delivery (subject to availability and additional fees), or pop into a local grocery store for emergency water. Better yet — subscribe to automatic deliveries so you never run out!',
      },
      {
        q: 'Can I change my delivery schedule?',
        a: 'Absolutely. You can adjust your frequency (weekly, bi-weekly, monthly) or skip a week anytime from your dashboard. Changes take effect on your next scheduled delivery.',
      },
    ],
  },
  {
    title: 'Subscriptions & Loyalty',
    icon: '📅',
    faqs: [
      {
        q: 'How much do I save with a subscription?',
        a: 'Subscriptions save you 20-30% vs. one-off orders. Spring water drops to $6.49/jug, alkaline to $9.49, and distilled to $7.49. Plus, you get priority delivery scheduling.',
      },
      {
        q: 'Do you offer a referral program?',
        a: 'Yes! Refer a friend and both of you get $25 off your next order once they make their first purchase. Unlimited referrals — keep the savings coming.',
      },
      {
        q: 'Can I gift TajWater to someone?',
        a: 'Absolutely! Gift cards available in any denomination. Perfect for housewarming gifts, corporate gifts, or anyone who drinks water (everyone!).',
      },
      {
        q: 'Do you offer seasonal promotions?',
        a: 'Yes, we run seasonal offers throughout the year. Sign up for our newsletter to get exclusive deals and early access to promotions.',
      },
    ],
  },
]

export default function ExpandedFAQ() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([])

  const toggleFaq = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    )
  }

  // Flatten all FAQs for schema
  const allFaqs = faqSections.flatMap((section) => section.faqs)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }

  return (
    <>
      <Script
        id="expanded-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="py-24 bg-white border-t border-[#cce7f0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle className="w-8 h-8 text-[#0097a7]" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340]">
                Comprehensive FAQ
              </h2>
            </div>
            <p className="text-[#4a7fa5] text-lg max-w-2xl mx-auto">
              Everything you need to know about TajWater — from water quality to pricing, delivery, and our subscription options.
            </p>
          </div>

          {/* Tabbed FAQ Sections */}
          <div className="space-y-8">
            {faqSections.map((section, sectionIdx) => (
              <div key={section.title} className="bg-[#f0f9ff] rounded-3xl border-2 border-[#cce7f0] overflow-hidden">
                {/* Section Header */}
                <div className="bg-gradient-to-r from-[#0097a7] to-[#006064] px-6 sm:px-8 py-5">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
                    <span className="text-2xl">{section.icon}</span>
                    {section.title}
                  </h3>
                </div>

                {/* FAQ Items */}
                <div className="divide-y divide-[#cce7f0]">
                  {section.faqs.map((faq, faqIdx) => {
                    const globalIdx = faqSections
                      .slice(0, sectionIdx)
                      .reduce((sum, s) => sum + s.faqs.length, 0) + faqIdx

                    return (
                      <motion.div
                        key={faq.q}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: faqIdx * 0.05 }}
                        className="bg-white"
                      >
                        <button
                          onClick={() => toggleFaq(globalIdx)}
                          className="w-full flex items-center justify-between px-6 sm:px-8 py-5 text-left hover:bg-[#f0f9ff]/50 transition-colors"
                        >
                          <span className="font-semibold text-[#0c2340] text-base sm:text-lg pr-4">
                            {faq.q}
                          </span>
                          <motion.div
                            animate={{ rotate: openIndexes.includes(globalIdx) ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="shrink-0"
                          >
                            <ChevronDown className="w-5 h-5 text-[#0097a7]" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {openIndexes.includes(globalIdx) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <p className="px-6 sm:px-8 pb-5 text-[#4a7fa5] text-sm sm:text-base leading-relaxed">
                                {faq.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="mt-12 bg-gradient-to-r from-[#0097a7] to-[#006064] rounded-3xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-3">Still Have Questions?</h3>
            <p className="mb-6 text-[#b3e5fc]">
              Our customer service team is here to help Monday-Saturday, 7am-7pm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+17785047880"
                className="px-6 py-3 bg-white text-[#0097a7] font-bold rounded-xl hover:shadow-lg transition-shadow"
              >
                📞 Call Us
              </a>
              <a
                href="/contact"
                className="px-6 py-3 bg-white/20 text-white font-bold rounded-xl border-2 border-white/40 hover:bg-white/30 transition-colors"
              >
                ✉️ Send Message
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
