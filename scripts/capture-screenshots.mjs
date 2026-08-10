import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })

await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(900)
await page.screenshot({ path: 'docs/assets/blue-hero.png', fullPage: false })

await page.getByRole('button', { name: /Continue shopping/i }).click()
await page.getByRole('button', { name: /Show three finalists/i }).click()
await page.locator('#finalists').scrollIntoViewIfNeeded()
await page.waitForTimeout(500)
await page.screenshot({ path: 'docs/assets/blue-finalists.png', fullPage: false })

await browser.close()
