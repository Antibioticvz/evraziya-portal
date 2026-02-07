import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createOrderSchema } from '@/lib/validations/order'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const offset = (page - 1) * limit

  const {
    data: orders,
    error,
    count,
  } = await supabase
    .from('orders')
    .select('*, client:clients(id, company_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    orders,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  })
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = createOrderSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Ошибка валидации', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { items, ...orderData } = parsed.data

  // Calculate total amount
  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      ...orderData,
      total_amount: totalAmount,
      created_by: user.id,
      manager_id: user.id,
    })
    .select()
    .single()

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 })
  }

  // Create order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.quantity * item.unit_price,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

  if (itemsError) {
    // Rollback: delete the order if items insertion failed
    await supabase.from('orders').delete().eq('id', order.id)
    return NextResponse.json({ error: itemsError.message }, { status: 500 })
  }

  // Fetch complete order with items
  const { data: completeOrder } = await supabase
    .from('orders')
    .select('*, client:clients(id, company_name), items:order_items(*)')
    .eq('id', order.id)
    .single()

  return NextResponse.json({ order: completeOrder }, { status: 201 })
}
