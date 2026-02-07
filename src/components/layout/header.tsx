'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '/', label: 'ГЛАВНАЯ' },
  { href: '/brendy', label: 'БРЕНДЫ' },
  { href: '/brendy/gianfranco-lotti', label: 'GIANFRANCO LOTTI' },
  { href: '/brendy/campomaggi', label: 'CAMPOMAGGI' },
  { href: '/brendy/caterina-lucchi', label: 'CATERINA LUCCHI' },
  { href: '/brendy/101meme', label: '101MEME' },
  { href: '/brendy/maizena', label: 'MAIZENA' },
  { href: '/brendy/chiarugi', label: 'CHIARUGI' },
]

const navLinksRight = [
  { href: '/brendy/gabs', label: 'GABS' },
  { href: '/brendy/dr-amsterdam', label: 'dR. AMSTERDAM' },
  { href: '/brendy/vilenca-holland', label: 'VILENCA HOLLAND' },
  { href: '/brendy/bear-design', label: 'Bear Design' },
  { href: '/brendy/hexagona', label: 'HEXAGONA' },
  { href: '/brendy/roberto-mantellassi', label: 'ROBERTO MANTELLASSI' },
  { href: '/kontakty', label: 'КОНТАКТЫ' },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const allLinks = [...navLinks, ...navLinksRight]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#03000d]/95 backdrop-blur-sm">
      <nav className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between py-4">
          <div className="flex items-center gap-4 flex-wrap">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-xs text-white/80 hover:text-white transition-colors uppercase tracking-wide',
                  pathname === link.href && 'text-white border-b border-primary',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-end">
            {navLinksRight.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-xs text-white/80 hover:text-white transition-colors uppercase tracking-wide',
                  pathname === link.href && 'text-white border-b border-primary',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center justify-between py-4">
          <Link href="/" className="text-white font-bold">
            EVRAZIYA
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex flex-col gap-2">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'text-sm text-white/80 hover:text-white py-2 uppercase tracking-wide',
                    pathname === link.href && 'text-primary',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
