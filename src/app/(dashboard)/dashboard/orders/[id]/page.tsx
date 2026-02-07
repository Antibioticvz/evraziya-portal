'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { OrderStatus } from '@/types/database'

interface OrderDetailItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

interface OrderDetail {
  id: string
  order_number: string
  client_id: string
  status: OrderStatus
  total_amount: number
  currency: string
  payment_terms: string | null
  delivery_address: string | null
  notes: string | null
  created_at: string
  updated_at: string
  client: { id: string; company_name: string; inn: string } | null
  items: OrderDetailItem[]
}

const statusStyles: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const statusLabels: Record<string, string> = {
  draft: 'Черновик',
  pending: 'Ожидает',
  confirmed: 'Подтверждён',
  processing: 'В работе',
  shipped: 'Отгружен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}

const statusTransitions: Record<string, string[]> = {
  draft: ['pending', 'cancelled'],
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
}

function formatCurrency(amount: number, currency = 'RUB') {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true)
      try {
        const res = await fetch(`/api/orders/${id}`)
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Ошибка загрузки заказа')
        }
        const json = await res.json()
        setOrder(json.order)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return
    setUpdating(true)

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Ошибка обновления статуса')
      }

      const json = await res.json()
      setOrder(json.order)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-xl p-12 text-center text-gray-500">
        Загрузка заказа...
      </div>
    )
  }

  if (error || !order) {
    return (
      <div>
        <Link
          href="/dashboard/orders"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Назад к списку заказов
        </Link>
        <div className="bg-white shadow rounded-xl p-12 text-center text-red-600">
          {error || 'Заказ не найден'}
        </div>
      </div>
    )
  }

  const availableTransitions = statusTransitions[order.status] || []

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/orders"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Назад к списку заказов
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Заказ {order.order_number || `#${order.id.slice(0, 8)}`}
              </h1>
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  statusStyles[order.status] || statusStyles.draft,
                )}
              >
                {statusLabels[order.status] || order.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Создан {new Date(order.created_at).toLocaleDateString('ru-RU')}
            </p>
          </div>

          {availableTransitions.length > 0 && (
            <div className="flex gap-2">
              {availableTransitions.map((status) => (
                <Button
                  key={status}
                  variant={status === 'cancelled' ? 'outline' : 'default'}
                  size="sm"
                  disabled={updating}
                  onClick={() => handleStatusChange(status)}
                >
                  {statusLabels[status]}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order items */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Товары</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">
                    Товар
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase pb-3">
                    Кол-во
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase pb-3">
                    Цена
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase pb-3">
                    Сумма
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items?.length ? (
                  order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 text-sm text-gray-900">{item.product_name}</td>
                      <td className="py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                      <td className="py-3 text-sm text-gray-900 text-right">
                        {formatCurrency(item.unit_price, order.currency)}
                      </td>
                      <td className="py-3 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(item.total_price, order.currency)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-500 text-sm">
                      Нет товаров
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200">
                  <td colSpan={3} className="py-3 text-sm font-semibold text-gray-900 text-right">
                    Итого:
                  </td>
                  <td className="py-3 text-lg font-bold text-gray-900 text-right">
                    {formatCurrency(order.total_amount, order.currency)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Примечания</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Клиент</h2>
            {order.client ? (
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">Компания</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    <Link
                      href={`/dashboard/clients/${order.client.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {order.client.company_name}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">ИНН</dt>
                  <dd className="text-sm font-medium text-gray-900 font-mono">
                    {order.client.inn}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-gray-500">Клиент не указан</p>
            )}
          </div>

          {/* Delivery */}
          {order.delivery_address && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Доставка</h2>
              <p className="text-sm text-gray-600">{order.delivery_address}</p>
            </div>
          )}

          {/* Payment */}
          {order.payment_terms && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Оплата</h2>
              <p className="text-sm text-gray-600">{order.payment_terms}</p>
            </div>
          )}

          {/* Meta info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Информация</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Создан</dt>
                <dd className="text-gray-900">
                  {new Date(order.created_at).toLocaleDateString('ru-RU')}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Обновлён</dt>
                <dd className="text-gray-900">
                  {new Date(order.updated_at).toLocaleDateString('ru-RU')}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Валюта</dt>
                <dd className="text-gray-900">{order.currency}</dd>
              </div>
            </dl>
          </div>
        </div>
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
