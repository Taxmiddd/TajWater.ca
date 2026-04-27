import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// ── Update a payment link (admin) ─────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const db = createServerClient()

  // Only allow updating status field from admin (never square_payment_id)
  const allowed = ['status', 'internal_note']
  const update: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) update[key] = body[key]
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const { data, error } = await db
    .from('payment_links')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// ── Delete a payment link (admin) ─────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = createServerClient()

  // Prevent deletion of paid links (they serve as receipts)
  const { data: existing } = await db.from('payment_links').select('status').eq('id', id).single()
  if (existing?.status === 'paid') {
    return NextResponse.json({ error: 'Paid payment links cannot be deleted — they serve as receipts.' }, { status: 403 })
  }

  const { error } = await db.from('payment_links').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
