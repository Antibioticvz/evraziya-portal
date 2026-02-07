import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#03000d] border-t border-white/10 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white/60 text-sm">
            © {new Date().getFullYear()} EVRAZIYA Group. Все права защищены.
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/kontakty"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Контакты
            </Link>
            <a
              href="https://wa.me/74991267560"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
