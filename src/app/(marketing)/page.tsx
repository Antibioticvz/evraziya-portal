import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#03000d]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{
          backgroundImage: `url('https://cdn-st2.vigbo.com/u57016/95830/blog/5770971/5232192/section/d431a635fe2fff3795acc4e45b9769ba.jpg')`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left side - Logo and text */}
          <div className="text-center lg:text-left">
            {/* Logo */}
            <div className="mb-6">
              <Image
                src="https://cdn-st2.vigbo.com/u57016/95830/blog/5770971/5232192/82741377/2000-c7375fcb1e4ca522769b59cd7fa5f6a9.png"
                alt="EVRAZIYA"
                width={400}
                height={103}
                priority
                className="mx-auto lg:mx-0"
              />
            </div>

            {/* Subtitle */}
            <p className="text-white/60 text-sm tracking-[0.3em] uppercase mb-4">
              Group of Companies
            </p>

            {/* Main text */}
            <h1 className="text-white text-3xl md:text-4xl font-light tracking-wider mb-8">
              ОПТОВЫЕ ПРОДАЖИ
            </h1>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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

          {/* Right side - Product image (optional, can be added later) */}
          <div className="hidden lg:block">
            {/* Product showcase can go here */}
          </div>
        </div>
      </div>

      {/* Bottom contact info */}
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
    </div>
  )
}
