import Link from 'next/link'
import { createStaticClient } from '@/lib/supabase/static'
import { staticBrands } from '@/lib/brands-data'
import { BrandCard } from '@/components/shared/brand-card'
import { FadeIn } from '@/components/shared/fade-in'
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
  description:
    'Эксклюзивные итальянские бренды кожаных сумок и аксессуаров. Campomaggi, Caterina Lucchi, Gabs и другие.',
}

export default async function BrandsPage() {
  const brands = await getBrands()

  return (
    <main>
      {/* Hero section */}
      <section className="bg-evraziya-dark py-20 md:py-28">
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
      <section className="py-16 md:py-24 bg-evraziya-dark">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brands.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-evraziya-light-purple py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-light text-evraziya-dark">
              Хотите стать партнером?
            </h2>
            <p className="mt-4 text-lg text-evraziya-gray">
              Мы открыты для сотрудничества с розничными магазинами и оптовыми покупателями
            </p>
            <div className="mt-8">
              <Link
                href="/kontakty"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-evraziya-purple rounded-lg hover:bg-evraziya-purple-hover transition-colors"
              >
                Связаться с нами
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}
