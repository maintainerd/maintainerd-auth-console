import { expect, test } from '@playwright/test'

// K1 — responsive viewport checks.
//
// The only backend-less surface in the console is the login landing (every
// application view lives under the authenticated `/:tenantId` layout). We
// render it at three representative viewports and assert the layout holds up:
//   1. no horizontal overflow (the page never scrolls sideways),
//   2. the primary heading and the primary sign-in control are visible, and
//   3. on mobile the sign-in control is a usable tap target.
//
// Assertions use small tolerances so they catch real breakage without being
// pixel-brittle.

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
] as const

// The design system's default button is `h-9` (36px). WCAG 2.5.5 targets a
// larger touch target (~40–44px); we assert a robust floor here so the check
// flags a genuinely collapsed control rather than a few sub-pixel rows.
const MIN_TAP_TARGET_PX = 34

test.describe('K1 — responsive layout (console login)', () => {
  for (const vp of VIEWPORTS) {
    test(`/login @ ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/login')

      const heading = page.getByRole('heading', { name: /console/i })
      await expect(heading).toBeVisible()

      const submit = page.getByRole('button', { name: /sign in/i })
      await expect(submit).toBeVisible()

      // No horizontal overflow: the document must not be wider than the
      // viewport. +1 absorbs sub-pixel rounding.
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      expect(overflow).toBeLessThanOrEqual(1)

      // On mobile the primary control must remain a usable tap target.
      if (vp.name === 'mobile') {
        const box = await submit.boundingBox()
        expect(box).not.toBeNull()
        expect(box!.height).toBeGreaterThanOrEqual(MIN_TAP_TARGET_PX)
      }
    })
  }
})
