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
      title: 'Product Not Found | TajWater',
    }
  }

  const title = `${product.name} — Buy 5-Gallon Water Jugs Vancouver | TajWater`
  const description = product.description || `Cheap and competitive ${product.name} delivery in Vancouver. Best prices for 5-gallon water jugs and dispensers.`
  const url = `https://tajwater.ca/shop/${id}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
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
    image: product.image_url,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'TajWater',
    },
    offers: {
      '@type': 'Offer',
      url: `https://tajwater.ca/shop/${id}`,
      priceCurrency: 'CAD',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'TajWater',
      },
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
