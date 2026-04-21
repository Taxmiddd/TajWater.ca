import { createServerClient } from '@/lib/supabase'
import ShopContent from './ShopContent'

export const dynamic = 'force-dynamic'

async function getProducts() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('category')
  
  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  return data || []
}

export default async function ShopPage() {
  const products = await getProducts()

  return <ShopContent initialProducts={products} />
}
