/**
 * Server-rendered introduction content for SEO.
 * This component provides keyword-rich, crawlable content that is visible on page load.
 * No client-side rendering—pure HTML for maximum search engine visibility.
 */

export default function IntroContent() {
  return (
    <section className="py-16 bg-white border-t border-[#cce7f0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none text-[#4a7fa5]">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-6">
            Vancouver's Most Trusted Water Delivery Service — Serving 21 Cities
          </h2>
          
          <p className="text-lg leading-relaxed mb-6 text-[#4a7fa5]">
            TajWater is Metro Vancouver's #1 provider of premium 5-gallon water jug delivery. We've been serving thousands of households and businesses across 21 delivery zones since 2019, delivering fresh, independently tested spring water, alkaline water, and distilled water to your doorstep — fast, affordable, and guaranteed fresh.
          </p>

          <h3 className="text-2xl font-bold text-[#0c2340] mt-8 mb-4">
            Why Choose TajWater for Your Water Delivery?
          </h3>

          <ul className="space-y-3 mb-6 list-none pl-0">
            <li className="flex items-start gap-3">
              <span className="text-[#0097a7] font-bold text-xl mt-0.5">✓</span>
              <span><strong className="text-[#0c2340]">Same-Day Delivery Available:</strong> Order before 12pm and receive your water the same day across most Metro Vancouver zones. Next-day delivery always available.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0097a7] font-bold text-xl mt-0.5">✓</span>
              <span><strong className="text-[#0c2340]">Free Delivery on All Orders:</strong> No hidden fees, no minimum order. Whether you order 1 jug or 10, delivery is always included on every order across all 21 service areas.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0097a7] font-bold text-xl mt-0.5">✓</span>
              <span><strong className="text-[#0c2340]">Three Water Varieties:</strong> Spring water ($8.99/jug), alkaline water ($12.99/jug), and distilled water ($9.99/jug). All delivered in food-grade, BPA-free 5-gallon (20L) jugs.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0097a7] font-bold text-xl mt-0.5">✓</span>
              <span><strong className="text-[#0c2340]">Flexible Jug Swap System:</strong> No minimum commitment. Leave your empties on delivery day; our driver swaps them for full jugs. One-time $12 bottle deposit per jug.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0097a7] font-bold text-xl mt-0.5">✓</span>
              <span><strong className="text-[#0c2340]">Subscription Discounts:</strong> Set up weekly, bi-weekly, or monthly deliveries and pay from just $6.49/jug. Pause or cancel anytime—no fees.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#0097a7] font-bold text-xl mt-0.5">✓</span>
              <span><strong className="text-[#0c2340]">Commercial Solutions:</strong> Bulk water delivery for offices, restaurants, gyms, and warehouses. Custom pricing, invoicing, and dedicated account support.</span>
            </li>
          </ul>

          <h3 className="text-2xl font-bold text-[#0c2340] mt-8 mb-4">
            Water Delivery Across Metro Vancouver
          </h3>

          <p className="text-lg leading-relaxed mb-6 text-[#4a7fa5]">
            We deliver fresh 5-gallon water jugs to homes and businesses across the entire Metro Vancouver region. Our service areas include:
          </p>

          <div className="bg-[#f0f9ff] rounded-2xl border border-[#cce7f0] p-6 mb-6">
            <p className="text-[#0c2340] text-sm leading-relaxed">
              <strong>Greater Vancouver:</strong> Vancouver, Burnaby, Richmond, Surrey, North Vancouver, West Vancouver, Delta, and White Rock.
              <br /><br />
              <strong>Tri-Cities:</strong> Coquitlam, Port Coquitlam, Port Moody, and Maple Ridge.
              <br /><br />
              <strong>Eastern Municipalities:</strong> Langley City, Langley Township, and Pitt Meadows.
              <br /><br />
              <strong>Sea-to-Sky Corridor:</strong> Squamish and Whistler.
            </p>
          </div>

          <p className="text-lg leading-relaxed mb-6 text-[#4a7fa5]">
            Each service area has its own delivery schedule. We deliver Monday through Saturday, with same-day delivery available on most weekdays for orders placed before noon. Choose from daily, weekly, bi-weekly, or monthly delivery options that fit your household or business needs.
          </p>

          <h3 className="text-2xl font-bold text-[#0c2340] mt-8 mb-4">
            Pure Water Delivered Fresh Every Time
          </h3>

          <p className="text-lg leading-relaxed mb-6 text-[#4a7fa5]">
            Every TajWater jug is filled fresh, quality-tested, and delivered to your door in premium 5-gallon (20-litre) BPA-free containers. We source from independently verified water treatment facilities across BC and maintain strict sanitization standards for all jugs.
          </p>

          <p className="text-lg leading-relaxed mb-6 text-[#4a7fa5]">
            Whether you need water for everyday drinking and cooking, post-workout hydration, or specialized medical and lab use, TajWater has the perfect solution. Order online or call us today — same-day delivery available now.
          </p>
        </div>
      </div>
    </section>
  )
}
