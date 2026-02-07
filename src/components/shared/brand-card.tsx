import Link from 'next/link'
import Image from 'next/image'

import type { Brand } from '@/types/database'

interface BrandCardProps {
  brand: Brand
}

export function BrandCard({ brand }: BrandCardProps) {
  const previewImage = brand.preview_images?.[0]

  return (
    <Link
      href={`/brendy/${brand.slug}`}
      className="group relative overflow-hidden rounded-xl bg-evraziya-dark aspect-[3/4] block"
    >
      {previewImage ? (
        <Image
          src={previewImage}
          alt={brand.name}
          fill
          className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-evraziya-purple/20 to-evraziya-dark" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-light text-white tracking-wider">{brand.name}</h3>
        {brand.short_description && (
          <p className="mt-2 text-sm text-white/60 line-clamp-2">{brand.short_description}</p>
        )}
        <span className="inline-flex items-center mt-3 text-sm text-white/80 group-hover:text-white transition-colors">
          Подробнее
          <svg
            className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
