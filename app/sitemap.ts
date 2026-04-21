import { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase'
export const revalidate = 3600 // revalidate every hour

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tajwater.ca'

const CITIES = [
  'vancouver', 'burnaby', 'richmond', 'surrey', 'langley',
  'coquitlam', 'port-coquitlam', 'port-moody', 'north-vancouver',
  'west-vancouver', 'delta', 'maple-ridge', 'pitt-meadows',
  'white-rock', 'squamish', 'whistler', 'cloverdale',
  'langley-township', 'mary-hill', 'tsawwassen', 'walnut-grove',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/areas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ]

  // City landing pages
  const cityPages: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${BASE_URL}/areas/${city}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Dynamic product pages (Temporarily disabled for stability)
  const productPages: MetadataRoute.Sitemap = []

  return [...staticPages, ...cityPages, ...productPages]
}
