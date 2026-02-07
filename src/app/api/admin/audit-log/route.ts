import { NextRequest, NextResponse } from 'next/server'
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

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { isAdmin, user } = await isCurrentUserAdmin()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const action = searchParams.get('action')
  const tableName = searchParams.get('table_name')
  const offset = (page - 1) * limit

  let query = supabase
    .from('audit_logs')
    .select('*, profiles(full_name, email)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (action) {
    query = query.eq('action', action)
  }

  if (tableName) {
    query = query.eq('table_name', tableName)
  }

  const { data: logs, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    logs,
    total: count || 0,
    page,
    limit,
  })
}
