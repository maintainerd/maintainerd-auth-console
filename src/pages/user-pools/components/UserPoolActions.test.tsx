import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithProviders } from "@/test/utils"
import { UserPoolActions } from "./UserPoolActions"
import type { UserPool } from "@/services/api/user-pools/types"

const navigate = vi.fn()
vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useNavigate: () => navigate,
}))

const deleteAsync = vi.fn()
const setStatusAsync = vi.fn()
vi.mock("@/hooks/useUserPools", () => ({
  useDeleteUserPool: () => ({ mutateAsync: deleteAsync, isPending: false }),
  useSetUserPoolStatus: () => ({ mutateAsync: setStatusAsync, isPending: false }),
}))

const showSuccess = vi.fn()
const showError = vi.fn()
vi.mock("@/hooks/useToast", () => ({ useToast: () => ({ showSuccess, showError }) }))

const pool: UserPool = {
  user_pool_id: "up-1",
  name: "customers",
  display_name: "Customers",
  identifier: "cust",
  is_system: false,
  status: "active",
  metadata: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
}

function setup(userPool: UserPool = pool) {
  const user = userEvent.setup({ pointerEventsCheck: 0 })
  renderWithProviders(<UserPoolActions userPool={userPool} />)
  return user
}

beforeEach(() => vi.clearAllMocks())

describe("UserPoolActions", () => {
  it("navigates to the details page on View Details", async () => {
    const user = setup()
    await user.click(screen.getByRole("button", { name: /open menu/i }))
    await user.click(await screen.findByText("View Details"))
    expect(navigate).toHaveBeenCalledWith("/t1/user-pools/up-1")
  })

  it("navigates to the edit page on Edit", async () => {
    const user = setup()
    await user.click(screen.getByRole("button", { name: /open menu/i }))
    await user.click(await screen.findByText("Edit User Pool"))
    expect(navigate).toHaveBeenCalledWith("/t1/user-pools/up-1/edit")
  })

  it("deletes after typing the confirmation name", async () => {
    deleteAsync.mockResolvedValue(undefined)
    const user = setup()
    await user.click(screen.getByRole("button", { name: /open menu/i }))
    await user.click(await screen.findByText("Delete User Pool"))
    await user.type(await screen.findByPlaceholderText(/Enter "customers" to confirm/), "customers")
    await user.click(screen.getByRole("button", { name: "Delete" }))
    expect(deleteAsync).toHaveBeenCalledWith("up-1")
    expect(showSuccess).toHaveBeenCalledWith("User pool deleted successfully")
  })

  it("surfaces an error when delete fails", async () => {
    deleteAsync.mockRejectedValue(new Error("boom"))
    const user = setup()
    await user.click(screen.getByRole("button", { name: /open menu/i }))
    await user.click(await screen.findByText("Delete User Pool"))
    await user.type(await screen.findByPlaceholderText(/Enter "customers" to confirm/), "customers")
    await user.click(screen.getByRole("button", { name: "Delete" }))
    expect(showError).toHaveBeenCalled()
  })

  it("deactivates an active pool after confirmation", async () => {
    setStatusAsync.mockResolvedValue(undefined)
    const user = setup() // pool is active
    await user.click(screen.getByRole("button", { name: /open menu/i }))
    await user.click(await screen.findByText("Deactivate"))
    await user.click(screen.getByRole("button", { name: "Deactivate" }))
    expect(setStatusAsync).toHaveBeenCalledWith({ userPoolId: "up-1", status: "inactive" })
    expect(showSuccess).toHaveBeenCalledWith("User pool deactivated")
  })

  it("activates an inactive pool", async () => {
    setStatusAsync.mockResolvedValue(undefined)
    const user = setup({ ...pool, status: "inactive" })
    await user.click(screen.getByRole("button", { name: /open menu/i }))
    await user.click(await screen.findByText("Activate"))
    await user.click(screen.getByRole("button", { name: "Activate" }))
    expect(setStatusAsync).toHaveBeenCalledWith({ userPoolId: "up-1", status: "active" })
    expect(showSuccess).toHaveBeenCalledWith("User pool activated")
  })

  it("surfaces an error when the status change fails", async () => {
    setStatusAsync.mockRejectedValue(new Error("boom"))
    const user = setup()
    await user.click(screen.getByRole("button", { name: /open menu/i }))
    await user.click(await screen.findByText("Deactivate"))
    await user.click(screen.getByRole("button", { name: "Deactivate" }))
    expect(showError).toHaveBeenCalled()
  })

  it("hides Delete and the status action for system pools (immutable, hold root users)", async () => {
    const user = setup({ ...pool, is_system: true })
    await user.click(screen.getByRole("button", { name: /open menu/i }))
    expect(await screen.findByText("View Details")).toBeInTheDocument()
    expect(screen.queryByText("Delete User Pool")).not.toBeInTheDocument()
    expect(screen.queryByText("Deactivate")).not.toBeInTheDocument()
    expect(screen.queryByText("Activate")).not.toBeInTheDocument()
  })
})
