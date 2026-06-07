import { describe, it, expect, vi } from "vitest"

const { api } = vi.hoisted(() => ({
  api: {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))
const { createResourceApiMock } = vi.hoisted(() => ({
  createResourceApiMock: vi.fn(() => api),
}))
const { patchMock } = vi.hoisted(() => ({ patchMock: vi.fn() }))

vi.mock("../_lib/resource", () => ({ createResourceApi: createResourceApiMock }))
vi.mock("../client", () => ({ patch: patchMock }))
vi.mock("../_lib/unwrap", () => ({ unwrap: (res: { data: unknown }) => res.data }))

import * as service from "./index"
import { API_ENDPOINTS } from "../config"
import type { CreateUserPoolRequest, UpdateUserPoolRequest } from "./types"

describe("user-pools service", () => {
  it("creates the resource API with the user-pool endpoint and label", () => {
    expect(createResourceApiMock).toHaveBeenCalledWith(API_ENDPOINTS.USER_POOL, "user pool")
  })

  it("fetchUserPools delegates to api.list", () => {
    service.fetchUserPools()
    expect(api.list).toHaveBeenCalledTimes(1)
  })

  it("fetchUserPoolById delegates to api.getById", () => {
    service.fetchUserPoolById("up-1")
    expect(api.getById).toHaveBeenCalledWith("up-1")
  })

  it("createUserPool delegates to api.create", () => {
    const data = { name: "x", display_name: "", status: "active" } as CreateUserPoolRequest
    service.createUserPool(data)
    expect(api.create).toHaveBeenCalledWith(data)
  })

  it("updateUserPool delegates to api.update", () => {
    const data = { name: "x", display_name: "", status: "active" } as UpdateUserPoolRequest
    service.updateUserPool("up-1", data)
    expect(api.update).toHaveBeenCalledWith("up-1", data)
  })

  it("deleteUserPool delegates to api.remove", () => {
    service.deleteUserPool("up-1")
    expect(api.remove).toHaveBeenCalledWith("up-1")
  })

  it("setUserPoolStatus PATCHes the status endpoint and unwraps", async () => {
    patchMock.mockResolvedValue({ success: true, data: { user_pool_id: "up-1", status: "inactive" } })
    await expect(service.setUserPoolStatus("up-1", "inactive")).resolves.toEqual({
      user_pool_id: "up-1",
      status: "inactive",
    })
    expect(patchMock).toHaveBeenCalledWith("/user-pools/up-1/status", { status: "inactive" })
  })
})
