import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Benefits of Alkaline Water for Athletes | Taj Water Blog',
  description: 'Discover how alkaline water can improve hydration, balance pH levels, and enhance athletic performance for athletes in Metro Vancouver.',
  keywords: ['alkaline water benefits', 'alkaline water athletes', 'hydration for athletes', 'water delivery Vancouver', 'Taj Water'],
}

export default function BlogPost() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-[#0c2340] mb-6">The Benefits of Alkaline Water for Athletes</h1>
      <p className="text-sm text-[#4a7fa5] mb-8">Published on {new Date().toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })} • 4 min read</p>
      
      <div className="prose prose-lg prose-blue max-w-none text-[#4a7fa5]">
        <p>
          For athletes and fitness enthusiasts in Metro Vancouver, hydration is more than just drinking water—it's about maximizing performance and recovery. 
          Alkaline water has gained immense popularity in the sports community, and for good reason.
        </p>

        <h2 className="text-2xl font-bold text-[#0c2340] mt-8 mb-4">1. Enhanced Hydration</h2>
        <p>
          Alkaline water typically has a higher pH level (usually between 8 and 9) compared to regular tap water. 
          Many athletes report that it tastes smoother, making it easier to consume in larger quantities during intense workouts.
          Proper hydration is key to preventing cramps and maintaining endurance.
        </p>

        <h2 className="text-2xl font-bold text-[#0c2340] mt-8 mb-4">2. Acid-Base Balance</h2>
        <p>
          Intense physical activity can lead to an increase in lactic acid in the muscles, which causes fatigue and soreness. 
          Consuming alkaline water may help neutralize the acid buildup in the bloodstream, potentially leading to faster recovery times and less post-workout soreness.
        </p>

        <h2 className="text-2xl font-bold text-[#0c2340] mt-8 mb-4">3. Rich in Essential Minerals</h2>
        <p>
          High-quality alkaline water, like the one provided by Taj Water, contains trace amounts of essential minerals such as calcium, magnesium, and potassium. 
          These electrolytes are crucial for muscle function and replacing what is lost through sweat.
        </p>

        <div className="bg-[#f0f9ff] p-6 rounded-2xl mt-12 border border-[#cce7f0]">
          <h3 className="text-xl font-bold text-[#0c2340] mb-4">Ready to upgrade your hydration?</h3>
          <p className="mb-4">Taj Water offers premium alkaline water delivery across Metro Vancouver. Keep your home or gym stocked effortlessly.</p>
          <Link href="/alkaline-water-delivery-vancouver" className="text-[#0097a7] font-bold hover:underline">
            Learn more about our Alkaline Water Delivery →
          </Link>
        </div>
      </div>
    </article>
  )
}
