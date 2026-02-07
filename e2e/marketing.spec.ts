import { test, expect } from '@playwright/test'

test.describe('Marketing pages', () => {
  test('home page loads and has correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/EVRAZIYA/)
  })

  test('hero section is visible with wholesale heading', async ({ page }) => {
    await page.goto('/')
    const hero = page.locator('h1', { hasText: 'ОПТОВЫЕ ПРОДАЖИ' })
    await expect(hero).toBeVisible()
  })

  test('"Смотреть бренды" link navigates to /brendy', async ({ page }) => {
    await page.goto('/')
    const brandsLink = page.locator('a', { hasText: 'Смотреть бренды' })
    await expect(brandsLink).toBeVisible()
    await brandsLink.click()
    await expect(page).toHaveURL(/\/brendy$/)
  })

  test('/brendy page shows brand cards', async ({ page }) => {
    await page.goto('/brendy')
    await expect(page.locator('h1', { hasText: 'НАШИ БРЕНДЫ' })).toBeVisible()

    // Brand cards should be rendered (at least one link card)
    const brandCards = page.locator(
      '[data-testid="brand-card"], article, .grid a[href*="/brendy/"]',
    )
    await expect(brandCards.first()).toBeVisible()
  })

  test('/brendy/campomaggi loads brand detail page', async ({ page }) => {
    await page.goto('/brendy/campomaggi')
    // The page should load without errors
    await expect(page.locator('main')).toBeVisible()
    // Should contain brand-related content
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
  })

  test('/kontakty page has contact form', async ({ page }) => {
    await page.goto('/kontakty')
    await expect(page.locator('h1', { hasText: 'КОНТАКТЫ' })).toBeVisible()

    // Contact form elements
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="phone"]')).toBeVisible()
    await expect(page.locator('textarea[name="message"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('footer is visible with company name', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    await expect(footer.locator('text=EVRAZIYA GROUP')).toBeVisible()
  })
})
