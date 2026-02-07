import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { staticBrands } from '@/lib/brands-data'
import { BrandCard } from '@/components/shared/brand-card'

export default function HomePage() {
  const featuredBrands = staticBrands.slice(0, 6)

  return (
    <>
      {/* Hero section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-evraziya-dark">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{
            backgroundImage: `url('https://cdn-st2.vigbo.com/u57016/95830/blog/5770971/5232192/section/d431a635fe2fff3795acc4e45b9769ba.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6">
              <Image
                src="https://cdn-st2.vigbo.com/u57016/95830/blog/5770971/5232192/82741377/2000-c7375fcb1e4ca522769b59cd7fa5f6a9.png"
                alt="EVRAZIYA"
                width={400}
                height={103}
                priority
              />
            </div>

            <p className="text-white/60 text-sm tracking-[0.3em] uppercase mb-4">
              Group of Companies
            </p>

            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-light tracking-wider mb-8">
              ОПТОВЫЕ ПРОДАЖИ
            </h1>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="uppercase tracking-wider">
                <Link href="/brendy">Смотреть бренды</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="uppercase tracking-wider border-white/30 text-white hover:bg-white/10"
              >
                <Link href="/kontakty">Связаться с нами</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/60 text-sm">
              <a
                href="https://wa.me/74991267560"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                WhatsApp: +7 499 126 75 60
              </a>
              <span className="hidden sm:inline">|</span>
              <a
                href="mailto:brand@evraziyagroup.com"
                className="hover:text-white transition-colors"
              >
                brand@evraziyagroup.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured brands */}
      <section className="py-16 md:py-24 bg-evraziya-dark">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-light text-white tracking-wide text-center mb-4">
            НАШИ БРЕНДЫ
          </h2>
          <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
            Эксклюзивная дистрибуция премиальных европейских брендов кожаных изделий на территории
            России
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBrands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 uppercase tracking-wider"
            >
              <Link href="/brendy">Все бренды</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="py-16 md:py-24 bg-evraziya-light-purple">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-evraziya-dark tracking-wide mb-8">
            О КОМПАНИИ
          </h2>
          <p className="text-lg text-evraziya-gray leading-relaxed">
            Группа компаний EVRAZIYA — эксклюзивный дистрибьютор европейских брендов кожаных сумок и
            аксессуаров на территории России. Мы работаем напрямую с производителями из Италии,
            Нидерландов и Индии, обеспечивая нашим партнерам лучшие условия сотрудничества.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="uppercase tracking-wider">
              <Link href="/kontakty">Стать партнером</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
