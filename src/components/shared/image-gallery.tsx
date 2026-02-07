'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images: string[]
  alt: string
  columns?: 2 | 3 | 4
  className?: string
}

export function ImageGallery({ images, alt, columns = 3, className }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!images || images.length === 0) return null

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }

  return (
    <>
      <div className={cn('grid gap-4', gridCols[columns], className)}>
        {images.map((src, index) => (
          <button
            key={index}
            onClick={() => setLightboxIndex(index)}
            className="relative aspect-3/4 overflow-hidden rounded-lg group cursor-pointer"
          >
            <Image
              src={src}
              alt={`${alt} ${index + 1}`}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-100 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white z-10"
            onClick={() => setLightboxIndex(null)}
            aria-label="Закрыть"
          >
            <X className="h-8 w-8" />
          </button>

          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-10"
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex(lightboxIndex - 1)
              }}
              aria-label="Предыдущее фото"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>
          )}

          <div
            className="relative w-[90vw] h-[80vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${alt} ${lightboxIndex + 1}`}
              fill
              unoptimized
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {lightboxIndex < images.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-10"
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex(lightboxIndex + 1)
              }}
              aria-label="Следующее фото"
            >
              <ChevronRight className="h-10 w-10" />
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
