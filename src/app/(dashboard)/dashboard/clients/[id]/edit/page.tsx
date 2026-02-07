'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

interface Client {
  id: string
  client_type: 'ip' | 'ooo'
  status: string
  company_name: string
  trade_name: string | null
  inn: string
  kpp: string | null
  ogrn: string
  legal_address: string
  actual_address: string | null
  ceo_name: string | null
  ceo_position: string | null
  phone: string | null
  email: string | null
  website: string | null
  notes: string | null
}

export default function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [client, setClient] = useState<Client | null>(null)
  const [clientId, setClientId] = useState<string>('')

  useEffect(() => {
    const load = async (id: string) => {
      const supabase = createClient()
      const { data, error } = await supabase.from('clients').select('*').eq('id', id).single()

      if (error || !data) {
        setError('Клиент не найден')
        setLoading(false)
        return
      }

      setClient(data)
      setLoading(false)
    }

    params.then(({ id }) => {
      setClientId(id)
      load(id)
    })
  }, [params])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const updates = {
      company_name: formData.get('company_name'),
      trade_name: formData.get('trade_name') || null,
      legal_address: formData.get('legal_address'),
      actual_address: formData.get('actual_address') || null,
      ceo_name: formData.get('ceo_name') || null,
      ceo_position: formData.get('ceo_position') || null,
      phone: formData.get('phone') || null,
      email: formData.get('email') || null,
      website: formData.get('website') || null,
      notes: formData.get('notes') || null,
      status: formData.get('status'),
    }

    const { error: updateError } = await supabase.from('clients').update(updates).eq('id', clientId)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    router.push(`/dashboard/clients/${clientId}`)
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-gray-900 rounded-full" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{error || 'Клиент не найден'}</p>
        <Link href="/dashboard/clients" className="text-blue-600 hover:underline mt-4 inline-block">
          Вернуться к списку
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/dashboard/clients/${clientId}`}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Назад к клиенту
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Редактирование клиента</h1>
        <p className="mt-1 text-sm text-gray-500">{client.company_name}</p>
      </div>

      <div className="bg-white shadow rounded-xl p-6 max-w-3xl">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
            <select
              name="status"
              defaultValue={client.status}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#03000d] focus:outline-none focus:ring-1 focus:ring-[#03000d]"
            >
              <option value="active">Активен</option>
              <option value="inactive">Неактивен</option>
              <option value="blocked">Заблокирован</option>
            </select>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Основная информация</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Наименование компании *
                </label>
                <Input
                  type="text"
                  name="company_name"
                  required
                  defaultValue={client.company_name}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Торговое наименование
                </label>
                <Input type="text" name="trade_name" defaultValue={client.trade_name || ''} />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Реквизиты</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ИНН</label>
                <Input type="text" value={client.inn} disabled className="bg-gray-50" />
                <p className="mt-1 text-xs text-gray-500">ИНН нельзя изменить</p>
              </div>

              {client.client_type === 'ooo' && client.kpp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">КПП</label>
                  <Input type="text" value={client.kpp} disabled className="bg-gray-50" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {client.client_type === 'ip' ? 'ОГРНИП' : 'ОГРН'}
                </label>
                <Input type="text" value={client.ogrn} disabled className="bg-gray-50" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Адреса</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Юридический адрес *
                </label>
                <Input
                  type="text"
                  name="legal_address"
                  required
                  defaultValue={client.legal_address}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Фактический адрес
                </label>
                <Input
                  type="text"
                  name="actual_address"
                  defaultValue={client.actual_address || ''}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Руководство</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ФИО руководителя
                </label>
                <Input type="text" name="ceo_name" defaultValue={client.ceo_name || ''} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Должность</label>
                <Input type="text" name="ceo_position" defaultValue={client.ceo_position || ''} />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Контакты</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                <Input type="tel" name="phone" defaultValue={client.phone || ''} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input type="email" name="email" defaultValue={client.email || ''} />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Сайт</label>
                <Input type="url" name="website" defaultValue={client.website || ''} />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Дополнительно</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Заметки</label>
              <textarea
                name="notes"
                rows={4}
                defaultValue={client.notes || ''}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#03000d] focus:outline-none focus:ring-1 focus:ring-[#03000d] resize-none"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6 flex justify-end gap-3">
            <Link href={`/dashboard/clients/${clientId}`}>
              <Button type="button" variant="outline">
                Отмена
              </Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}
