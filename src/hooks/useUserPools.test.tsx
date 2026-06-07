import { describe, it, expect, vi, beforeEach } from "vitest"
import type { ReactNode } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  userPoolKeys,
  useUserPools,
  useUserPool,
  useCreateUserPool,
  useUpdateUserPool,
  useDeleteUserPool,
} from "./useUserPools"
import * as service from "@/services/api/user-pools"

vi.mock("@/services/api/user-pools", () => ({
  fetchUserPools: vi.fn(),
  fetchUserPoolById: vi.fn(),
  createUserPool: vi.fn(),
  updateUserPool: vi.fn(),
  deleteUserPool: vi.fn(),
}))

const mocked = vi.mocked(service)

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return { queryClient, wrapper }
}

beforeEach(() => vi.clearAllMocks())

describe("userPoolKeys", () => {
  it("builds stable, hierarchical keys", () => {
    expect(userPoolKeys.all).toEqual(["user-pools"])
    expect(userPoolKeys.lists()).toEqual(["user-pools", "list"])
    expect(userPoolKeys.details()).toEqual(["user-pools", "detail"])
    expect(userPoolKeys.detail("up-1")).toEqual(["user-pools", "detail", "up-1"])
  })
})

describe("useUserPools", () => {
  it("fetches the list", async () => {
    mocked.fetchUserPools.mockResolvedValue([{ user_pool_id: "1" }] as never)
    const { wrapper } = makeWrapper()
    const { result } = renderHook(() => useUserPools(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([{ user_pool_id: "1" }])
    expect(mocked.fetchUserPools).toHaveBeenCalledTimes(1)
  })
})

describe("useUserPool", () => {
  it("fetches a single pool when an id is provided", async () => {
    mocked.fetchUserPoolById.mockResolvedValue({ user_pool_id: "1" } as never)
    const { wrapper } = makeWrapper()
    const { result } = renderHook(() => useUserPool("1"), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mocked.fetchUserPoolById).toHaveBeenCalledWith("1")
  })

  it("is disabled when no id is provided", () => {
    const { wrapper } = makeWrapper()
    const { result } = renderHook(() => useUserPool(""), { wrapper })
    expect(result.current.fetchStatus).toBe("idle")
    expect(mocked.fetchUserPoolById).not.toHaveBeenCalled()
  })
})

describe("mutations", () => {
  it("useCreateUserPool invalidates the list", async () => {
    mocked.createUserPool.mockResolvedValue({ user_pool_id: "1" } as never)
    const { queryClient, wrapper } = makeWrapper()
    const spy = vi.spyOn(queryClient, "invalidateQueries")
    const { result } = renderHook(() => useCreateUserPool(), { wrapper })
    await result.current.mutateAsync({ name: "x", display_name: "", status: "active" })
    expect(mocked.createUserPool).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith({ queryKey: userPoolKeys.lists() })
  })

  it("useUpdateUserPool invalidates the detail and the list", async () => {
    mocked.updateUserPool.mockResolvedValue({ user_pool_id: "1" } as never)
    const { queryClient, wrapper } = makeWrapper()
    const spy = vi.spyOn(queryClient, "invalidateQueries")
    const { result } = renderHook(() => useUpdateUserPool(), { wrapper })
    await result.current.mutateAsync({
      userPoolId: "1",
      data: { name: "x", display_name: "", status: "active" },
    })
    expect(mocked.updateUserPool).toHaveBeenCalledWith("1", { name: "x", display_name: "", status: "active" })
    expect(spy).toHaveBeenCalledWith({ queryKey: userPoolKeys.detail("1") })
    expect(spy).toHaveBeenCalledWith({ queryKey: userPoolKeys.lists() })
  })

  it("useDeleteUserPool invalidates the list", async () => {
    mocked.deleteUserPool.mockResolvedValue(undefined)
    const { queryClient, wrapper } = makeWrapper()
    const spy = vi.spyOn(queryClient, "invalidateQueries")
    const { result } = renderHook(() => useDeleteUserPool(), { wrapper })
    await result.current.mutateAsync("1")
    expect(mocked.deleteUserPool).toHaveBeenCalledWith("1")
    expect(spy).toHaveBeenCalledWith({ queryKey: userPoolKeys.lists() })
  })
})
