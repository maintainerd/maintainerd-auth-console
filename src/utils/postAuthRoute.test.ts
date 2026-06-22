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
  it("sends a null account to profile registration", () => {
    expect(resolvePostAuthRoute(null, tenant())).toBe("/register/profile")
  })

  it("requires email verification when unverified and the tenant requires it", () => {
    expect(resolvePostAuthRoute(account({ email_verified: false }), tenant())).toBe("/email-verification")
  })

  it("skips verification when the tenant does not require it", () => {
    const t = tenant({ registration_config: { require_email_verification: false } } as Partial<TenantEntity>)
    expect(resolvePostAuthRoute(account({ email_verified: false, profiles: [] }), t)).toBe("/register/profile")
  })

  it("sends a verified user without a profile to profile registration", () => {
    expect(resolvePostAuthRoute(account({ profiles: [] }), tenant())).toBe("/register/profile")
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

  it("routes the root to login when unauthenticated, dashboard when complete", () => {
    expect(guard("/", false, null)).toBe("/login")
    expect(guard("/", true, account())).toBe("/acme/dashboard")
  })

  it("lets unauthenticated users see auth pages but bounces authenticated ones", () => {
    expect(guard("/login", false, null)).toBeNull()
    expect(guard("/login", true, account())).toBe("/acme/dashboard")
  })

  it("sends unauthenticated users off protected pages to login", () => {
    expect(guard("/acme/dashboard", false, null)).toBe("/login")
  })

  it("forces an unverified user to email verification on protected pages", () => {
    expect(guard("/acme/dashboard", true, account({ email_verified: false }))).toBe("/email-verification")
  })

  it("forces a profile-less user to profile registration on protected pages", () => {
    expect(guard("/acme/dashboard", true, account({ profiles: [] }))).toBe("/register/profile")
  })

  it("allows verifying email without a session (login redirect case)", () => {
    expect(guard("/email-verification", false, null)).toBeNull()
  })

  it("moves an already-verified user off the verification page", () => {
    expect(guard("/email-verification", true, account())).toBe("/acme/dashboard")
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

  it("blocks the register page when self-registration is disabled", () => {
    const disabled = tenant({
      registration_config: { require_email_verification: false, self_registration_enabled: false },
    } as Partial<TenantEntity>)
    expect(
      resolveGuardRedirect({ pathname: "/register", isAuthenticated: false, account: null, tenant: disabled }),
    ).toBe("/login")
  })

  it("allows the register page when self-registration is enabled", () => {
    const enabled = tenant({
      registration_config: { require_email_verification: false, self_registration_enabled: true },
    } as Partial<TenantEntity>)
    expect(
      resolveGuardRedirect({ pathname: "/register", isAuthenticated: false, account: null, tenant: enabled }),
    ).toBeNull()
  })
})
