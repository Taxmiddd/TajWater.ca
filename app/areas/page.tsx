import { createServerClient } from '@/lib/supabase'
import AreasContent from './AreasContent'

export const dynamic = 'force-dynamic'

async function getZones() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('zones')
    .select('name, delivery_fee, schedule')
    .eq('active', true)
  
  if (error) {
    console.error('Error fetching zones:', error)
    return []
  }
  return data || []
}

export default async function AreasPage() {
  const zones = await getZones()

  return <AreasContent initialDbZones={zones} />
}
