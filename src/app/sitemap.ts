import type { MetadataRoute } from 'next'
import { staticBrands } from '@/lib/brands-data'

const BASE_URL = 'https://evraziyagroup.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    {
      url: `${BASE_URL}/brendy`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/kontakty`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  const brandRoutes: MetadataRoute.Sitemap = staticBrands.map((brand) => ({
    url: `${BASE_URL}/brendy/${brand.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...brandRoutes]
}
