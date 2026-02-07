'use client'

import { Button } from '@/components/ui/button'

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Произошла ошибка</h2>
        <p className="text-gray-600 mb-6">
          Не удалось загрузить данные. Попробуйте обновить страницу.
        </p>
        <Button onClick={reset}>Попробовать снова</Button>
      </div>
    </div>
  )
}
