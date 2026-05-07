import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Water Delivery Tips & Guides — TajWater Blog',
  description: 'Expert guides on drinking water quality in Metro Vancouver, water delivery tips, filter maintenance, and how to choose between spring, alkaline, and distilled water.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Water Delivery Tips & Guides — TajWater Blog',
    description: 'Expert guides on drinking water quality in Metro Vancouver.',
    url: '/blog',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'TajWater Blog' }],
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
