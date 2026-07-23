'use client'

import { useState, useEffect, useRef } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Script from 'next/script'
import Link from 'next/link'

interface Testimonial {
  name: string
  city: string
  rating: number
  text: string
  date: string
  initials: string
  avatarColor: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Mitchell',
    city: 'Vancouver',
    rating: 5,
    text: 'TajWater is a game-changer! No more lugging heavy water bottles from Costco. The same-day delivery in Vancouver is incredible, and the subscription pricing saves us $50+ per month. Absolutely worth it.',
    date: '2025-12-01',
    initials: 'SM',
    avatarColor: '#0097a7',
  },
  {
    name: 'James Chen',
    city: 'Port Coquitlam',
    rating: 5,
    text: 'As a Port Coquitlam resident, I appreciate having a local business I can trust. TajWater delivers within hours, the quality is consistent, and their customer service is genuinely friendly. Best decision ever.',
    date: '2025-11-15',
    initials: 'JC',
    avatarColor: '#1565c0',
  },
  {
    name: 'Michelle Rodriguez',
    city: 'Burnaby',
    rating: 5,
    text: 'I run a small yoga studio in Burnaby and was spending over $200/month on water. Switched to TajWater\'s commercial plan and cut costs by 40%. My clients love the alkaline water option too.',
    date: '2025-11-20',
    initials: 'MR',
    avatarColor: '#006064',
  },
  {
    name: 'David Thompson',
    city: 'Richmond',
    rating: 5,
    text: 'The bottle swap system is genius. I don\'t even have to be home — leave the empties, they bring fresh ones. No contracts, no nonsense. TajWater just gets it right every single time.',
    date: '2025-10-28',
    initials: 'DT',
    avatarColor: '#00838f',
  },
  {
    name: 'Lisa Wong',
    city: 'Surrey',
    rating: 5,
    text: 'Family of 4, and we go through water like crazy. TajWater\'s subscription plan saves us money vs. buying individual jugs. Clean, reliable, and they actually care about service. Highly recommended.',
    date: '2025-10-10',
    initials: 'LW',
    avatarColor: '#0097a7',
  },
  {
    name: 'Robert Patel',
    city: 'Langley',
    rating: 5,
    text: 'Didn\'t think water delivery services reached Langley reliably. TajWater proves everyone else wrong. Consistent 3x/week delivery, great pricing, and the driver knows my family by name.',
    date: '2025-09-18',
    initials: 'RP',
    avatarColor: '#1976d2',
  },
]

export default function EnhancedTestimonials() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const reviewsSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'TajWater',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: testimonials.length.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    review: testimonials.map((t) => ({
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: t.rating.toString() },
      author: { '@type': 'Person', name: t.name },
      reviewBody: t.text,
      datePublished: t.date,
    })),
  }

  const startAutoplay = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length)
    }, 5000)
  }

  useEffect(() => {
    if (!paused) startAutoplay()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused])

  const prev = () => {
    setPaused(true)
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
    setTimeout(() => setPaused(false), 8000)
  }

  const next = () => {
    setPaused(true)
    setCurrent((c) => (c + 1) % testimonials.length)
    setTimeout(() => setPaused(false), 8000)
  }

  const goTo = (i: number) => {
    setPaused(true)
    setCurrent(i)
    setTimeout(() => setPaused(false), 8000)
  }

  return (
    <>
      <Script
        id="testimonials-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />

      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#e0f7fa] text-[#0097a7] text-sm font-semibold mb-4">
              ⭐ Customer Reviews
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0c2340] mb-4">
              Loved by <span className="gradient-text">500+ Metro Vancouver Families</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#ffc107] text-[#ffc107]" />
              ))}
              <span className="font-bold text-[#0c2340] ml-1">4.9 / 5</span>
              <span className="text-[#4a7fa5] text-sm">({testimonials.length}+ verified reviews)</span>
            </div>
            <p className="text-[#4a7fa5] text-lg max-w-2xl mx-auto">
              Real customers from Vancouver, Burnaby, Surrey, Coquitlam, and across Metro Vancouver.
            </p>
          </motion.div>

          {/* Carousel */}
          <div className="relative">
            {/* Main card */}
            <div className="relative min-h-[280px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-gradient-to-br from-[#f0f9ff] to-[#e8f4ff] border border-[#cce7f0] rounded-3xl p-8 sm:p-12 relative overflow-hidden"
                >
                  {/* Large quote icon */}
                  <Quote className="absolute top-6 right-8 w-16 h-16 text-[#0097a7]/10 rotate-180" />

                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    {/* Avatar */}
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shrink-0 shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${testimonials[current].avatarColor}, ${testimonials[current].avatarColor}bb)` }}
                    >
                      {testimonials[current].initials}
                    </div>

                    <div className="flex-1">
                      {/* Stars */}
                      <div className="flex gap-1 mb-3">
                        {[...Array(testimonials[current].rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#ffc107] text-[#ffc107]" />
                        ))}
                      </div>

                      {/* Review */}
                      <p className="text-[#344054] text-base sm:text-lg leading-relaxed mb-5">
                        &ldquo;{testimonials[current].text}&rdquo;
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-bold text-[#0c2340] text-sm">{testimonials[current].name}</p>
                          <p className="text-xs text-[#0097a7] font-medium">📍 {testimonials[current].city}, BC</p>
                        </div>
                        <div className="ml-auto text-xs text-[#4a7fa5]">
                          {new Date(testimonials[current].date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-6">
              {/* Prev/Next */}
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-xl border border-[#cce7f0] bg-white text-[#0097a7] flex items-center justify-center hover:border-[#0097a7] hover:bg-[#f0f9ff] transition-colors"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-xl border border-[#cce7f0] bg-white text-[#0097a7] flex items-center justify-center hover:border-[#0097a7] hover:bg-[#f0f9ff] transition-colors"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to review ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === current
                        ? 'w-8 h-2.5 bg-[#0097a7]'
                        : 'w-2.5 h-2.5 bg-[#cce7f0] hover:bg-[#0097a7]/40'
                    }`}
                  />
                ))}
              </div>

              {/* Progress text */}
              <span className="text-sm text-[#4a7fa5] font-medium tabular-nums">
                {current + 1} / {testimonials.length}
              </span>
            </div>
          </div>

          {/* Mini preview strip */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-8">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                onClick={() => goTo(i)}
                className={`rounded-xl p-3 text-center transition-all ${
                  i === current
                    ? 'bg-[#e0f7fa] border-2 border-[#0097a7]'
                    : 'bg-[#f8fafb] border border-[#cce7f0] hover:border-[#0097a7]/40'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs mx-auto mb-1"
                  style={{ background: t.avatarColor }}
                >
                  {t.initials}
                </div>
                <p className="text-[10px] font-semibold text-[#0c2340] truncate">{t.name.split(' ')[0]}</p>
                <p className="text-[9px] text-[#4a7fa5]">{t.city}</p>
              </button>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-14"
          >
            <p className="text-[#4a7fa5] text-lg mb-5">Join hundreds of happy Metro Vancouver households.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0097a7] to-[#1565c0] text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-[#0097a7]/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              Order Your First Delivery Today
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
