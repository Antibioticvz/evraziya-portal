'use client'

import { Fragment, useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface ContactRequest {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  message: string | null
  status: string
  notes: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string | null
}

const STATUS_TABS = [
  { key: 'all', label: 'Все' },
  { key: 'new', label: 'Новые' },
  { key: 'in_progress', label: 'В работе' },
  { key: 'completed', label: 'Завершённые' },
] as const

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  new: {
    label: 'Новая',
    className: 'bg-blue-100 text-blue-700',
  },
  in_progress: {
    label: 'В работе',
    className: 'bg-yellow-100 text-yellow-700',
  },
  completed: {
    label: 'Завершена',
    className: 'bg-green-100 text-green-700',
  },
  spam: {
    label: 'Спам',
    className: 'bg-red-100 text-red-700',
  },
}

export default function AdminContactRequestsPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingNotes, setEditingNotes] = useState<string>('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const limit = 20

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      if (activeTab !== 'all') {
        params.set('status', activeTab)
      }

      const response = await fetch(`/api/admin/contact-requests?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка загрузки заявок')
      }

      setRequests(data.contactRequests || [])
      setTotal(data.total || 0)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }, [page, activeTab])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id)

    try {
      const response = await fetch(`/api/admin/contact-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка обновления статуса')
      }

      setRequests(requests.map((r) => (r.id === id ? { ...r, ...data.contactRequest } : r)))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleSaveNotes = async (id: string) => {
    setUpdatingId(id)

    try {
      const response = await fetch(`/api/admin/contact-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: editingNotes }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка сохранения заметок')
      }

      setRequests(requests.map((r) => (r.id === id ? { ...r, ...data.contactRequest } : r)))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setPage(1)
    setExpandedId(null)
  }

  const handleExpand = (request: ContactRequest) => {
    if (expandedId === request.id) {
      setExpandedId(null)
    } else {
      setExpandedId(request.id)
      setEditingNotes(request.notes || '')
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Заявки</h1>
        <p className="mt-1 text-sm text-gray-500">Управление контактными заявками с сайта</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Status filter tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={cn(
                'whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'border-[#03000d] text-[#03000d]'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Имя
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Телефон
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Компания
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Загрузка...
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Заявки не найдены
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <Fragment key={request.id}>
                  <tr
                    onClick={() => handleExpand(request)}
                    className={cn(
                      'hover:bg-gray-50 cursor-pointer transition-colors',
                      expandedId === request.id && 'bg-gray-50',
                    )}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.phone || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.company || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          STATUS_CONFIG[request.status]?.className || 'bg-gray-100 text-gray-700',
                        )}
                      >
                        {STATUS_CONFIG[request.status]?.label || request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleDateString('ru-RU')}
                    </td>
                  </tr>

                  {/* Expanded row */}
                  {expandedId === request.id && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          {/* Message */}
                          {request.message && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Сообщение</h4>
                              <p className="text-sm text-gray-600 whitespace-pre-wrap bg-white p-3 rounded-lg border border-gray-200">
                                {request.message}
                              </p>
                            </div>
                          )}

                          {/* Status change */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Изменить статус
                            </h4>
                            <div className="flex gap-2">
                              {(['new', 'in_progress', 'completed', 'spam'] as const).map(
                                (status) => (
                                  <button
                                    key={status}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleStatusChange(request.id, status)
                                    }}
                                    disabled={
                                      updatingId === request.id || request.status === status
                                    }
                                    className={cn(
                                      'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                                      request.status === status
                                        ? 'ring-2 ring-[#03000d] ring-offset-1'
                                        : 'hover:opacity-80',
                                      STATUS_CONFIG[status]?.className ||
                                        'bg-gray-100 text-gray-700',
                                      (updatingId === request.id || request.status === status) &&
                                        'opacity-50 cursor-not-allowed',
                                    )}
                                  >
                                    {STATUS_CONFIG[status]?.label || status}
                                  </button>
                                ),
                              )}
                            </div>
                          </div>

                          {/* Notes */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Заметки</h4>
                            <textarea
                              value={editingNotes}
                              onChange={(e) => setEditingNotes(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              placeholder="Добавьте заметку..."
                              rows={3}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#03000d] focus:outline-none focus:ring-1 focus:ring-[#03000d]"
                            />
                            <div className="mt-2 flex justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSaveNotes(request.id)
                                }}
                                disabled={updatingId === request.id}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#03000d] rounded-lg hover:bg-[#03000d]/90 transition-colors disabled:opacity-50"
                              >
                                {updatingId === request.id ? 'Сохранение...' : 'Сохранить заметку'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Показано {(page - 1) * limit + 1}–{Math.min(page * limit, total)} из {total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Назад
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Вперёд
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
