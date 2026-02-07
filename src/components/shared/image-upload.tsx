'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { uploadBrandImage, deleteBrandImage } from '@/lib/supabase/storage'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  onUpload: (url: string) => void
  onRemove?: () => void
  currentUrl?: string | null
  brandSlug?: string
  imageType?: 'logo' | 'hero' | 'gallery'
  accept?: string
  label?: string
  className?: string
}

export function ImageUpload({
  onUpload,
  onRemove,
  currentUrl,
  brandSlug = 'default',
  imageType = 'gallery',
  accept = 'image/jpeg,image/png,image/webp',
  label = 'Загрузить изображение',
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)

      // Проверка типа файла
      const allowedTypes = accept.split(',').map((t) => t.trim())
      if (!allowedTypes.includes(file.type)) {
        setError('Неподдерживаемый формат файла. Допустимы: JPEG, PNG, WebP')
        return
      }

      // Проверка размера (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Файл слишком большой. Максимальный размер: 5 МБ')
        return
      }

      setUploading(true)
      setProgress(0)

      // Имитация прогресса, так как Supabase SDK не предоставляет onProgress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      try {
        const url = await uploadBrandImage(file, brandSlug, imageType)
        setProgress(100)
        onUpload(url)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки файла')
      } finally {
        clearInterval(progressInterval)
        setUploading(false)
        setProgress(0)
      }
    },
    [accept, brandSlug, imageType, onUpload],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
    // Сброс input для повторной загрузки того же файла
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)

      const file = e.dataTransfer.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile],
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleRemove = async () => {
    if (!currentUrl) return

    setError(null)
    setUploading(true)

    try {
      await deleteBrandImage(currentUrl)
      onRemove?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления файла')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {currentUrl ? (
        <div className="relative group">
          <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            <Image
              src={currentUrl}
              alt="Превью"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                Заменить
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleRemove}
                disabled={uploading}
              >
                Удалить
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              inputRef.current?.click()
            }
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'relative flex flex-col items-center justify-center w-full h-40 rounded-lg border-2 border-dashed transition-colors cursor-pointer',
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100',
            uploading && 'pointer-events-none opacity-60',
          )}
        >
          <UploadIcon className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Перетащите файл сюда или нажмите для выбора</p>
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG или WebP до 5 МБ</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Индикатор прогресса */}
      {uploading && (
        <div className="space-y-1">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">Загрузка... {progress}%</p>
        </div>
      )}

      {/* Ошибка */}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

function UploadIcon({ className }: { className?: string }) {
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
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
  )
}
