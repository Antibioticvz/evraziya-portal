'use client'

import { Button } from '@/components/ui/button'

export default function MarketingError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <h2 className="text-2xl font-light text-gray-900 mb-4">Что-то пошло не так</h2>
        <p className="text-gray-600 mb-8">
          Произошла ошибка при загрузке страницы. Попробуйте обновить.
        </p>
        <Button onClick={reset}>Попробовать снова</Button>
      </div>
    </div>
  )
}
