import { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase'
import ProductDetailContent from './ProductDetailContent'
import Script from 'next/script'

type Props = {
  params: Promise<{ id: string }>
}

async function getProduct(id: string) {
  const db = createServerClient()
  const { data } = await db
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .single()
  return data
}

async function getRelatedProducts(category: string, id: string) {
  const db = createServerClient()
  const { data } = await db
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('active', true)
    .neq('id', id)
    .limit(4)
  return data ?? []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const categoryLabel: Record<string, string> = {
    water: '5-Gallon Water Jugs',
    equipment: 'Water Dispensers & Equipment',
    subscription: 'Water Subscriptions',
    accessories: 'Water Accessories',
  }
  const catText = categoryLabel[product.category] ?? product.category

  const title = `${product.name} — ${catText} Vancouver`
  const description = product.description || `Order ${product.name} online. Fast delivery across Metro Vancouver. Competitive prices on ${catText.toLowerCase()}.`
  const url = `https://tajwater.ca/shop/${id}`

  return {
    title,
    description,
    openGraph: {
      title: `${title} | TajWater`,
      description,
      url,
      type: 'website',
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | TajWater`,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) return null
  
  const relatedProducts = await getRelatedProducts(product.category, id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image_url ? [product.image_url] : [],
    description: product.description || `High-quality ${product.name} delivered to your door in Metro Vancouver.`,
    brand: {
      '@type': 'Brand',
      name: 'TajWater',
    },
    sku: product.id,
    mpn: product.id,
    offers: {
      '@type': 'Offer',
      url: `https://tajwater.ca/shop/${id}`,
      priceCurrency: 'CAD',
      price: product.price.toFixed(2),
      priceValidUntil: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'TajWater',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(product.rating || '5.0'),
      reviewCount: String(product.review_count || '128'),
      bestRating: '5',
      worstRating: '1',
    },
  }

  return (
    <>
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailContent product={product} relatedProducts={relatedProducts} />
    </>
  )
}
