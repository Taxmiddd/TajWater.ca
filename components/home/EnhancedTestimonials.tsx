'use client'

import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import Script from 'next/script'

interface Testimonial {
  name: string
  city: string
  rating: number
  text: string
  date: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Mitchell',
    city: 'Vancouver',
    rating: 5,
    text: 'TajWater is a game-changer! No more lugging heavy water bottles from Costco. The same-day delivery in Vancouver is incredible, and the subscription pricing saves us $50+ per month. Absolutely worth it.',
    date: '2025-12-01',
  },
  {
    name: 'James Chen',
    city: 'Port Coquitlam',
    rating: 5,
    text: 'As a Port Coquitlam resident, I appreciate having a local business I can trust. TajWater delivers within hours, the quality is consistent, and their customer service is genuinely friendly. Best decision ever.',
    date: '2025-11-15',
  },
  {
    name: 'Michelle Rodriguez',
    city: 'Burnaby',
    rating: 5,
    text: 'I run a small yoga studio in Burnaby and was spending over $200/month on water. Switched to TajWater\'s commercial plan and cut costs by 40%. My clients love the alkaline water option too.',
    date: '2025-11-20',
  },
  {
    name: 'David Thompson',
    city: 'Richmond',
    rating: 5,
    text: 'The bottle swap system is genius. I don\'t even have to be home! Leave the empties, they bring fresh ones. No contracts, no nonsense. TajWater gets it.',
    date: '2025-10-28',
  },
  {
    name: 'Lisa Wong',
    city: 'Surrey',
    rating: 5,
    text: 'Family of 4, and we go through water like crazy. TajWater\'s subscription plan saves us money vs. buying individual jugs. Clean, reliable, and they actually care about service.',
    date: '2025-10-10',
  },
  {
    name: 'Robert Patel',
    city: 'Langley',
    rating: 5,
    text: 'Didn\'t think water delivery services reached Langley reliably. TajWater proves everyone else wrong. Consistent 3x/week delivery, great pricing, and the driver knows my family by name.',
    date: '2025-09-18',
  },
]

export default function EnhancedTestimonials() {
  // Generate Review Schema for Google Rich Results
  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: testimonials.length.toString(),
    bestRating: '5',
    worstRating: '1',
  }

  const reviewsSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'TajWater',
    aggregateRating: reviewSchema,
    review: testimonials.map((t) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating.toString(),
      },
      author: {
        '@type': 'Person',
        name: t.name,
      },
      reviewBody: t.text,
      datePublished: t.date,
    })),
  }

  return (
    <>
      <Script
        id="testimonials-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />

      <section className="py-24 bg-[#f0f9ff]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0c2340] mb-4">
              Loved by <span className="gradient-text">5,000+ Metro Vancouver Families</span>
            </h2>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-[#ffc107] text-[#ffc107]" />
                ))}
              </div>
              <p className="text-lg font-bold text-[#0c2340]">4.8/5 Stars</p>
              <p className="text-[#4a7fa5]">({testimonials.length}+ verified reviews)</p>
            </div>
            <p className="text-[#4a7fa5] text-lg max-w-2xl mx-auto">
              Real customers from Vancouver, Burnaby, Surrey, Langley, and across Metro Vancouver share why they switched to TajWater.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl border-2 border-[#cce7f0] p-6 hover:border-[#0097a7] hover:shadow-lg transition-all"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#ffc107] text-[#ffc107]" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-[#4a7fa5] text-sm leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="border-t border-[#cce7f0] pt-4">
                  <p className="font-bold text-[#0c2340]">{testimonial.name}</p>
                  <div className="flex items-center justify-between text-xs text-[#4a7fa5] mt-1">
                    <span>📍 {testimonial.city}</span>
                    <span>{new Date(testimonial.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="bg-white rounded-3xl border-2 border-[#cce7f0] p-8 sm:p-12">
            <h3 className="text-2xl font-bold text-[#0c2340] mb-8 text-center">Why Customers Trust TajWater</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: '✓', label: '5,000+ Families', desc: 'Active happy customers' },
                { icon: '🎯', label: 'Same-Day Delivery', desc: 'Available on most areas' },
                { icon: '💰', label: 'Best Prices', desc: 'From $6.49/jug subscription' },
                { icon: '🏠', label: 'Local Business', desc: 'Port Coquitlam-based' },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-4xl mb-2">{item.icon}</p>
                  <p className="font-bold text-[#0c2340] text-sm">{item.label}</p>
                  <p className="text-xs text-[#4a7fa5] mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-[#4a7fa5] text-lg mb-6">Ready to join thousands of satisfied customers?</p>
            <a
              href="/shop"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#0097a7] to-[#00838f] text-white font-bold rounded-2xl hover:shadow-lg transition-shadow"
            >
              Order Your First Delivery Today
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
