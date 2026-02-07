import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, company, message } = body

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Все обязательные поля должны быть заполнены' },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Неверный формат email' }, { status: 400 })
    }

    const supabase = await createClient()

    // Store the contact request in database
    const { error: insertError } = await supabase.from('contact_requests').insert({
      name,
      email,
      phone,
      company: company || null,
      message,
      status: 'new',
    })

    if (insertError) {
      console.error('Error saving contact request:', insertError)
      // If table doesn't exist, just log and continue
      if (!insertError.message.includes('does not exist')) {
        throw insertError
      }
    }

    // Here you could also send an email notification
    // using a service like Resend, SendGrid, etc.
    // For now, we just store in database

    return NextResponse.json({
      success: true,
      message: 'Заявка успешно отправлена',
    })
  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Ошибка при отправке формы' }, { status: 500 })
  }
}
