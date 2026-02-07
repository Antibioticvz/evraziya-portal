'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export default function NewBankDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
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

    const bankData = {
      client_id: clientId,
      bank_name: formData.get('bank_name'),
      bik: formData.get('bik'),
      correspondent_account: formData.get('correspondent_account'),
      settlement_account: formData.get('settlement_account'),
      is_primary: formData.get('is_primary') === 'on',
    }

    // Validate BIK
    const bik = bankData.bik as string
    if (!/^\d{9}$/.test(bik)) {
      setError('БИК должен содержать 9 цифр')
      setLoading(false)
      return
    }

    // Validate accounts
    const corrAccount = bankData.correspondent_account as string
    const settlAccount = bankData.settlement_account as string

    if (!/^\d{20}$/.test(corrAccount)) {
      setError('Корреспондентский счёт должен содержать 20 цифр')
      setLoading(false)
      return
    }

    if (!/^\d{20}$/.test(settlAccount)) {
      setError('Расчётный счёт должен содержать 20 цифр')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase
      .from('client_bank_details')
      .insert(bankData)

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
        <h1 className="text-2xl font-bold text-gray-900 mt-4">
          Добавить банковские реквизиты
        </h1>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Наименование банка *
              </label>
              <Input
                type="text"
                name="bank_name"
                required
                placeholder="АО «Тинькофф Банк»"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                БИК *
              </label>
              <Input
                type="text"
                name="bik"
                required
                maxLength={9}
                pattern="[0-9]{9}"
                placeholder="044525974"
              />
              <p className="mt-1 text-xs text-gray-500">9 цифр</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Корреспондентский счёт *
              </label>
              <Input
                type="text"
                name="correspondent_account"
                required
                maxLength={20}
                pattern="[0-9]{20}"
                placeholder="30101810145250000974"
                className="font-mono"
              />
              <p className="mt-1 text-xs text-gray-500">20 цифр</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Расчётный счёт *
              </label>
              <Input
                type="text"
                name="settlement_account"
                required
                maxLength={20}
                pattern="[0-9]{20}"
                placeholder="40702810100000000001"
                className="font-mono"
              />
              <p className="mt-1 text-xs text-gray-500">20 цифр</p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_primary"
                id="is_primary"
                className="h-4 w-4 rounded border-gray-300 text-[#03000d] focus:ring-[#03000d]"
              />
              <label htmlFor="is_primary" className="ml-2 text-sm text-gray-700">
                Использовать как основной счёт
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
              {loading ? 'Сохранение...' : 'Добавить реквизиты'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}
