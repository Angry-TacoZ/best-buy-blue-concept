import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('completes the personalized college-laptop decision flow', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /knows when to speak/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /remembers the reason/i })).toBeVisible()
  await page.getByRole('button', { name: /Continue shopping/i }).click()

  await page.getByRole('button', { name: /AER 13 illustrative/i }).click()
  await expect(page.locator('.blue-comment')).toContainText('2.2 pounds matters')

  await page.getByRole('button', { name: /Show three finalists/i }).click()
  await expect(page.locator('.finalist')).toHaveCount(3)
  await expect(page.locator('.finalist').nth(0)).toContainText('AER 13')
  await expect(page.locator('.finalist').nth(1)).toContainText('FORGE 14')
  await expect(page.locator('.finalist').nth(2)).toContainText('ATLAS 14')
})

test('memory can be inspected, disabled, and restored', async ({ page }) => {
  await page.getByRole('button', { name: /Memory on/i }).click()
  const memorySwitch = page.getByRole('checkbox', { name: /Use shopping memory/i })
  await expect(memorySwitch).toBeChecked()
  await memorySwitch.uncheck()
  await expect(page.getByText(/Memory off/i)).toBeVisible()

  await page.getByRole('button', { name: /Restore demo/i }).click()
  await expect(memorySwitch).toBeChecked()
})

test('desktop layout avoids horizontal overflow', async ({ page }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(1)
})

test('has no serious or critical automated accessibility violations', async ({ page }) => {
  await page.waitForTimeout(900)
  const results = await new AxeBuilder({ page }).analyze()
  const materialViolations = results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
  expect(materialViolations).toEqual([])
})

test('remains usable with reduced motion and contains no sound media', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  await page.getByRole('button', { name: /Continue shopping/i }).click()
  await page.getByRole('button', { name: /AER 13 illustrative/i }).click()

  await expect(page.locator('.blue-comment')).toContainText('2.2 pounds matters')
  await expect(page.locator('audio, video')).toHaveCount(0)
})
