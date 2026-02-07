import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function isCurrentUserAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { isAdmin: false, user: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role_id, roles(name)')
    .eq('id', user.id)
    .single()

  const role = profile?.roles as unknown as { name: string } | null
  const isAdmin = role?.name === 'admin'

  return { isAdmin, user }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { isAdmin, user } = await isCurrentUserAdmin()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { status, assigned_to, notes } = body

  const updates: Record<string, unknown> = {}
  if (status !== undefined) updates.status = status
  if (assigned_to !== undefined) updates.assigned_to = assigned_to
  if (notes !== undefined) updates.notes = notes
  updates.updated_at = new Date().toISOString()

  const { data: contactRequest, error } = await supabase
    .from('contact_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ contactRequest })
}
