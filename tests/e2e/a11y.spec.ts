import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import type { Result } from 'axe-core'

// Automated WCAG 2.1 AA scan (G5).
//
// We scan the console routes that render standalone against the production
// preview build with NO backend. Every application surface lives under the
// authenticated `/:tenantId` layout and requires a session, so the scannable
// set is the login landing and the static status pages.
//
// The gate fails only on `serious`/`critical` violations — the impacts that
// materially block assistive-tech users — while `moderate`/`minor` findings are
// logged for follow-up without breaking CI. This keeps the gate meaningful
// without chasing every low-severity nit.

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
const BLOCKING_IMPACTS = new Set(['serious', 'critical'])

async function scan(page: Page, testInfo: { title: string }) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()

  const blocking: Result[] = []
  const advisory: Result[] = []
  for (const v of results.violations) {
    if (v.impact && BLOCKING_IMPACTS.has(v.impact)) blocking.push(v)
    else advisory.push(v)
  }

  if (advisory.length > 0) {
    // Non-blocking: surface moderate/minor findings for follow-up.
    console.log(
      `[a11y] ${testInfo.title}: ${advisory.length} moderate/minor finding(s): ` +
        advisory.map((v) => `${v.id} (${v.impact})`).join(', '),
    )
  }

  const summary = blocking
    .map((v) => `${v.id} [${v.impact}] ${v.help} (${v.nodes.length} node(s))\n  ${v.helpUrl}`)
    .join('\n')
  expect(blocking, `serious/critical a11y violations:\n${summary}`).toEqual([])
}

test.describe('WCAG 2.1 AA — console standalone routes', () => {
  test('/login', async ({ page }, testInfo) => {
    await page.goto('/login')
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    await scan(page, testInfo)
  })

  test('/service-unavailable', async ({ page }, testInfo) => {
    await page.goto('/service-unavailable')
    await expect(page.getByRole('heading', { name: /service unavailable/i })).toBeVisible()
    await scan(page, testInfo)
  })

  test('/no-access', async ({ page }, testInfo) => {
    await page.goto('/no-access')
    await expect(page.getByRole('heading', { name: /don't have access/i })).toBeVisible()
    await scan(page, testInfo)
  })
})
