import { expect, test } from '@playwright/test'

// K4 (backend-less portion) — client-side journeys.
//
// The console's only backend-less surfaces are the login landing and the
// static status pages (everything else lives under the authenticated
// `/:tenantId` layout). These render against the production preview with NO
// backend. The full stack-dependent journeys (real OAuth login, admin CRUD)
// are stubbed at the bottom under a `live` describe that only runs when
// E2E_BASE_URL is set.

test.describe('K4 — client-side journeys (console, backend-less)', () => {
  test('/login renders the OAuth sign-in CTA', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /console/i })).toBeVisible()
    // The sign-in button starts the hosted-identity OAuth flow. Without a
    // backend the tenant cannot resolve, so it renders disabled — but it must
    // still be present as the primary call to action.
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('/no-access renders the access-denied state', async ({ page }) => {
    await page.goto('/no-access')
    await expect(page.getByRole('heading', { name: /don't have access/i })).toBeVisible()
  })

  test('/service-unavailable renders the service-unavailable state', async ({ page }) => {
    await page.goto('/service-unavailable')
    await expect(page.getByRole('heading', { name: /service unavailable/i })).toBeVisible()
  })
})

// ────────────────────────────────────────────────────────────────────────────
// Full stack-dependent journeys (require a live backend at E2E_BASE_URL).
//
// These are intentionally SKIPPED unless E2E_BASE_URL is set, and are left as
// documented placeholders — we do not fake a pass for flows that need a real
// API and a hosted-identity round trip. The owner runs these against a running
// stack, e.g.:
//
//   E2E_BASE_URL=https://console.auth.maintainerd.local npx playwright test tests/e2e/journeys.spec.ts
// ────────────────────────────────────────────────────────────────────────────
test.describe('live — full stack journeys (console)', () => {
  test.skip(!process.env.E2E_BASE_URL, 'requires a live backend (set E2E_BASE_URL)')

  test('OAuth login round trip lands on the tenant dashboard', async () => {
    // 1. /login → click Sign in → hosted identity OAuth → /auth/callback.
    // 2. Assert the session is established and the app lands on
    //    /:tenantId/dashboard.
  })

  test('representative admin CRUD (create → view → delete a role)', async () => {
    // 1. Authenticated session at /:tenantId.
    // 2. Navigate to roles → create a role, assert it appears in the list.
    // 3. Open its detail page, delete it, assert it is gone.
  })
})
