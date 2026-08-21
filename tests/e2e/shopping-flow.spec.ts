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
  await expect(page.locator('.blue-comment')).toContainText('CAD changes this choice')

  await page.getByRole('button', { name: /Show three finalists/i }).click()
  await expect(page.locator('.finalist')).toHaveCount(3)
  await expect(page.locator('.finalist').nth(0)).toContainText('HALO 14')
  await expect(page.locator('.finalist').nth(1)).toContainText('FORGE 14')
  await expect(page.locator('.finalist').nth(2)).toContainText('ATLAS 14')
})

test('header Finalists link reveals and scrolls to the same shortlist', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1100, 'Header navigation links are hidden at compact desktop widths.')
  await page.getByRole('button', { name: /Continue shopping/i }).click()
  await page.getByRole('link', { name: 'Finalists' }).click()

  const shortlist = page.locator('#finalists')
  await expect(shortlist).toBeVisible()
  await expect(shortlist.locator('.finalist')).toHaveCount(3)
  await expect(shortlist).toBeInViewport()
})

test('same CAD scenario becomes generic and selects integrated graphics with memory off', async ({ page }) => {
  await page.getByRole('button', { name: /Show three finalists/i }).click()
  await expect(page.locator('.finalist').nth(0)).toContainText('HALO 14')
  await expect(page.locator('.memory-impact')).toContainText('CAD informs the decision')

  await page.getByRole('button', { name: /Turn memory off to compare/i }).click()
  await expect(page.getByRole('heading', { name: /Generic advice loses the coursework context/i })).toBeVisible()
  await expect(page.locator('.finalist').nth(0)).toContainText('AER 13')
  await expect(page.locator('.memory-impact')).toContainText('CAD context is ignored')
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

test('editing coursework changes CAD capability guidance and the shortlist', async ({ page }) => {
  await page.getByRole('button', { name: /Memory on/i }).click()
  const needs = page.getByRole('textbox', { name: /Additional needs or coursework/i })
  await needs.fill('Needs a quiet keyboard.')
  await page.getByLabel('Close shopping memory').last().click()
  await page.getByRole('button', { name: /Show three finalists/i }).click()
  await expect(page.locator('.finalist').nth(0)).toContainText('AER 13')

  await page.getByRole('button', { name: /Memory on/i }).click()
  await needs.fill('The student will be enrolled in a Solidworks CAD class.')
  await expect(page.getByText(/CAD · Dedicated GPU · 16–32 GB memory/i)).toBeVisible()
  await page.getByLabel('Close shopping memory').last().click()
  await expect(page.locator('.finalist').nth(0)).toContainText('HALO 14')
})

test('generates a curated memory snapshot and carries a choice through simulated checkout', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /A shopping agent that knows when to speak/i })).toBeVisible()
  await page.getByRole('button', { name: /Build my curated laptop page/i }).click()

  await expect(page.getByRole('heading', { name: /Your laptop page, shaped by what Blue remembers/i })).toBeVisible()
  await expect(page.getByText('CAD coursework')).toBeVisible()
  await expect(page.locator('.curated-product')).toHaveCount(3)
  await expect(page.locator('.curated-product').nth(0)).toContainText('HALO 14')
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1)
  let accessibility = await new AxeBuilder({ page }).analyze()
  expect(accessibility.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')).toEqual([])

  await page.getByRole('button', { name: /Choose this laptop/i }).first().click()
  await expect(page.locator('.blue-comment')).toContainText(/HALO 14 is selected/i)
  await page.getByRole('button', { name: /Continue to checkout/i }).click()

  await expect(page.getByRole('heading', { name: /Review the decision before acting/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Order summary/i })).toBeVisible()
  await expect(page.getByText(/No payment or personal information is collected/i)).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1)
  accessibility = await new AxeBuilder({ page }).analyze()
  expect(accessibility.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')).toEqual([])
  await page.getByRole('checkbox', { name: /Two-year accidental-damage plan/i }).check()
  await expect(page.locator('.order-summary')).toContainText('$129.99')

  await page.getByRole('button', { name: /Complete demo checkout/i }).click()
  await expect(page.getByRole('heading', { name: /Nothing was purchased/i })).toBeVisible()
  await expect(page.getByText(/HALO 14 · Dedicated 8 GB GPU · 32 GB/i)).toBeVisible()
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

  await expect(page.locator('.blue-comment')).toContainText('CAD changes this choice')
  await expect(page.locator('audio, video')).toHaveCount(0)
})
