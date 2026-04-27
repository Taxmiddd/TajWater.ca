import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')?.toUpperCase()
  if (!id || !/^TW-[A-Z0-9]{4}$/.test(id)) {
    return NextResponse.json({ error: 'Invalid payment ID format' }, { status: 400 })
  }

  const db = createServerClient()
  const { data, error } = await db
    .from('payment_links')
    .select('id, status, amount, description, currency')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Payment link not found' }, { status: 404 })
  }

  return NextResponse.json({ id: data.id, status: data.status, amount: data.amount, description: data.description, currency: data.currency })
}
