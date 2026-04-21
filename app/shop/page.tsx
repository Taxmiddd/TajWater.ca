import ShopContent from './ShopContent'

// Moving fetch back to client side to avoid 503 errors on the serverless functions.
// The interactive UI and SEO metadata are still preserved.
export default function ShopPage() {
  return <ShopContent initialProducts={[]} />
}
