import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })

await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(900)
await page.screenshot({ path: 'docs/assets/blue-hero.png' })

await page.getByRole('button', { name: /Show three finalists/i }).click()
await page.waitForTimeout(4300)
await page.locator('#finalists').evaluate((element) => window.scrollTo(0, element.offsetTop))
await page.waitForTimeout(300)
await page.screenshot({ path: 'docs/assets/blue-finalists.png' })

await browser.close()
