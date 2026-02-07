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
  const {
    name,
    slug,
    short_description,
    full_description,
    logo_url,
    hero_image_url,
    sort_order,
    is_active,
  } = body

  const updates: Record<string, unknown> = {}
  if (name !== undefined) updates.name = name
  if (slug !== undefined) updates.slug = slug
  if (short_description !== undefined) updates.short_description = short_description
  if (full_description !== undefined) updates.full_description = full_description
  if (logo_url !== undefined) updates.logo_url = logo_url
  if (hero_image_url !== undefined) updates.hero_image_url = hero_image_url
  if (sort_order !== undefined) updates.sort_order = sort_order
  if (is_active !== undefined) updates.is_active = is_active
  updates.updated_at = new Date().toISOString()

  // If slug is being changed, check uniqueness
  if (slug !== undefined) {
    const { data: existing } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Бренд с таким slug уже существует' }, { status: 400 })
    }
  }

  const { data: brand, error } = await supabase
    .from('brands')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ brand })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { isAdmin, user } = await isCurrentUserAdmin()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Soft delete: set is_active = false
  const { error } = await supabase
    .from('brands')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
