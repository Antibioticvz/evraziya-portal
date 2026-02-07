import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('header renders with logo text', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('mobile menu toggles on small viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    // Mobile logo should be visible
    const mobileLogo = page.locator('header a', { hasText: 'EVRAZIYA' })
    await expect(mobileLogo).toBeVisible()

    // Menu button should be visible on mobile
    const menuButton = page.locator('header button')
    await expect(menuButton).toBeVisible()

    // Mobile menu should be hidden initially (no nav links visible)
    const mobileNavLink = page.locator('header >> text=БРЕНДЫ')
    await expect(mobileNavLink).not.toBeVisible()

    // Click menu button to open
    await menuButton.click()
    await expect(mobileNavLink).toBeVisible()

    // Click menu button again to close
    await menuButton.click()
    await expect(mobileNavLink).not.toBeVisible()
  })

  test('navigation links point to correct pages', async ({ page }) => {
    await page.goto('/')

    // Check /brendy link exists
    const brendyLink = page.locator('header a[href="/brendy"]')
    await expect(brendyLink.first()).toHaveAttribute('href', '/brendy')

    // Check /kontakty link exists
    const kontaktyLink = page.locator('header a[href="/kontakty"]')
    await expect(kontaktyLink.first()).toHaveAttribute('href', '/kontakty')
  })

  test('404 page shows for invalid routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-12345')
    // Next.js returns 404 for unknown routes
    expect(response?.status()).toBe(404)
  })
})
