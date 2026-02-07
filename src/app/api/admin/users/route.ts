import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function isCurrentUserAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { isAdmin: false, user: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role_id, roles(name)')
    .eq('id', user.id)
    .single()

  // Handle the nested role object (Supabase returns object or null for single relations)
  const role = profile?.roles as unknown as { name: string } | null
  const isAdmin = role?.name === 'admin'

  return { isAdmin, user }
}

export async function GET() {
  const supabase = await createClient()

  // Check if current user is admin
  const { isAdmin, user } = await isCurrentUserAdmin()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Get all users
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*, roles(*)')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ users })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  // Check if current user is admin
  const { isAdmin, user } = await isCurrentUserAdmin()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Parse request body
  const body = await request.json()
  const { email, password, full_name, phone, role_id } = body

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email и пароль обязательны' },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Пароль должен содержать минимум 8 символов' },
      { status: 400 }
    )
  }

  // Create user using admin client
  const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name,
      phone,
    },
  })

  if (createError) {
    if (createError.message.includes('already registered')) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: createError.message }, { status: 500 })
  }

  // Update profile with role
  if (newUser.user && role_id) {
    const { error: updateError } = await adminClient
      .from('profiles')
      .update({
        full_name,
        phone,
        role_id,
      })
      .eq('id', newUser.user.id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
    }
  }

  // Fetch the complete user profile
  const { data: createdProfile } = await supabase
    .from('profiles')
    .select('*, roles(*)')
    .eq('id', newUser.user?.id)
    .single()

  return NextResponse.json({ user: createdProfile }, { status: 201 })
}
