'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export default function NewContactPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientId, setClientId] = useState<string>('')

  useEffect(() => {
    params.then(({ id }) => setClientId(id))
  }, [params])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const contactData = {
      client_id: clientId,
      full_name: formData.get('full_name'),
      position: formData.get('position') || null,
      phone: formData.get('phone') || null,
      email: formData.get('email') || null,
      contact_type: formData.get('contact_type') || 'general',
      is_primary: formData.get('is_primary') === 'on',
    }

    const { error: insertError } = await supabase.from('client_contacts').insert(contactData)

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push(`/dashboard/clients/${clientId}`)
    router.refresh()
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
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Добавить контактное лицо</h1>
      </div>

      <div className="bg-white shadow rounded-xl p-6 max-w-2xl">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ФИО *</label>
              <Input type="text" name="full_name" required placeholder="Иванов Иван Иванович" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Должность</label>
              <Input type="text" name="position" placeholder="Менеджер по закупкам" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                <Input type="tel" name="phone" placeholder="+7 (999) 123-45-67" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input type="email" name="email" placeholder="email@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тип контакта</label>
              <select
                name="contact_type"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#03000d] focus:outline-none focus:ring-1 focus:ring-[#03000d]"
              >
                <option value="general">Общий</option>
                <option value="sales">Продажи</option>
                <option value="accounting">Бухгалтерия</option>
                <option value="logistics">Логистика</option>
                <option value="management">Руководство</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_primary"
                id="is_primary"
                className="h-4 w-4 rounded border-gray-300 text-[#03000d] focus:ring-[#03000d]"
              />
              <label htmlFor="is_primary" className="ml-2 text-sm text-gray-700">
                Основной контакт
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Link href={`/dashboard/clients/${clientId}`}>
              <Button type="button" variant="outline">
                Отмена
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? 'Сохранение...' : 'Добавить контакт'}
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
