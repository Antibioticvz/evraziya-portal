import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

async function getClient(id: string) {
  const supabase = await createClient()

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  return client
}

async function getClientBankDetails(clientId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('client_bank_details')
    .select('*')
    .eq('client_id', clientId)
    .order('is_primary', { ascending: false })

  return data || []
}

async function getClientContacts(clientId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('client_contacts')
    .select('*')
    .eq('client_id', clientId)
    .order('is_primary', { ascending: false })

  return data || []
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [client, bankDetails, contacts] = await Promise.all([
    getClient(id),
    getClientBankDetails(id),
    getClientContacts(id),
  ])

  if (!client) {
    notFound()
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/clients"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Назад к списку клиентов
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {client.company_name}
              </h1>
              <ClientStatusBadge status={client.status} />
            </div>
            {client.trade_name && (
              <p className="text-gray-500 mt-1">{client.trade_name}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Link href={`/dashboard/clients/${id}/edit`}>
              <Button variant="outline">
                <EditIcon className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company details */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Реквизиты компании
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Тип</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {client.client_type === 'ip' ? 'ИП' : 'ООО'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">ИНН</dt>
                <dd className="text-sm font-medium text-gray-900 font-mono">
                  {client.inn}
                </dd>
              </div>
              {client.kpp && (
                <div>
                  <dt className="text-sm text-gray-500">КПП</dt>
                  <dd className="text-sm font-medium text-gray-900 font-mono">
                    {client.kpp}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-gray-500">
                  {client.client_type === 'ip' ? 'ОГРНИП' : 'ОГРН'}
                </dt>
                <dd className="text-sm font-medium text-gray-900 font-mono">
                  {client.ogrn}
                </dd>
              </div>
            </dl>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Адреса
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-500">Юридический адрес</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {client.legal_address}
                </dd>
              </div>
              {client.actual_address && (
                <div>
                  <dt className="text-sm text-gray-500">Фактический адрес</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {client.actual_address}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Bank details */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Банковские реквизиты
              </h2>
              <Link href={`/dashboard/clients/${id}/bank/new`}>
                <Button variant="outline" size="sm">
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Добавить
                </Button>
              </Link>
            </div>

            {bankDetails.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Банковские реквизиты не добавлены
              </p>
            ) : (
              <div className="space-y-4">
                {bankDetails.map((bank) => (
                  <div
                    key={bank.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {bank.bank_name}
                          </span>
                          {bank.is_primary && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              Основной
                            </span>
                          )}
                        </div>
                        <dl className="mt-2 text-sm grid grid-cols-2 gap-2">
                          <div>
                            <dt className="text-gray-500">БИК</dt>
                            <dd className="font-mono">{bank.bik}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">К/с</dt>
                            <dd className="font-mono">{bank.correspondent_account}</dd>
                          </div>
                          <div className="col-span-2">
                            <dt className="text-gray-500">Р/с</dt>
                            <dd className="font-mono">{bank.settlement_account}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contacts */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Контактные лица
              </h2>
              <Link href={`/dashboard/clients/${id}/contacts/new`}>
                <Button variant="outline" size="sm">
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Добавить
                </Button>
              </Link>
            </div>

            {contacts.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Контактные лица не добавлены
              </p>
            ) : (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {contact.full_name}
                        </span>
                        {contact.is_primary && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            Основной
                          </span>
                        )}
                      </div>
                      {contact.position && (
                        <p className="text-sm text-gray-500">{contact.position}</p>
                      )}
                    </div>
                    <div className="text-right text-sm">
                      {contact.phone && (
                        <a href={`tel:${contact.phone}`} className="text-gray-600 hover:text-gray-900 block">
                          {contact.phone}
                        </a>
                      )}
                      {contact.email && (
                        <a href={`mailto:${contact.email}`} className="text-gray-600 hover:text-gray-900 block">
                          {contact.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* CEO info */}
          {(client.ceo_name || client.ceo_position) && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Руководство
              </h2>
              <dl className="space-y-2">
                {client.ceo_name && (
                  <div>
                    <dt className="text-sm text-gray-500">ФИО</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {client.ceo_name}
                    </dd>
                  </div>
                )}
                {client.ceo_position && (
                  <div>
                    <dt className="text-sm text-gray-500">Должность</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {client.ceo_position}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Contact info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Контакты компании
            </h2>
            <dl className="space-y-3">
              {client.phone && (
                <div>
                  <dt className="text-sm text-gray-500">Телефон</dt>
                  <dd>
                    <a
                      href={`tel:${client.phone}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      {client.phone}
                    </a>
                  </dd>
                </div>
              )}
              {client.email && (
                <div>
                  <dt className="text-sm text-gray-500">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${client.email}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      {client.email}
                    </a>
                  </dd>
                </div>
              )}
              {client.website && (
                <div>
                  <dt className="text-sm text-gray-500">Сайт</dt>
                  <dd>
                    <a
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      {client.website}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Meta info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Информация
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Создан</dt>
                <dd className="text-gray-900">
                  {new Date(client.created_at).toLocaleDateString('ru-RU')}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Обновлён</dt>
                <dd className="text-gray-900">
                  {new Date(client.updated_at).toLocaleDateString('ru-RU')}
                </dd>
              </div>
            </dl>
          </div>

          {/* Notes */}
          {client.notes && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Заметки
              </h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {client.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.inactive}`}>
      {labels[status] || status}
    </span>
  )
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}
