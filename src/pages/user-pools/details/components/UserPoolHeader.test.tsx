import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithProviders } from "@/test/utils"
import { UserPoolHeader } from "./UserPoolHeader"

const navigate = vi.fn()
vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useNavigate: () => navigate,
}))

const deleteAsync = vi.fn()
vi.mock("@/hooks/useUserPools", () => ({
  useDeleteUserPool: () => ({ mutateAsync: deleteAsync, isPending: false }),
}))

const showSuccess = vi.fn()
const showError = vi.fn()
vi.mock("@/hooks/useToast", () => ({ useToast: () => ({ showSuccess, showError }) }))

const baseUserPool = {
  name: "customers",
  display_name: "Customer Accounts",
  status: "active" as const,
  is_system: false,
}

function setup(userPool = baseUserPool) {
  const user = userEvent.setup({ pointerEventsCheck: 0 })
  renderWithProviders(<UserPoolHeader userPool={userPool} tenantId="t1" userPoolId="up-1" />)
  return user
}

beforeEach(() => vi.clearAllMocks())

describe("UserPoolHeader", () => {
  it("renders name, status and display name", () => {
    setup()
    expect(screen.getByRole("heading", { name: "customers" })).toBeInTheDocument()
    expect(screen.getByText("active")).toBeInTheDocument()
    expect(screen.getByText("Customer Accounts")).toBeInTheDocument()
  })

  it("omits the display name line when empty", () => {
    setup({ ...baseUserPool, display_name: "" })
    expect(screen.queryByText("Customer Accounts")).not.toBeInTheDocument()
  })

  it("renders an inactive status badge", () => {
    setup({ ...baseUserPool, status: "inactive" })
    expect(screen.getByText("inactive")).toBeInTheDocument()
  })

  it("shows a System badge for system pools and hides Delete", async () => {
    const user = setup({ ...baseUserPool, is_system: true })
    expect(screen.getByText("System")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /actions/i }))
    expect(await screen.findByText("Edit User Pool")).toBeInTheDocument()
    expect(screen.queryByText("Delete User Pool")).not.toBeInTheDocument()
  })

  it("navigates to edit", async () => {
    const user = setup()
    await user.click(screen.getByRole("button", { name: /actions/i }))
    await user.click(await screen.findByText("Edit User Pool"))
    expect(navigate).toHaveBeenCalledWith("/t1/user-pools/up-1/edit")
  })

  it("deletes after confirmation and navigates back", async () => {
    deleteAsync.mockResolvedValue(undefined)
    const user = setup()
    await user.click(screen.getByRole("button", { name: /actions/i }))
    await user.click(await screen.findByText("Delete User Pool"))
    await user.type(await screen.findByPlaceholderText(/Enter "customers" to confirm/), "customers")
    await user.click(screen.getByRole("button", { name: "Delete" }))
    expect(deleteAsync).toHaveBeenCalledWith("up-1")
    expect(showSuccess).toHaveBeenCalledWith("User pool deleted successfully")
    expect(navigate).toHaveBeenCalledWith("/t1/user-pools")
  })

  it("surfaces a delete error", async () => {
    deleteAsync.mockRejectedValue(new Error("boom"))
    const user = setup()
    await user.click(screen.getByRole("button", { name: /actions/i }))
    await user.click(await screen.findByText("Delete User Pool"))
    await user.type(await screen.findByPlaceholderText(/Enter "customers" to confirm/), "customers")
    await user.click(screen.getByRole("button", { name: "Delete" }))
    expect(showError).toHaveBeenCalled()
  })
})
