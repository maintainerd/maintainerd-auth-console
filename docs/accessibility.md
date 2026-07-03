# Accessibility

## Target

The Maintainerd Auth Console targets **WCAG 2.1 Level AA**. It is the internal
admin surface, so the highest-priority conformance path is the entry point
(login landing) and the shared UI primitives reused across every management
screen.

## Automated verification

An automated axe (`@axe-core/playwright`) scan runs as part of CI (the `a11y`
job in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)) and locally:

```bash
npm run build          # produce dist/
npm run a11y           # axe scan against the production preview (no backend)
```

The scan (`tests/e2e/a11y.spec.ts`, driven by [`playwright.config.ts`](../playwright.config.ts))
loads the **production preview** build with **no backend running** and asserts
`withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa'])`. It **fails on any
`serious`/`critical` violation** and logs `moderate`/`minor` findings as
advisory output without failing — keeping the gate meaningful without chasing
every low-severity nit.

**Routes scanned** (they render standalone without an API):

- `/login` — the OAuth login landing (the app entry point)
- `/service-unavailable` — the backend-down status page
- `/no-access` — the unauthorized status page

As of the current run, all scanned routes report **zero** violations at any
impact level.

## Known exceptions / gaps

- **Authenticated app is not scanned by the automated gate.** Every management
  surface lives under the `/:tenantId` `PrivateLayout`, which requires a session
  and tenant context and cannot be rendered against the backend-less preview.
  Those screens are built from the same shared UI primitives (shadcn/Radix)
  exercised by the login landing, and should be verified with the axe browser
  extension or a live-stack run before release.
- Third-party WebAuthn / passkey browser prompts are outside the app's control.

Report accessibility issues via the process in [`../SECURITY.md`](../SECURITY.md)
or the repository issue tracker.
