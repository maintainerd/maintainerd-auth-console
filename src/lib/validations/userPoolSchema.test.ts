import { describe, it, expect } from "vitest"
import { userPoolSchema } from "./userPoolSchema"

describe("userPoolSchema", () => {
  const valid = { name: "customers", display_name: "Customer Accounts", status: "active" }

  it("accepts a valid payload", async () => {
    await expect(userPoolSchema.validate(valid)).resolves.toMatchObject(valid)
  })

  it("defaults display_name to an empty string when omitted", async () => {
    const result = await userPoolSchema.validate({ name: "ab", status: "active" })
    expect(result.display_name).toBe("")
  })

  it("requires name", async () => {
    await expect(userPoolSchema.validate({ ...valid, name: "" })).rejects.toThrow(/Name is required/)
  })

  it("rejects a name shorter than 2 chars", async () => {
    await expect(userPoolSchema.validate({ ...valid, name: "a" })).rejects.toThrow(/at least 2/)
  })

  it("rejects a name longer than 100 chars", async () => {
    await expect(userPoolSchema.validate({ ...valid, name: "a".repeat(101) })).rejects.toThrow(/not exceed 100/)
  })

  it("rejects a display_name longer than 150 chars", async () => {
    await expect(
      userPoolSchema.validate({ ...valid, display_name: "a".repeat(151) }),
    ).rejects.toThrow(/not exceed 150/)
  })

  it("requires a valid status", async () => {
    await expect(userPoolSchema.validate({ ...valid, status: "archived" })).rejects.toThrow()
  })
})
