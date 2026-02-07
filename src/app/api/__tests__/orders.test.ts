import { describe, expect, it, vi, beforeEach } from 'vitest'

// Mock the Supabase server client before importing the route
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import { createClient } from '@/lib/supabase/server'
import { GET, POST } from '../orders/route'
import { NextRequest } from 'next/server'

const mockCreateClient = vi.mocked(createClient)

function createMockSupabase(overrides: Record<string, unknown> = {}) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
      }),
    },
    from: vi.fn(),
    ...overrides,
  }
}

describe('GET /api/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when user is not authenticated', async () => {
    const mockSupabase = createMockSupabase()
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
    })
    mockCreateClient.mockResolvedValue(mockSupabase as never)

    const request = new NextRequest('http://localhost:3000/api/orders')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('returns orders with pagination structure', async () => {
    const mockOrders = [
      { id: '1', client_id: 'c1', total_amount: 1000, created_at: '2025-01-01' },
      { id: '2', client_id: 'c2', total_amount: 2000, created_at: '2025-01-02' },
    ]

    const mockRange = vi.fn().mockResolvedValue({
      data: mockOrders,
      error: null,
      count: 2,
    })
    const mockOrder = vi.fn().mockReturnValue({ range: mockRange })
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder })
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

    const mockSupabase = createMockSupabase({ from: mockFrom })
    mockCreateClient.mockResolvedValue(mockSupabase as never)

    const request = new NextRequest('http://localhost:3000/api/orders?page=1&limit=20')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.orders).toEqual(mockOrders)
    expect(data.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 2,
      totalPages: 1,
    })
  })

  it('uses default pagination when no params provided', async () => {
    const mockRange = vi.fn().mockResolvedValue({
      data: [],
      error: null,
      count: 0,
    })
    const mockOrder = vi.fn().mockReturnValue({ range: mockRange })
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder })
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

    const mockSupabase = createMockSupabase({ from: mockFrom })
    mockCreateClient.mockResolvedValue(mockSupabase as never)

    const request = new NextRequest('http://localhost:3000/api/orders')
    const response = await GET(request)
    const data = await response.json()

    expect(data.pagination.page).toBe(1)
    expect(data.pagination.limit).toBe(20)
    // range should be called with (0, 19) for first page with limit 20
    expect(mockRange).toHaveBeenCalledWith(0, 19)
  })

  it('calculates correct offset for page 2', async () => {
    const mockRange = vi.fn().mockResolvedValue({
      data: [],
      error: null,
      count: 50,
    })
    const mockOrder = vi.fn().mockReturnValue({ range: mockRange })
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder })
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

    const mockSupabase = createMockSupabase({ from: mockFrom })
    mockCreateClient.mockResolvedValue(mockSupabase as never)

    const request = new NextRequest('http://localhost:3000/api/orders?page=2&limit=10')
    const response = await GET(request)
    const data = await response.json()

    expect(data.pagination.page).toBe(2)
    expect(data.pagination.limit).toBe(10)
    expect(data.pagination.totalPages).toBe(5)
    // Page 2 with limit 10: offset = (2-1)*10 = 10, range(10, 19)
    expect(mockRange).toHaveBeenCalledWith(10, 19)
  })

  it('returns 500 when database query fails', async () => {
    const mockRange = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
      count: null,
    })
    const mockOrder = vi.fn().mockReturnValue({ range: mockRange })
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder })
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

    const mockSupabase = createMockSupabase({ from: mockFrom })
    mockCreateClient.mockResolvedValue(mockSupabase as never)

    const request = new NextRequest('http://localhost:3000/api/orders')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Database error')
  })
})

