import Link from 'next/link'
import Image from 'next/image'
import { createStaticClient } from '@/lib/supabase/static'
import { staticBrands } from '@/lib/brands-data'
import type { Brand } from '@/types/database'

async function getBrands(): Promise<Brand[]> {
  try {
    const supabase = createStaticClient()

    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (error) {
      console.error('Error fetching brands:', error)
      return staticBrands
    }

    return data && data.length > 0 ? data : staticBrands
  } catch (error) {
    console.error('Supabase connection error:', error)
    return staticBrands
  }
}

export const metadata = {
  title: 'Бренды — EVRAZIYA GROUP',
  description: 'Эксклюзивные итальянские бренды кожаных сумок и аксессуаров',
}

export default async function BrandsPage() {
  const brands = await getBrands()

  return (
    <main>
      {/* Hero section */}
      <section className="bg-[#03000d] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-wide">
            НАШИ БРЕНДЫ
          </h1>
          <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto">
            Мы являемся эксклюзивным дистрибьютором премиальных европейских брендов кожаных изделий
            на территории России
          </p>
        </div>
      </section>

      {/* Brands grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brendy/${brand.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  {brand.logo_url ? (
                    <Image
                      src={brand.logo_url}
                      alt={brand.name}
                      fill
                      className="object-contain p-8 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-light text-gray-400">{brand.name}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-medium text-gray-900 group-hover:text-[#03000d]">
                    {brand.name}
                  </h2>
                  {brand.short_description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {brand.short_description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center text-sm font-medium text-[#03000d]">
                    Подробнее
                    <svg
                      className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900">Хотите стать партнером?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Мы открыты для сотрудничества с розничными магазинами и оптовыми покупателями
          </p>
          <div className="mt-8">
            <Link
              href="/kontakty"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-[#03000d] rounded-lg hover:bg-gray-800 transition-colors"
            >
              Связаться с нами
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
