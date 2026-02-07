import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateOrderSchema } from '@/lib/validations/order'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, client:clients(id, company_name, inn), items:order_items(*)')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ order })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = updateOrderSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Ошибка валидации', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { data: order, error } = await supabase
    .from('orders')
    .update(parsed.data)
    .eq('id', id)
    .select('*, client:clients(id, company_name, inn), items:order_items(*)')
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ order })
}
