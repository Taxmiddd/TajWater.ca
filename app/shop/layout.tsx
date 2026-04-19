import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop 5-Gallon Water Jugs — Best Prices in Vancouver | TajWater',
  description: 'Order cheap and competitive 5-gallon spring, alkaline, and distilled water jugs online. Fast delivery across Metro Vancouver. Subscribe and save 15% on regular deliveries.',
  keywords: [
    'buy 5 gallon water jug Vancouver',
    'cheap water jug delivery Vancouver',
    'bulk water jugs Vancouver',
    'water dispenser store Vancouver',
    'alkaline 5-gallon water Vancouver',
    'distilled 5-gallon water delivery BC',
    'best price water delivery Vancouver',
    'water subscription Vancouver',
  ],
  openGraph: {
    title: 'Shop — Order Water Online | TajWater Vancouver',
    description: 'Order 20L spring, alkaline & distilled water jugs, dispensers, and accessories. Fast Metro Vancouver delivery. Subscribe and save 15%.',
    url: '/shop',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'TajWater Shop — Order Water Online Vancouver' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop — Order Water Online | TajWater Vancouver',
    description: 'Order 20L jugs, dispensers, and filter products. Fast Metro Vancouver delivery.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/shop',
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}

