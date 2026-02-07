import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface RecentOrder {
  id: string
  order_number: string
  status: string
  total_amount: number | null
  created_at: string
  client: { company_name: string }[] | null
}

interface RecentClient {
  id: string
  company_name: string
  client_type: string
  status: string
  created_at: string
}

async function getStats() {
  const supabase = await createClient()

  // Get counts
  const [clientsResult, ordersResult, brandsResult, productsResult] = await Promise.all([
    supabase.from('clients').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('brands').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
  ])

  return {
    clients: clientsResult.count || 0,
    orders: ordersResult.count || 0,
    brands: brandsResult.count || 0,
    products: productsResult.count || 0,
  }
}

async function getRecentOrders() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('orders')
    .select(
      `
      id,
      order_number,
      status,
      total_amount,
      created_at,
      client:clients(company_name)
    `,
    )
    .order('created_at', { ascending: false })
    .limit(5)

  return data || []
}

async function getRecentClients() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('clients')
    .select('id, company_name, client_type, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return data || []
}

export default async function DashboardPage() {
  const [stats, recentOrders, recentClients] = await Promise.all([
    getStats(),
    getRecentOrders(),
    getRecentClients(),
  ])

  const statCards = [
    { name: 'Клиенты', value: stats.clients, icon: UsersIcon, href: '/dashboard/clients' },
    { name: 'Заказы', value: stats.orders, icon: ShoppingCartIcon, href: '/dashboard/orders' },
    { name: 'Бренды', value: stats.brands, icon: TagIcon, href: '/dashboard/brands' },
    { name: 'Товары', value: stats.products, icon: PackageIcon, href: '/dashboard/products' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Панель управления</h1>
        <p className="mt-1 text-sm text-gray-500">
          Обзор основных показателей и последних действий
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <a
            key={stat.name}
            href={stat.href}
            className="relative overflow-hidden rounded-xl bg-white px-4 py-5 shadow sm:px-6 sm:py-6 hover:shadow-md transition-shadow"
          >
            <dt>
              <div className="absolute rounded-md bg-[#03000d] p-3">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </dd>
          </a>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-xl bg-white shadow">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900">Последние заказы</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentOrders.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                Заказы пока отсутствуют
              </div>
            ) : (
              recentOrders.map((order: RecentOrder) => (
                <div key={order.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="truncate">
                      <p className="text-sm font-medium text-gray-900">{order.order_number}</p>
                      <p className="text-sm text-gray-500">
                        {order.client?.[0]?.company_name || 'Неизвестный клиент'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <OrderStatusBadge status={order.status} />
                      <p className="mt-1 text-sm text-gray-500">
                        {formatAmount(order.total_amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {recentOrders.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 rounded-b-xl">
              <Link
                href="/dashboard/orders"
                className="text-sm font-medium text-[#03000d] hover:text-gray-700"
              >
                Показать все заказы →
              </Link>
            </div>
          )}
        </div>

        {/* Recent clients */}
        <div className="rounded-xl bg-white shadow">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900">Новые клиенты</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentClients.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                Клиенты пока отсутствуют
              </div>
            ) : (
              recentClients.map((client: RecentClient) => (
                <div key={client.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="truncate">
                      <p className="text-sm font-medium text-gray-900">{client.company_name}</p>
                      <p className="text-sm text-gray-500">
                        {client.client_type === 'ip' ? 'ИП' : 'ООО'}
                      </p>
                    </div>
                    <ClientStatusBadge status={client.status} />
                  </div>
                </div>
              ))
            )}
          </div>
          {recentClients.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 rounded-b-xl">
              <Link
                href="/dashboard/clients"
                className="text-sm font-medium text-[#03000d] hover:text-gray-700"
              >
                Показать всех клиентов →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function formatAmount(amount: number | null) {
  if (!amount) return '₽0'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(amount)
}

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  const labels: Record<string, string> = {
    draft: 'Черновик',
    pending: 'Ожидание',
    confirmed: 'Подтвержден',
    processing: 'В обработке',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменен',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}
    >
      {labels[status] || status}
    </span>
  )
}

function ClientStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    blocked: 'bg-red-100 text-red-700',
  }

  const labels: Record<string, string> = {
    active: 'Активен',
    inactive: 'Неактивен',
    blocked: 'Заблокирован',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.inactive}`}
    >
      {labels[status] || status}
    </span>
  )
}

function UsersIcon({ className }: { className?: string }) {
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
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  )
}

function ShoppingCartIcon({ className }: { className?: string }) {
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
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  )
}

function TagIcon({ className }: { className?: string }) {
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
        d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  )
}

function PackageIcon({ className }: { className?: string }) {
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
        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
      />
    </svg>
  )
}
