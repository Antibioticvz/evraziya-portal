import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UserManagement } from './user-management'

async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, role:roles(*)')
    .eq('id', user.id)
    .single()

  return profile
}

async function getUsers() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('profiles')
    .select('*, role:roles(*)')
    .order('created_at', { ascending: false })

  return data || []
}

async function getRoles() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('roles')
    .select('*')
    .order('name')

  return data || []
}

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role?.name !== 'admin') {
    redirect('/dashboard')
  }

  const [users, roles] = await Promise.all([
    getUsers(),
    getRoles(),
  ])

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление пользователями</h1>
          <p className="mt-1 text-sm text-gray-500">
            Создание, редактирование и управление правами доступа пользователей
          </p>
        </div>
      </div>

      <UserManagement
        initialUsers={users}
        roles={roles}
        currentUserId={currentUser.id}
      />
    </div>
  )
}