describe('POST /api/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when user is not authenticated', async () => {
    const mockSupabase = createMockSupabase()
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
    })
    mockCreateClient.mockResolvedValue(mockSupabase as never)

    const request = new Request('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('returns 400 when request body fails Zod validation (missing client_id)', async () => {
    const mockSupabase = createMockSupabase()
    mockCreateClient.mockResolvedValue(mockSupabase as never)

    const request = new Request('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          {
            product_id: '550e8400-e29b-41d4-a716-446655440001',
            product_name: 'Сумка',
            quantity: 1,
            unit_price: 100,
          },
        ],
      }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Ошибка валидации')
    expect(data.details).toBeDefined()
  })

  it('returns 400 when items array is empty', async () => {
    const mockSupabase = createMockSupabase()
    mockCreateClient.mockResolvedValue(mockSupabase as never)

    const request = new Request('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: '550e8400-e29b-41d4-a716-446655440000',
        items: [],
      }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Ошибка валидации')
  })

  it('returns 400 when client_id is not a valid UUID', async () => {
    const mockSupabase = createMockSupabase()
    mockCreateClient.mockResolvedValue(mockSupabase as never)

    const request = new Request('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: 'invalid-uuid',
        items: [
          {
            product_id: '550e8400-e29b-41d4-a716-446655440001',
            product_name: 'Сумка',
            quantity: 1,
            unit_price: 100,
          },
        ],
      }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Ошибка валидации')
  })

  it('returns 400 when item has invalid product_id', async () => {
    const mockSupabase = createMockSupabase()
    mockCreateClient.mockResolvedValue(mockSupabase as never)

    const request = new Request('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: '550e8400-e29b-41d4-a716-446655440000',
        items: [
          {
            product_id: 'not-a-uuid',
            product_name: 'Сумка',
            quantity: 1,
            unit_price: 100,
          },
        ],
      }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Ошибка валидации')
  })

  it('returns 400 when item quantity is zero', async () => {
    const mockSupabase = createMockSupabase()
    mockCreateClient.mockResolvedValue(mockSupabase as never)

    const request = new Request('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: '550e8400-e29b-41d4-a716-446655440000',
        items: [
          {
            product_id: '550e8400-e29b-41d4-a716-446655440001',
            product_name: 'Сумка',
            quantity: 0,
            unit_price: 100,
          },
        ],
      }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Ошибка валидации')
  })

  it('creates order successfully with valid data', async () => {
    const createdOrder = {
      id: 'order-1',
      client_id: '550e8400-e29b-41d4-a716-446655440000',
      total_amount: 300,
      created_by: 'user-123',
    }

    const completeOrder = {
      ...createdOrder,
      items: [
        {
          product_id: '550e8400-e29b-41d4-a716-446655440001',
          product_name: 'Сумка',
          quantity: 3,
          unit_price: 100,
        },
      ],
    }

    // Chain for order insert: from('orders').insert(...).select().single()
    const mockOrderSingle = vi.fn().mockResolvedValue({
      data: createdOrder,
      error: null,
    })
    const mockOrderSelect = vi.fn().mockReturnValue({ single: mockOrderSingle })
    const mockOrderInsert = vi.fn().mockReturnValue({ select: mockOrderSelect })

    // Chain for order_items insert: from('order_items').insert(...)
    const mockItemsInsert = vi.fn().mockResolvedValue({ error: null })

    // Chain for final fetch: from('orders').select(...).eq(...).single()
    const mockFetchSingle = vi.fn().mockResolvedValue({
      data: completeOrder,
      error: null,
    })
    const mockFetchEq = vi.fn().mockReturnValue({ single: mockFetchSingle })
    const mockFetchSelect = vi.fn().mockReturnValue({ eq: mockFetchEq })

    let fromCallCount = 0
    const mockFrom = vi.fn().mockImplementation((table: string) => {
      if (table === 'orders') {
        fromCallCount++
        if (fromCallCount === 1) {
          return { insert: mockOrderInsert }
        }
        // Third call (second 'orders') is for the complete fetch
        return { select: mockFetchSelect }
      }
      if (table === 'order_items') {
        return { insert: mockItemsInsert }
      }
      return {}
    })

    const mockSupabase = createMockSupabase({ from: mockFrom })
    mockCreateClient.mockResolvedValue(mockSupabase as never)

    const request = new Request('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: '550e8400-e29b-41d4-a716-446655440000',
        items: [
          {
            product_id: '550e8400-e29b-41d4-a716-446655440001',
            product_name: 'Сумка',
            quantity: 3,
            unit_price: 100,
          },
        ],
      }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.order).toEqual(completeOrder)
  })
})
