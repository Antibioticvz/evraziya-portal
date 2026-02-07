import { z } from 'zod'

import type { OrderStatus } from '@/types/database'

const orderStatusValues: [OrderStatus, ...OrderStatus[]] = [
  'draft',
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

export const orderStatusEnum = z.enum(orderStatusValues)

export const orderItemSchema = z.object({
  product_id: z.string().uuid('Некорректный ID товара'),
  product_name: z.string().min(1, 'Укажите название товара'),
  quantity: z
    .number()
    .int('Количество должно быть целым числом')
    .min(1, 'Минимальное количество — 1'),
  unit_price: z.number().positive('Цена должна быть положительной'),
})

export const createOrderSchema = z.object({
  client_id: z.string().uuid('Укажите клиента'),
  status: orderStatusEnum.optional().default('draft'),
  payment_terms: z.string().optional(),
  delivery_address: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'Добавьте хотя бы один товар'),
})

export const updateOrderSchema = z.object({
  status: orderStatusEnum.optional(),
  payment_terms: z.string().optional(),
  delivery_address: z.string().optional(),
  notes: z.string().optional(),
})

export type OrderItemFormValues = z.infer<typeof orderItemSchema>
export type CreateOrderFormValues = z.infer<typeof createOrderSchema>
export type UpdateOrderFormValues = z.infer<typeof updateOrderSchema>
