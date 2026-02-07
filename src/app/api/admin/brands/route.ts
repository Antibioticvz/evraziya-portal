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

export async function GET() {
  const supabase = await createClient()

  const { isAdmin, user } = await isCurrentUserAdmin()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: brands, error } = await supabase
    .from('brands')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ brands })
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const { isAdmin, user } = await isCurrentUserAdmin()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { name, slug, description, logo_url, sort_order, is_active } = body

  if (!name || !slug) {
    return NextResponse.json({ error: 'Название и slug обязательны' }, { status: 400 })
  }

  // Check slug uniqueness
  const { data: existing } = await supabase.from('brands').select('id').eq('slug', slug).single()

  if (existing) {
    return NextResponse.json({ error: 'Бренд с таким slug уже существует' }, { status: 400 })
  }

  const { data: brand, error } = await supabase
    .from('brands')
    .insert({
      name,
      slug,
      description: description || null,
      logo_url: logo_url || null,
      sort_order: sort_order ?? 0,
      is_active: is_active ?? true,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ brand }, { status: 201 })
}
