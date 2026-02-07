'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientType, setClientType] = useState<'ip' | 'ooo'>('ooo')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const clientData = {
      client_type: clientType,
      company_name: formData.get('company_name'),
      trade_name: formData.get('trade_name') || null,
      inn: formData.get('inn'),
      kpp: clientType === 'ooo' ? formData.get('kpp') : null,
      ogrn: formData.get('ogrn'),
      legal_address: formData.get('legal_address'),
      actual_address: formData.get('actual_address') || null,
      ceo_name: formData.get('ceo_name') || null,
      ceo_position: formData.get('ceo_position') || null,
      status: 'active',
    }

    const { error: insertError } = await supabase.from('clients').insert(clientData)

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard/clients')
    router.refresh()
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/clients"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Назад к списку клиентов
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Добавить клиента</h1>
        <p className="mt-1 text-sm text-gray-500">Заполните информацию о новом B2B клиенте</p>
      </div>

      <div className="bg-white shadow rounded-xl p-6 max-w-3xl">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Client Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Тип клиента *</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="client_type"
                  value="ooo"
                  checked={clientType === 'ooo'}
                  onChange={() => setClientType('ooo')}
                  className="h-4 w-4 text-[#03000d] focus:ring-[#03000d] border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">ООО (Юридическое лицо)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="client_type"
                  value="ip"
                  checked={clientType === 'ip'}
                  onChange={() => setClientType('ip')}
                  className="h-4 w-4 text-[#03000d] focus:ring-[#03000d] border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">
                  ИП (Индивидуальный предприниматель)
                </span>
              </label>
            </div>
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
                  placeholder={clientType === 'ip' ? 'ИП Иванов Иван Иванович' : 'ООО "Компания"'}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Торговое наименование
                </label>
                <Input type="text" name="trade_name" placeholder="Бренд или торговая марка" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Реквизиты</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ИНН *</label>
                <Input
                  type="text"
                  name="inn"
                  required
                  maxLength={clientType === 'ip' ? 12 : 10}
                  pattern={clientType === 'ip' ? '[0-9]{12}' : '[0-9]{10}'}
                  placeholder={clientType === 'ip' ? '123456789012' : '1234567890'}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {clientType === 'ip' ? '12 цифр для ИП' : '10 цифр для ООО'}
                </p>
              </div>

              {clientType === 'ooo' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">КПП *</label>
                  <Input
                    type="text"
                    name="kpp"
                    required
                    maxLength={9}
                    pattern="[0-9]{9}"
                    placeholder="123456789"
                  />
                  <p className="mt-1 text-xs text-gray-500">9 цифр</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {clientType === 'ip' ? 'ОГРНИП *' : 'ОГРН *'}
                </label>
                <Input
                  type="text"
                  name="ogrn"
                  required
                  maxLength={clientType === 'ip' ? 15 : 13}
                  pattern={clientType === 'ip' ? '[0-9]{15}' : '[0-9]{13}'}
                  placeholder={clientType === 'ip' ? '123456789012345' : '1234567890123'}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {clientType === 'ip' ? '15 цифр для ОГРНИП' : '13 цифр для ОГРН'}
                </p>
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
                  placeholder="123456, г. Москва, ул. Примерная, д. 1, оф. 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Фактический адрес
                </label>
                <Input
                  type="text"
                  name="actual_address"
                  placeholder="Если отличается от юридического"
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
                <Input type="text" name="ceo_name" placeholder="Иванов Иван Иванович" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Должность</label>
                <Input
                  type="text"
                  name="ceo_position"
                  placeholder={
                    clientType === 'ip' ? 'Индивидуальный предприниматель' : 'Генеральный директор'
                  }
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6 flex justify-end gap-3">
            <Link href="/dashboard/clients">
              <Button type="button" variant="outline">
                Отмена
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? 'Сохранение...' : 'Создать клиента'}
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
