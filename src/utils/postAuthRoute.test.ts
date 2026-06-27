import { describe, it, expect } from "vitest"
import { resolvePostAuthRoute, resolveGuardRedirect } from "./postAuthRoute"
import type { AccountEntity } from "@/services/api/auth/types"
import type { TenantEntity } from "@/services/api/tenants/types"

// Minimal fixtures — only the fields the routing logic reads.
const tenant = (overrides: Partial<TenantEntity> = {}): TenantEntity =>
  ({
    identifier: "acme",
    registration_config: { require_email_verification: true },
    ...overrides,
  } as TenantEntity)

const account = (overrides: Partial<AccountEntity> = {}): AccountEntity =>
  ({
    email_verified: true,
    profiles: [{ profile_id: "p1" }],
    tenant: { identifier: "acme" },
    ...overrides,
  } as AccountEntity)

describe("resolvePostAuthRoute", () => {
  it("sends a null account to the current tenant dashboard fallback", () => {
    expect(resolvePostAuthRoute(null, tenant())).toBe("/acme/dashboard")
  })

  it("does not gate console routing on email verification", () => {
    expect(resolvePostAuthRoute(account({ email_verified: false }), tenant())).toBe("/acme/dashboard")
  })

  it("does not gate console routing on profile setup", () => {
    const t = tenant({ registration_config: { require_email_verification: false } } as Partial<TenantEntity>)
    expect(resolvePostAuthRoute(account({ email_verified: false, profiles: [] }), t)).toBe("/acme/dashboard")
  })

  it("sends a fully-registered user to their tenant dashboard", () => {
    expect(resolvePostAuthRoute(account(), tenant())).toBe("/acme/dashboard")
  })

  it("prefers the authenticated account tenant when bootstrap tenant context is stale", () => {
    expect(resolvePostAuthRoute(account(), tenant({ identifier: "default" }))).toBe("/acme/dashboard")
  })
})

describe("resolveGuardRedirect", () => {
  const guard = (pathname: string, isAuthenticated: boolean, acc: AccountEntity | null) =>
    resolveGuardRedirect({ pathname, isAuthenticated, account: acc, tenant: tenant() })

  it("never gates setup or no-access pages", () => {
    expect(guard("/setup/tenant", false, null)).toBeNull()
    expect(guard("/no-access", true, account())).toBeNull()
  })

  it("leaves unauthenticated root to the OAuth redirector, dashboard when complete", () => {
    expect(guard("/", false, null)).toBeNull()
    expect(guard("/", true, account())).toBe("/acme/dashboard")
  })

  it("lets unauthenticated users see auth pages but bounces authenticated ones", () => {
    expect(guard("/login", false, null)).toBeNull()
    expect(guard("/login", true, account())).toBe("/acme/dashboard")
  })

  it("leaves unauthenticated protected pages to the OAuth redirector", () => {
    expect(guard("/acme/dashboard", false, null)).toBeNull()
  })

  it("allows unverified users through because verification belongs to identity", () => {
    expect(guard("/acme/dashboard", true, account({ email_verified: false }))).toBeNull()
  })

  it("allows profile-less users through because profile completion belongs to identity", () => {
    expect(guard("/acme/dashboard", true, account({ profiles: [] }))).toBeNull()
  })

  it("blocks access to another tenant's pages", () => {
    expect(
      resolveGuardRedirect({
        pathname: "/other/dashboard",
        isAuthenticated: true,
        account: account(),
        tenant: tenant(),
      }),
    ).toBe("/no-access")
  })

  it("allows the user's own tenant pages", () => {
    expect(guard("/acme/users", true, account())).toBeNull()
  })
})
