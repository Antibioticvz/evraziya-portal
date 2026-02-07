import { describe, expect, it } from 'vitest'

import { createOrderSchema, orderItemSchema, orderStatusEnum, updateOrderSchema } from '../order'

describe('orderStatusEnum', () => {
  it('accepts all valid statuses', () => {
    const validStatuses = [
      'draft',
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ]

    for (const status of validStatuses) {
      const result = orderStatusEnum.safeParse(status)
      expect(result.success).toBe(true)
    }
  })

  it('rejects invalid status', () => {
    const result = orderStatusEnum.safeParse('invalid_status')
    expect(result.success).toBe(false)
  })
})

describe('orderItemSchema', () => {
  it('validates correct order item', () => {
    const validItem = {
      product_id: '550e8400-e29b-41d4-a716-446655440000',
      product_name: 'Сумка кожаная',
      quantity: 5,
      unit_price: 100.5,
    }

    const result = orderItemSchema.safeParse(validItem)
    expect(result.success).toBe(true)
  })

  it('rejects invalid product_id (not UUID)', () => {
    const invalidItem = {
      product_id: 'not-a-uuid',
      product_name: 'Сумка',
      quantity: 1,
      unit_price: 50,
    }

    const result = orderItemSchema.safeParse(invalidItem)
    expect(result.success).toBe(false)

    if (!result.success) {
      const productIdError = result.error.issues.find((i) => i.path.includes('product_id'))
      expect(productIdError).toBeDefined()
    }
  })

  it('rejects missing product_name', () => {
    const invalidItem = {
      product_id: '550e8400-e29b-41d4-a716-446655440000',
      quantity: 1,
      unit_price: 50,
    }

    const result = orderItemSchema.safeParse(invalidItem)
    expect(result.success).toBe(false)
  })

  it('rejects empty product_name', () => {
    const invalidItem = {
      product_id: '550e8400-e29b-41d4-a716-446655440000',
      product_name: '',
      quantity: 1,
      unit_price: 50,
    }

    const result = orderItemSchema.safeParse(invalidItem)
    expect(result.success).toBe(false)
  })

  it('rejects zero quantity', () => {
    const invalidItem = {
      product_id: '550e8400-e29b-41d4-a716-446655440000',
      product_name: 'Сумка',
      quantity: 0,
      unit_price: 50,
    }

    const result = orderItemSchema.safeParse(invalidItem)
    expect(result.success).toBe(false)
  })

  it('rejects negative unit_price', () => {
    const invalidItem = {
      product_id: '550e8400-e29b-41d4-a716-446655440000',
      product_name: 'Сумка',
      quantity: 1,
      unit_price: -10,
    }

    const result = orderItemSchema.safeParse(invalidItem)
    expect(result.success).toBe(false)
  })

  it('rejects non-integer quantity', () => {
    const invalidItem = {
      product_id: '550e8400-e29b-41d4-a716-446655440000',
      product_name: 'Сумка',
      quantity: 2.5,
      unit_price: 50,
    }

    const result = orderItemSchema.safeParse(invalidItem)
    expect(result.success).toBe(false)
  })
})

describe('createOrderSchema', () => {
  const validOrder = {
    client_id: '550e8400-e29b-41d4-a716-446655440000',
    items: [
      {
        product_id: '550e8400-e29b-41d4-a716-446655440001',
        product_name: 'Кошелек кожаный',
        quantity: 2,
        unit_price: 150,
      },
    ],
  }

  it('validates a correct order with minimal fields', () => {
    const result = createOrderSchema.safeParse(validOrder)
    expect(result.success).toBe(true)

    if (result.success) {
      // Статус по умолчанию — draft
      expect(result.data.status).toBe('draft')
    }
  })

  it('validates a correct order with all optional fields', () => {
    const fullOrder = {
      ...validOrder,
      status: 'pending' as const,
      payment_terms: '30 дней',
      delivery_address: 'ул. Пушкина, д. 10',
      notes: 'Срочная доставка',
    }

    const result = createOrderSchema.safeParse(fullOrder)
    expect(result.success).toBe(true)
  })

  it('rejects order without items', () => {
    const noItems = {
      client_id: '550e8400-e29b-41d4-a716-446655440000',
      items: [],
    }

    const result = createOrderSchema.safeParse(noItems)
    expect(result.success).toBe(false)
  })

  it('rejects order without client_id', () => {
    const noClient = {
      items: [
        {
          product_id: '550e8400-e29b-41d4-a716-446655440001',
          product_name: 'Сумка',
          quantity: 1,
          unit_price: 100,
        },
      ],
    }

    const result = createOrderSchema.safeParse(noClient)
    expect(result.success).toBe(false)
  })

  it('rejects invalid client_id (not UUID)', () => {
    const badClient = {
      client_id: 'invalid',
      items: [
        {
          product_id: '550e8400-e29b-41d4-a716-446655440001',
          product_name: 'Сумка',
          quantity: 1,
          unit_price: 100,
        },
      ],
    }

    const result = createOrderSchema.safeParse(badClient)
    expect(result.success).toBe(false)
  })
})

describe('updateOrderSchema', () => {
  it('validates with all optional fields', () => {
    const update = {
      status: 'confirmed' as const,
      payment_terms: 'Предоплата',
      delivery_address: 'Москва, ул. Ленина, д. 5',
      notes: 'Обновленные заметки',
    }

    const result = updateOrderSchema.safeParse(update)
    expect(result.success).toBe(true)
  })

  it('validates empty object (all fields optional)', () => {
    const result = updateOrderSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('rejects invalid status in update', () => {
    const result = updateOrderSchema.safeParse({ status: 'nonexistent' })
    expect(result.success).toBe(false)
  })
})
