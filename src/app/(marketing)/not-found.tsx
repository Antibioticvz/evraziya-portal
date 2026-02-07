import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function MarketingNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-evraziya-dark">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-light text-white mb-4">404</h1>
        <h2 className="text-xl text-white/80 mb-4">Страница не найдена</h2>
        <p className="text-white/60 mb-8">
          Запрашиваемая страница не существует или была перемещена.
        </p>
        <Button asChild>
          <Link href="/">На главную</Link>
        </Button>
      </div>
    </div>
  )
}
