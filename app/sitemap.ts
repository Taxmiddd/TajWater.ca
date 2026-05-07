import { MetadataRoute } from 'next'
export const revalidate = 3600

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tajwater.ca'

const CITIES = [
  'vancouver', 'burnaby', 'richmond', 'surrey', 'langley',
  'coquitlam', 'port-coquitlam', 'port-moody', 'north-vancouver',
  'west-vancouver', 'delta', 'maple-ridge', 'pitt-meadows',
  'white-rock', 'squamish', 'whistler', 'cloverdale',
  'langley-township', 'mary-hill', 'tsawwassen', 'walnut-grove',
]

const BLOG_POSTS = [
  { slug: 'spring-vs-alkaline-vs-distilled-water-vancouver', date: '2026-04-15' },
  { slug: 'is-vancouver-tap-water-safe-to-drink', date: '2026-04-22' },
  { slug: 'how-much-does-water-delivery-cost-metro-vancouver', date: '2026-04-29' },
  { slug: 'switching-water-delivery-providers-metro-vancouver', date: '2026-05-06' },
  { slug: 'water-delivery-vs-home-water-filter-metro-vancouver', date: '2026-05-13' },
  { slug: 'best-water-for-babies-toddlers-metro-vancouver', date: '2026-05-20' },
]

const PRODUCT_PAGES = [
  'spring-water-delivery-vancouver',
  'alkaline-water-delivery-vancouver',
  'distilled-water-delivery-vancouver',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/areas`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]

  const productPages: MetadataRoute.Sitemap = PRODUCT_PAGES.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  const cityPages: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${BASE_URL}/areas/${city}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...productPages, ...cityPages, ...blogPages]
}
