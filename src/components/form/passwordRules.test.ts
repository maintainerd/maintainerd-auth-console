import { describe, it, expect } from "vitest"
import { buildPasswordRules } from "./passwordRules"
import type { PasswordConfigPublic } from "@/services/api/tenants/types"

const cfg = (overrides: Partial<PasswordConfigPublic> = {}): PasswordConfigPublic => ({
  min_length: 8,
  max_length: 64,
  require_uppercase: false,
  require_lowercase: false,
  require_number: false,
  require_symbol: false,
  ...overrides,
})

describe("buildPasswordRules", () => {
  it("falls back to length rules (min 12 / max 128) when no config is given", () => {
    const rules = buildPasswordRules("short", undefined)
    expect(rules.map((r) => r.label)).toEqual([
      "At least 12 characters",
      "No more than 128 characters",
    ])
    expect(rules[0].met).toBe(false)
    expect(rules[1].met).toBe(true)
  })

  it("only lists the character rules the config requires", () => {
    const rules = buildPasswordRules("", cfg({ require_uppercase: true, require_number: true }))
    expect(rules.map((r) => r.label)).toEqual([
      "At least 8 characters",
      "No more than 64 characters",
      "One uppercase letter",
      "One number",
    ])
  })

  it("marks each rule met/unmet from the live value", () => {
    const config = cfg({
      min_length: 8,
      require_uppercase: true,
      require_lowercase: true,
      require_number: true,
      require_symbol: true,
    })
    const rules = buildPasswordRules("Abcdef1!", config)
    const byLabel = Object.fromEntries(rules.map((r) => [r.label, r.met]))
    expect(byLabel["At least 8 characters"]).toBe(true)
    expect(byLabel["One uppercase letter"]).toBe(true)
    expect(byLabel["One lowercase letter"]).toBe(true)
    expect(byLabel["One number"]).toBe(true)
    expect(byLabel["One special character"]).toBe(true)
  })

  it("flags an over-long password against max_length", () => {
    const rules = buildPasswordRules("x".repeat(65), cfg({ max_length: 64 }))
    expect(rules.find((r) => r.label === "No more than 64 characters")?.met).toBe(false)
  })
})
