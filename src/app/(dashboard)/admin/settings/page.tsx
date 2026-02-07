import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, roles(name)')
    .eq('id', user.id)
    .single()

  return profile
}

export default async function AdminSettingsPage() {
  const currentUser = await getCurrentUser()
  const role = currentUser?.roles as unknown as { name: string } | null

  if (!currentUser || role?.name !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
        <p className="mt-1 text-sm text-gray-500">Общие настройки системы</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Company info */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Информация о компании</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-500">Название</dt>
              <dd className="text-sm font-medium text-gray-900">EVRAZIYA Group</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="text-sm font-medium text-gray-900">info@evraziyagroup.com</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Телефон</dt>
              <dd className="text-sm font-medium text-gray-900">+7 (495) 123-45-67</dd>
            </div>
          </dl>
        </div>

        {/* System info */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Системная информация</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-500">Версия</dt>
              <dd className="text-sm font-medium text-gray-900">1.0.0</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Среда</dt>
              <dd className="text-sm font-medium text-gray-900">
                {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Текущий пользователь</dt>
              <dd className="text-sm font-medium text-gray-900">{currentUser.email}</dd>
            </div>
          </dl>
        </div>

        {/* Danger zone */}
        <div className="bg-white shadow rounded-xl p-6 border-2 border-red-200">
          <h2 className="text-lg font-semibold text-red-600 mb-4">Опасная зона</h2>
          <p className="text-sm text-gray-600 mb-4">
            Действия в этом разделе могут привести к необратимым последствиям. Будьте осторожны.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Очистить кэш</p>
                <p className="text-sm text-gray-500">Очистить кэш системы</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Очистить
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Экспорт данных</p>
                <p className="text-sm text-gray-500">Скачать все данные системы</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Экспорт
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
