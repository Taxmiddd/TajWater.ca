import { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase'
import ProductDetailContent from './ProductDetailContent'
import Script from 'next/script'

type Props = {
  params: Promise<{ slug: string[] }>
}

async function getProduct(slugOrId: string) {
  const db = createServerClient()
  const { data } = await db
    .from('products')
    .select('*')
    .or(`id.eq.${slugOrId},slug.eq.${slugOrId}`)
    .eq('active', true)
    .limit(1)
  return Array.isArray(data) ? data[0] : null
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
  const { slug: paramSlug } = await params
  const slugOrId = paramSlug?.[0] ?? ''
  const product = await getProduct(slugOrId)

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

  const slug = product.slug || product.id
  const title = `${product.name} — ${catText} Vancouver`
  const description = product.description || `Order ${product.name} online. Fast delivery across Metro Vancouver. Competitive prices on ${catText.toLowerCase()}.`
  const url = `https://tajwater.ca/shop/${slug}`

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Taj Water`,
      description,
      url,
      type: 'website',
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Taj Water`,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug: paramSlug } = await params
  const slugOrId = paramSlug?.[0] ?? ''
  const product = await getProduct(slugOrId)
  
  if (!product) return null
  
  const relatedProducts = await getRelatedProducts(product.category, product.id)

  const slug = product.slug || product.id
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image_url ? [product.image_url] : [],
    description: product.description || `High-quality ${product.name} delivered to your door in Metro Vancouver.`,
    brand: {
      '@type': 'Brand',
      name: 'Taj Water',
    },
    sku: product.id,
    mpn: product.id,
    offers: {
      '@type': 'Offer',
      url: `https://tajwater.ca/shop/${slug}`,
      priceCurrency: 'CAD',
      price: product.price.toFixed(2),
      priceValidUntil: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Taj Water',
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
