import { describe, expect, it, vi, beforeEach } from 'vitest'

// Mock the Supabase server client before importing the route
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import { createClient } from '@/lib/supabase/server'
import { POST } from '../contact/route'

const mockCreateClient = vi.mocked(createClient)

function createRequest(body: Record<string, unknown>, headers?: Record<string, string>): Request {
  return new Request('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 when required fields are missing', async () => {
    const request = createRequest({ name: 'Иван' })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Все обязательные поля должны быть заполнены')
  })

  it('returns 400 when name is empty', async () => {
    const request = createRequest({
      name: '',
      email: 'test@example.com',
      phone: '+7 999 123 45 67',
      message: 'Тестовое сообщение',
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Все обязательные поля должны быть заполнены')
  })

  it('returns 400 when email is invalid', async () => {
    const request = createRequest({
      name: 'Иван',
      email: 'not-an-email',
      phone: '+7 999 123 45 67',
      message: 'Тестовое сообщение',
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Неверный формат email')
  })

  it('returns 400 when email has no domain', async () => {
    const request = createRequest({
      name: 'Иван',
      email: 'user@',
      phone: '+7 999 123 45 67',
      message: 'Тестовое сообщение',
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Неверный формат email')
  })

  it('returns 400 when phone is missing', async () => {
    const request = createRequest({
      name: 'Иван',
      email: 'test@example.com',
      phone: '',
      message: 'Тестовое сообщение',
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Все обязательные поля должны быть заполнены')
  })

  it('returns 400 when message is missing', async () => {
    const request = createRequest({
      name: 'Иван',
      email: 'test@example.com',
      phone: '+7 999 123 45 67',
      message: '',
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Все обязательные поля должны быть заполнены')
  })

  it('returns success when all fields are valid', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert })
    mockCreateClient.mockResolvedValue({ from: mockFrom } as never)

    const request = createRequest({
      name: 'Иван Петров',
      email: 'ivan@example.com',
      phone: '+7 999 123 45 67',
      company: 'ООО Ромашка',
      message: 'Хочу стать партнером',
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toBe('Заявка успешно отправлена')
  })

  it('stores contact request in database with correct data', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert })
    mockCreateClient.mockResolvedValue({ from: mockFrom } as never)

    const request = createRequest(
      {
        name: 'Иван Петров',
        email: 'ivan@example.com',
        phone: '+7 999 123 45 67',
        company: 'ООО Ромашка',
        message: 'Хочу стать партнером',
      },
      { referer: 'http://localhost:3000/kontakty' },
    )
    await POST(request)

    expect(mockFrom).toHaveBeenCalledWith('contact_requests')
    expect(mockInsert).toHaveBeenCalledWith({
      name: 'Иван Петров',
      email: 'ivan@example.com',
      phone: '+7 999 123 45 67',
      company: 'ООО Ромашка',
      message: 'Хочу стать партнером',
      source_page: '/kontakty',
      status: 'new',
    })
  })

  it('sets company to null when not provided', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert })
    mockCreateClient.mockResolvedValue({ from: mockFrom } as never)

    const request = createRequest({
      name: 'Иван',
      email: 'ivan@example.com',
      phone: '+7 999 123 45 67',
      message: 'Тест',
    })
    await POST(request)

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        company: null,
      }),
    )
  })

  it('returns 500 when database insert fails with non-table error', async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      error: { message: 'Connection refused' },
    })
    const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert })
    mockCreateClient.mockResolvedValue({ from: mockFrom } as never)

    const request = createRequest({
      name: 'Иван',
      email: 'ivan@example.com',
      phone: '+7 999 123 45 67',
      message: 'Тест',
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Ошибка при отправке формы')
  })

  it('continues successfully when table does not exist error occurs', async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      error: { message: 'relation "contact_requests" does not exist' },
    })
    const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert })
    mockCreateClient.mockResolvedValue({ from: mockFrom } as never)

    const request = createRequest({
      name: 'Иван',
      email: 'ivan@example.com',
      phone: '+7 999 123 45 67',
      message: 'Тест',
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })
})
