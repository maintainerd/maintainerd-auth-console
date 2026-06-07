import { describe, it, expect } from "vitest"
import UserPoolsPage from "./index"
import UserPoolAddOrUpdateForm from "./form"
import UserPoolDetailsPage from "./details"

describe("user-pools barrels", () => {
  it("re-export the feature's page components", () => {
    expect(UserPoolsPage).toBeTypeOf("function")
    expect(UserPoolAddOrUpdateForm).toBeTypeOf("function")
    expect(UserPoolDetailsPage).toBeTypeOf("function")
  })
})
