import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'

const posts = [
  {
    slug: 'spring-vs-alkaline-vs-distilled-water-vancouver',
    title: 'Spring vs Alkaline vs Distilled Water: Which Should You Drink in Vancouver?',
    description: 'A plain-English breakdown of the three water types TajWater delivers across Metro Vancouver — what they are, how they differ, and which is right for your household.',
    date: '2026-04-15',
    readTime: '6 min read',
    category: 'Water Guide',
  },
  {
    slug: 'is-vancouver-tap-water-safe-to-drink',
    title: 'Is Vancouver Tap Water Safe to Drink in 2026?',
    description: 'Metro Vancouver tap water meets Health Canada standards — but that doesn\'t mean every tap in the region delivers the same quality. Here\'s what the data actually says.',
    date: '2026-04-22',
    readTime: '7 min read',
    category: 'Water Quality',
  },
  {
    slug: 'how-much-does-water-delivery-cost-metro-vancouver',
    title: 'How Much Does Water Delivery Cost in Metro Vancouver? (2026 Price Guide)',
    description: 'A transparent breakdown of 5-gallon water jug delivery prices across Vancouver, Burnaby, Surrey, Coquitlam, and all Metro Vancouver cities. Compare providers and find the best value.',
    date: '2026-04-29',
    readTime: '5 min read',
    category: 'Pricing',
  },
  {
    slug: 'switching-water-delivery-providers-metro-vancouver',
    title: 'Time to Switch Your Water Delivery Provider in Metro Vancouver?',
    description: 'Missed deliveries, hidden fees, locked contracts — if your current water delivery company isn\'t working for you, switching to a local Metro Vancouver provider is easier than you think.',
    date: '2026-05-06',
    readTime: '6 min read',
    category: "Buyer's Guide",
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#f0f9ff]">
      <section className="py-24 hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold mb-4">
            <BookOpen className="w-3.5 h-3.5" /> TajWater Blog
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Water Delivery Guides for Metro Vancouver
          </h1>
          <p className="text-[#b3e5fc] text-lg max-w-2xl mx-auto">
            Expert articles on water quality, delivery tips, and how to choose the right water for your home or office in BC.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="bg-white rounded-2xl border border-[#cce7f0] p-6 hover:border-[#0097a7]/40 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#e0f7fa] text-[#0097a7]">
                      {post.category}
                    </span>
                    <span className="text-xs text-[#4a7fa5]">{post.date}</span>
                    <span className="text-xs text-[#4a7fa5]">· {post.readTime}</span>
                  </div>
                  <h2 className="text-lg font-extrabold text-[#0c2340] group-hover:text-[#0097a7] transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-[#4a7fa5] text-sm leading-relaxed mb-4">{post.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#0097a7]">
                    Read article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
