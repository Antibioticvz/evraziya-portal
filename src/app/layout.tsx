import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/providers/query-provider'
import { ToastProvider } from '@/components/ui/toast'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'EVRAZIYA Group — Оптовые продажи',
    template: '%s | EVRAZIYA Group',
  },
  description:
    'B2B портал оптовой компании EVRAZIYA Group. Дистрибуция европейских брендов кожаных сумок и аксессуаров в России.',
  keywords: [
    'сумки',
    'аксессуары',
    'оптовые продажи',
    'B2B',
    'кожаные изделия',
    'Италия',
    'EVRAZIYA',
  ],
  authors: [{ name: 'EVRAZIYA Group' }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://evraziyagroup.com',
    siteName: 'EVRAZIYA Group',
    title: 'EVRAZIYA Group — Оптовые продажи',
    description:
      'B2B портал оптовой компании EVRAZIYA Group. Дистрибуция европейских брендов кожаных сумок и аксессуаров.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#03000d',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'EVRAZIYA Group',
              url: 'https://evraziyagroup.com',
              description:
                'B2B портал оптовой компании EVRAZIYA Group. Дистрибуция европейских брендов кожаных сумок и аксессуаров в России.',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+7-499-126-75-60',
                contactType: 'sales',
                availableLanguage: 'Russian',
              },
            }),
          }}
        />
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
