import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

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

  // Handle the nested role object (Supabase returns object or null for single relations)
  const role = profile?.roles as unknown as { name: string } | null
  const isAdmin = role?.name === 'admin'

  return { isAdmin, user }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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
  const { full_name, phone, role_id, is_active } = body

  // Build update object
  const updates: Record<string, unknown> = {}
  if (full_name !== undefined) updates.full_name = full_name
  if (phone !== undefined) updates.phone = phone
  if (role_id !== undefined) updates.role_id = role_id
  if (is_active !== undefined) updates.is_active = is_active

  // Update profile
  const { error: updateError } = await adminClient.from('profiles').update(updates).eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // If is_active changed, update auth user ban status
  if (is_active !== undefined) {
    const { error: banError } = await adminClient.auth.admin.updateUserById(
      id,
      { ban_duration: is_active ? 'none' : '876000h' }, // ~100 years if blocked
    )

    if (banError) {
      console.error('Error updating ban status:', banError)
    }
  }

  // Fetch updated profile
  const supabase = await createClient()
  const { data: updatedProfile } = await supabase
    .from('profiles')
    .select('*, roles(*)')
    .eq('id', id)
    .single()

  return NextResponse.json({ user: updatedProfile })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const adminClient = createAdminClient()

  // Check if current user is admin
  const { isAdmin, user } = await isCurrentUserAdmin()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Prevent self-deletion
  if (user.id === id) {
    return NextResponse.json({ error: 'Невозможно удалить собственный аккаунт' }, { status: 400 })
  }

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Delete user (this will cascade to profile due to FK)
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(id)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
