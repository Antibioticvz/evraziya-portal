'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createOrderSchema } from '@/lib/validations/order'
import { createClient } from '@/lib/supabase/client'

import type { z } from 'zod'

type CreateOrderInput = z.input<typeof createOrderSchema>

interface ClientOption {
  id: string
  company_name: string
}

interface ProductOption {
  id: string
  name: string
  sku: string | null
}

export default function NewOrderPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [clients, setClients] = useState<ClientOption[]>([])
  const [products, setProducts] = useState<ProductOption[]>([])

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      client_id: '',
      status: 'draft',
      payment_terms: '',
      delivery_address: '',
      notes: '',
      items: [{ product_id: '', product_name: '', quantity: 1, unit_price: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const watchedItems = watch('items')

  const totalAmount = watchedItems.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0
    const price = Number(item.unit_price) || 0
    return sum + qty * price
  }, 0)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const [clientsRes, productsRes] = await Promise.all([
        supabase
          .from('clients')
          .select('id, company_name')
          .eq('status', 'active')
          .order('company_name'),
        supabase.from('products').select('id, name, sku').eq('is_active', true).order('name'),
      ])

      if (clientsRes.data) setClients(clientsRes.data)
      if (productsRes.data) setProducts(productsRes.data)
    }

    fetchData()
  }, [])

  const onSubmit = async (data: CreateOrderInput) => {
    setSubmitting(true)
    setServerError(null)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Ошибка создания заказа')
      }

      router.push('/dashboard/orders')
      router.refresh()
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/orders"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Назад к списку заказов
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Создать заказ</h1>
        <p className="mt-1 text-sm text-gray-500">Заполните информацию о новом заказе</p>
      </div>

      <div className="bg-white shadow rounded-xl p-6 max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {serverError}
            </div>
          )}

          {/* Client selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Клиент *</label>
            <select
              {...register('client_id')}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="">Выберите клиента</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.company_name}
                </option>
              ))}
            </select>
            {errors.client_id && (
              <p className="mt-1 text-sm text-red-600">{errors.client_id.message}</p>
            )}
          </div>

          {/* Order details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Детали заказа</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Условия оплаты
                </label>
                <Input type="text" {...register('payment_terms')} placeholder="Предоплата 100%" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Адрес доставки
                </label>
                <Input
                  type="text"
                  {...register('delivery_address')}
                  placeholder="г. Москва, ул. Примерная, д. 1"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Примечания</label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="Дополнительная информация к заказу"
                />
              </div>
            </div>
          </div>

          {/* Order items */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Товары</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ product_id: '', product_name: '', quantity: 1, unit_price: 0 })
                }
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Добавить товар
              </Button>
            </div>

            {errors.items?.root && (
              <p className="mb-4 text-sm text-red-600">{errors.items.root.message}</p>
            )}

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-3 items-start border border-gray-200 rounded-lg p-4"
                >
                  <div className="col-span-5">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Товар</label>
                    <select
                      {...register(`items.${index}.product_id`)}
                      onChange={(e) => {
                        const productId = e.target.value
                        const product = products.find((p) => p.id === productId)
                        setValue(`items.${index}.product_id`, productId)
                        setValue(`items.${index}.product_name`, product?.name || '')
                      }}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    >
                      <option value="">Выберите товар</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                          {product.sku ? ` (${product.sku})` : ''}
                        </option>
                      ))}
                    </select>
                    <input type="hidden" {...register(`items.${index}.product_name`)} />
                    {errors.items?.[index]?.product_id && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.items[index].product_id?.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Кол-во</label>
                    <Input
                      type="number"
                      min={1}
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    />
                    {errors.items?.[index]?.quantity && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.items[index].quantity?.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Цена, руб.
                    </label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      {...register(`items.${index}.unit_price`, { valueAsNumber: true })}
                    />
                    {errors.items?.[index]?.unit_price && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.items[index].unit_price?.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 flex items-end justify-between pt-5">
                    <span className="text-sm font-medium text-gray-900">
                      {new Intl.NumberFormat('ru-RU', {
                        style: 'currency',
                        currency: 'RUB',
                        minimumFractionDigits: 0,
                      }).format(
                        (Number(watchedItems[index]?.quantity) || 0) *
                          (Number(watchedItems[index]?.unit_price) || 0),
                      )}
                    </span>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-400 hover:text-red-600 ml-2"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 flex justify-end">
              <div className="text-right">
                <span className="text-sm text-gray-500">Итого: </span>
                <span className="text-lg font-bold text-gray-900">
                  {new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                    minimumFractionDigits: 0,
                  }).format(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6 flex justify-end gap-3">
            <Link href="/dashboard/orders">
              <Button type="button" variant="outline">
                Отмена
              </Button>
            </Link>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Создание...' : 'Создать заказ'}
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

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  )
}
