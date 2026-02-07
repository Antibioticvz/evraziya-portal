import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createStaticClient } from '@/lib/supabase/static'
import { staticBrands } from '@/lib/brands-data'
import dynamic from 'next/dynamic'

const ImageSlider = dynamic(() =>
  import('@/components/shared/image-slider').then((mod) => mod.ImageSlider),
)
const ImageGallery = dynamic(() =>
  import('@/components/shared/image-gallery').then((mod) => mod.ImageGallery),
)
import type { Brand, Product } from '@/types/database'

async function getBrand(slug: string): Promise<Brand | null> {
  try {
    const supabase = createStaticClient()

    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return staticBrands.find((b) => b.slug === slug) || null
    }

    return data
  } catch {
    return staticBrands.find((b) => b.slug === slug) || null
  }
}

async function getBrandProducts(brandId: string): Promise<Product[]> {
  try {
    const supabase = createStaticClient()

    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('brand_id', brandId)
      .eq('is_active', true)
      .order('sort_order')
      .limit(8)

    return data || []
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const brand = await getBrand(slug)

  if (!brand) {
    return { title: 'Бренд не найден — EVRAZIYA GROUP' }
  }

  return {
    title: `${brand.name} — EVRAZIYA GROUP`,
    description:
      brand.short_description || `${brand.name} — эксклюзивный бренд в портфолио EVRAZIYA GROUP`,
  }
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const brand = await getBrand(slug)

  if (!brand) {
    notFound()
  }

  const products = await getBrandProducts(brand.id)

  return (
    <main>
      {/* Hero section */}
      <section className="bg-evraziya-dark py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/brendy"
            className="inline-flex items-center text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Все бренды
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {brand.logo_url && (
              <div className="w-48 h-48 md:w-64 md:h-64 bg-white rounded-2xl p-8 flex items-center justify-center">
                <Image
                  src={brand.logo_url}
                  alt={brand.name}
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
            )}
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-wide">
                {brand.name}
              </h1>
              {brand.short_description && (
                <p className="mt-6 text-lg text-white/60 max-w-xl">{brand.short_description}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Image slider */}
      {brand.preview_images && brand.preview_images.length > 0 && (
        <section className="py-12 bg-evraziya-dark-alt">
          <ImageSlider images={brand.preview_images} alt={brand.name} />
        </section>
      )}

      {/* About brand */}
      {brand.full_description && (
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">О бренде</h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>{brand.full_description}</p>
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {brand.preview_images && brand.preview_images.length > 0 && (
        <section className="py-16 md:py-24 bg-evraziya-light-purple">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-light text-evraziya-dark mb-8">Галерея</h2>
            <ImageGallery images={brand.preview_images} alt={brand.name} columns={3} />
          </div>
        </section>
      )}

      {/* Products preview */}
      {products.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">Коллекция</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="aspect-square bg-gray-100 relative">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <PackageIcon className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    {product.sku && (
                      <p className="mt-1 text-xs text-gray-500">Арт. {product.sku}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900">
            Заинтересованы в {brand.name}?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Свяжитесь с нами для получения информации о ценах и условиях сотрудничества
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kontakty"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-evraziya-purple rounded-lg hover:bg-evraziya-purple-hover transition-colors"
            >
              Связаться с нами
            </Link>
            <Link
              href="/brendy"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Другие бренды
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
      />
    </svg>
  )
}
