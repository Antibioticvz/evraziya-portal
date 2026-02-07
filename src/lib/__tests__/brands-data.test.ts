import { describe, expect, it } from 'vitest'

import { staticBrands } from '../brands-data'

describe('brands data', () => {
  it('contains exactly 12 brands', () => {
    expect(staticBrands).toHaveLength(12)
  })

  it('each brand has required fields (id, slug, name)', () => {
    for (const brand of staticBrands) {
      expect(brand.id).toBeDefined()
      expect(brand.id).not.toBe('')
      expect(brand.slug).toBeDefined()
      expect(brand.slug).not.toBe('')
      expect(brand.name).toBeDefined()
      expect(brand.name).not.toBe('')
    }
  })

  it('has no duplicate slugs', () => {
    const slugs = staticBrands.map((b) => b.slug)
    const uniqueSlugs = new Set(slugs)

    expect(uniqueSlugs.size).toBe(slugs.length)
  })

  it('has no duplicate ids', () => {
    const ids = staticBrands.map((b) => b.id)
    const uniqueIds = new Set(ids)

    expect(uniqueIds.size).toBe(ids.length)
  })

  it('all CDN URLs have valid format', () => {
    const cdnPattern =
      /^https:\/\/cdn-st2\.vigbo\.com\/u\d+\/\d+\/blog\/\d+\/\d+\/\d+\/.+\.(jpg|jpeg|png|JPG|JPEG|PNG)$/

    for (const brand of staticBrands) {
      if (brand.preview_images) {
        for (const url of brand.preview_images) {
          expect(url).toMatch(cdnPattern)
        }
      }
    }
  })

  it('all brands have preview_images arrays', () => {
    for (const brand of staticBrands) {
      expect(brand.preview_images).toBeDefined()
      expect(Array.isArray(brand.preview_images)).toBe(true)
      expect(brand.preview_images!.length).toBeGreaterThan(0)
    }
  })

  it('all brands are active', () => {
    for (const brand of staticBrands) {
      expect(brand.is_active).toBe(true)
    }
  })

  it('sort_order is sequential from 1 to 12', () => {
    const sortOrders = staticBrands.map((b) => b.sort_order).sort((a, b) => a - b)

    expect(sortOrders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })

  it('contains expected brand names', () => {
    const names = staticBrands.map((b) => b.name)

    expect(names).toContain('CAMPOMAGGI')
    expect(names).toContain('CATERINA LUCCHI')
    expect(names).toContain('GABS')
    expect(names).toContain('CHIARUGI')
    expect(names).toContain('BEAR DESIGN')
    expect(names).toContain('ROBERTO MANTELLASSI')
  })
})
