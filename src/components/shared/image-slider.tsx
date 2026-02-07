'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

interface ImageSliderProps {
  images: string[]
  alt: string
  className?: string
}

export function ImageSlider({ images, alt, className }: ImageSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return
    const scrollAmount = containerRef.current.clientWidth * 0.6
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (!images || images.length === 0) return null

  return (
    <div className={cn('relative w-[80%] mx-auto group', className)}>
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full z-10 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Предыдущий слайд"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <div
        ref={containerRef}
        className="flex gap-1.25 md:gap-2.5 lg:gap-3.75 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((src, index) => (
          <div
            key={index}
            className="shrink-0 relative h-62.5 w-50 md:h-87.5 md:w-70 lg:h-100 lg:w-80"
          >
            <Image
              src={src}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-cover rounded"
              sizes="(max-width: 768px) 200px, (max-width: 1024px) 280px, 320px"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-10 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Следующий слайд"
      >
        <ChevronRight className="h-8 w-8" />
      </button>
    </div>
  )
}
