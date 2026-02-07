'use client'

import { Fragment, useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface AuditLog {
  id: string
  user_id: string | null
  action: string
  table_name: string
  record_id: string | null
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  created_at: string
  profiles: {
    full_name: string | null
    email: string
  } | null
}

const ACTION_LABELS: Record<string, string> = {
  INSERT: 'Создание',
  UPDATE: 'Обновление',
  DELETE: 'Удаление',
}

const ACTION_COLORS: Record<string, string> = {
  INSERT: 'bg-green-100 text-green-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
}

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterAction, setFilterAction] = useState<string>('')
  const [filterTable, setFilterTable] = useState<string>('')
  const limit = 20

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      if (filterAction) {
        params.set('action', filterAction)
      }
      if (filterTable) {
        params.set('table_name', filterTable)
      }

      const response = await fetch(`/api/admin/audit-log?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка загрузки аудит-лога')
      }

      setLogs(data.logs || [])
      setTotal(data.total || 0)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }, [page, filterAction, filterTable])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const handleFilterChange = (type: 'action' | 'table', value: string) => {
    if (type === 'action') {
      setFilterAction(value)
    } else {
      setFilterTable(value)
    }
    setPage(1)
    setExpandedId(null)
  }

  const totalPages = Math.ceil(total / limit)

  const renderDiff = (
    oldData: Record<string, unknown> | null,
    newData: Record<string, unknown> | null,
  ) => {
    if (!oldData && !newData) {
      return <p className="text-sm text-gray-500">Нет данных для отображения</p>
    }

    const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})])

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-3 py-2 text-left font-medium text-gray-500">Поле</th>
              <th className="px-3 py-2 text-left font-medium text-gray-500">Старое значение</th>
              <th className="px-3 py-2 text-left font-medium text-gray-500">Новое значение</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(allKeys).map((key) => {
              const oldVal = oldData?.[key]
              const newVal = newData?.[key]
              const changed = JSON.stringify(oldVal) !== JSON.stringify(newVal)

              return (
                <tr key={key} className={cn('border-b border-gray-100', changed && 'bg-yellow-50')}>
                  <td className="px-3 py-2 font-mono text-gray-700">{key}</td>
                  <td className="px-3 py-2 text-gray-500">
                    {oldVal !== undefined ? formatValue(oldVal) : '—'}
                  </td>
                  <td className="px-3 py-2 text-gray-900">
                    {newVal !== undefined ? formatValue(newVal) : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Аудит лог</h1>
        <p className="mt-1 text-sm text-gray-500">Журнал всех изменений в системе</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Действие</label>
          <select
            value={filterAction}
            onChange={(e) => handleFilterChange('action', e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#03000d] focus:outline-none focus:ring-1 focus:ring-[#03000d]"
          >
            <option value="">Все действия</option>
            <option value="INSERT">Создание</option>
            <option value="UPDATE">Обновление</option>
            <option value="DELETE">Удаление</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Таблица</label>
          <select
            value={filterTable}
            onChange={(e) => handleFilterChange('table', e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#03000d] focus:outline-none focus:ring-1 focus:ring-[#03000d]"
          >
            <option value="">Все таблицы</option>
            <option value="profiles">profiles</option>
            <option value="brands">brands</option>
            <option value="products">products</option>
            <option value="orders">orders</option>
            <option value="contact_requests">contact_requests</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Пользователь
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действие
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Таблица
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID записи
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Загрузка...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Записи не найдены
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <Fragment key={log.id}>
                  <tr
                    onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                    className={cn(
                      'hover:bg-gray-50 cursor-pointer transition-colors',
                      expandedId === log.id && 'bg-gray-50',
                    )}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.profiles?.full_name || log.profiles?.email || 'Система'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-700',
                        )}
                      >
                        {ACTION_LABELS[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {log.table_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {log.record_id ? `${log.record_id.substring(0, 8)}...` : '—'}
                    </td>
                  </tr>

                  {/* Expanded row with diff */}
                  {expandedId === log.id && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-700">Изменения</h4>
                          {renderDiff(log.old_data, log.new_data)}
                          {log.record_id && (
                            <p className="text-xs text-gray-400 font-mono">
                              Полный ID: {log.record_id}
                            </p>
                          )}
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

function formatValue(value: unknown): string {
  if (value === null) return 'null'
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}
