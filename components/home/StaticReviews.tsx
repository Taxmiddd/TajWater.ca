import { Star } from 'lucide-react'
import Script from 'next/script'

const reviews = [
  { name: 'Sarah Mitchell', location: 'North Vancouver, BC', rating: 5, text: 'TajWater has been delivering to us for 3 years. Never missed a delivery, always on time, and the water quality is excellent. Best water delivery service in Metro Vancouver.' },
  { name: 'Ahmed Hassan', location: 'Surrey, BC', rating: 5, text: 'We switched our office of 40 people to TajWater\'s commercial supply. The account manager is amazing and billing is so easy. Highly recommend for any business in the Lower Mainland.' },
  { name: 'Jennifer Park', location: 'Richmond, BC', rating: 5, text: 'The water filter installation was done in under 2 hours. Clean, professional, and the water tastes incredible. Worth every penny!' },
  { name: 'Michael Torres', location: 'Burnaby, BC', rating: 5, text: 'I love the subscription plan. I set it up once and it just works. Very convenient — I never run out of water anymore.' },
  { name: 'Lisa Chen', location: 'Vancouver, BC', rating: 5, text: 'As a new mom, having reliable clean water delivered is so important. TajWater\'s team is always friendly and the water is always fresh. I trust them completely.' },
  { name: 'David Nguyen', location: 'Coquitlam, BC', rating: 5, text: 'Switched from a national provider and the difference is night and day. TajWater is cheaper, faster, and the customer service is local — they actually pick up the phone.' },
]

const reviewSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'TajWater',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: String(reviews.length),
    bestRating: '5',
    worstRating: '1',
  },
  review: reviews.map((r) => ({
    '@type': 'Review',
    reviewRating: { '@type': 'Rating', ratingValue: String(r.rating), bestRating: '5' },
    author: { '@type': 'Person', name: r.name },
    reviewBody: r.text,
  })),
}

export default function StaticReviews() {
  return (
    <>
      <Script
        id="review-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <section className="py-24 bg-[#f0f9ff]" aria-labelledby="reviews-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#e0f7fa] text-[#0097a7] text-sm font-semibold mb-3">
              Customer Reviews
            </span>
            <h2 id="reviews-heading" className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-2">
              What Metro Vancouver Customers Say About TajWater
            </h2>
            <p className="text-[#4a7fa5]">
              4.9 stars · Trusted by 2,000+ households and businesses across Metro Vancouver
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="bg-white rounded-2xl border border-[#cce7f0] p-6 flex flex-col gap-3"
                itemScope
                itemType="https://schema.org/Review"
              >
                <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[#0c2340] text-sm leading-relaxed italic" itemProp="reviewBody">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-auto pt-3 border-t border-[#cce7f0]">
                  <p className="font-semibold text-[#0c2340] text-sm" itemProp="author" itemScope itemType="https://schema.org/Person">
                    <span itemProp="name">{review.name}</span>
                  </p>
                  <p className="text-xs text-[#4a7fa5]">{review.location}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
