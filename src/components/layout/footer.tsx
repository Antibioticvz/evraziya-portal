import Link from 'next/link'

const brandLinks = [
  { href: '/brendy/campomaggi', label: 'Campomaggi' },
  { href: '/brendy/caterina-lucchi', label: 'Caterina Lucchi' },
  { href: '/brendy/gabs', label: 'Gabs' },
  { href: '/brendy/chiarugi', label: 'Chiarugi' },
  { href: '/brendy/bear-design', label: 'Bear Design' },
  { href: '/brendy/vilenca-holland', label: 'Vilenca Holland' },
]

export function Footer() {
  return (
    <footer className="bg-evraziya-dark border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company info */}
          <div>
            <h3 className="text-white font-medium text-lg mb-4">EVRAZIYA GROUP</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Эксклюзивный дистрибьютор европейских брендов кожаных сумок и аксессуаров на
              территории России.
            </p>
          </div>

          {/* Brand links */}
          <div>
            <h3 className="text-white font-medium text-sm uppercase tracking-wider mb-4">Бренды</h3>
            <ul className="space-y-2">
              {brandLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-white font-medium text-sm uppercase tracking-wider mb-4">
              Контакты
            </h3>
            <div className="space-y-3 text-sm">
              <a
                href="https://wa.me/74991267560"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white/60 hover:text-white transition-colors"
              >
                WhatsApp: +7 499 126 75 60
              </a>
              <a
                href="mailto:brand@evraziyagroup.com"
                className="block text-white/60 hover:text-white transition-colors"
              >
                brand@evraziyagroup.com
              </a>
              <Link
                href="/kontakty"
                className="block text-white/60 hover:text-white transition-colors"
              >
                Все контакты
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} EVRAZIYA Group. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}
