import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithProviders } from "@/test/utils"
import { UserPoolListing } from "./UserPoolListing"
import type { UserPool } from "@/services/api/user-pools/types"

const navigate = vi.fn()
vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useNavigate: () => navigate,
}))

const useUserPoolsMock = vi.fn()
vi.mock("@/hooks/useUserPools", () => ({
  useUserPools: () => useUserPoolsMock(),
  useDeleteUserPool: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useSetUserPoolStatus: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))
vi.mock("@/hooks/useToast", () => ({ useToast: () => ({ showSuccess: vi.fn(), showError: vi.fn() }) }))

const base = { metadata: null, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" }
const pools: UserPool[] = [
  { ...base, user_pool_id: "1", name: "customers", display_name: "Customer Accounts", identifier: "cust", is_system: false, status: "active" },
  { ...base, user_pool_id: "2", name: "employees", display_name: "Staff", identifier: "emp", is_system: true, status: "inactive" },
]

function render() {
  return renderWithProviders(<UserPoolListing />)
}

beforeEach(() => {
  vi.clearAllMocks()
  useUserPoolsMock.mockReturnValue({ data: pools, isLoading: false, error: null })
})

describe("UserPoolListing", () => {
  it("renders a row per pool with identifier and status", () => {
    render()
    expect(screen.getByText("customers")).toBeInTheDocument()
    expect(screen.getByText("employees")).toBeInTheDocument()
    expect(screen.getByText("cust")).toBeInTheDocument()
    // status badges
    expect(screen.getByText("active")).toBeInTheDocument()
    expect(screen.getByText("inactive")).toBeInTheDocument()
  })

  it("handles undefined data (loading) without crashing", () => {
    useUserPoolsMock.mockReturnValue({ data: undefined, isLoading: true, error: null })
    render()
    expect(screen.queryByText("customers")).not.toBeInTheDocument()
  })

  it("filters by the search box (name/identifier)", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render()
    await user.type(screen.getByPlaceholderText(/search user pools/i), "cust{Enter}")
    expect(screen.getByText("customers")).toBeInTheDocument()
    expect(screen.queryByText("employees")).not.toBeInTheDocument()
  })

  it("filters by status and shows an active-filter chip, then clears via the chip bar", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render()
    await user.click(screen.getByRole("button", { name: /filters/i }))
    await user.click(await screen.findByLabelText("active"))
    // employees (inactive) filtered out
    expect(screen.queryByText("employees")).not.toBeInTheDocument()
    expect(screen.getByText(/Active filters:/i)).toBeInTheDocument()
    expect(screen.getByText("Status: active")).toBeInTheDocument()
    // chip-bar button is "Clear all"
    await user.click(screen.getByRole("button", { name: "Clear all" }))
    expect(screen.getByText("employees")).toBeInTheDocument()
  })

  it("clears filters from inside the popover", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render()
    await user.click(screen.getByRole("button", { name: /filters/i }))
    await user.click(await screen.findByLabelText("inactive"))
    expect(screen.queryByText("customers")).not.toBeInTheDocument()
    // popover button is "Clear All" (capital A) vs the chip bar's "Clear all"
    await user.click(screen.getByRole("button", { name: "Clear All" }))
    expect(screen.getByText("customers")).toBeInTheDocument()
    expect(screen.getByText("employees")).toBeInTheDocument()
  })

  it("toggles a status filter off again", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render()
    await user.click(screen.getByRole("button", { name: /filters/i }))
    const activeCheckbox = await screen.findByLabelText("active")
    await user.click(activeCheckbox)
    expect(screen.queryByText("employees")).not.toBeInTheDocument()
    await user.click(activeCheckbox)
    expect(screen.getByText("employees")).toBeInTheDocument()
  })

  it("sorts when column headers are clicked", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render()
    for (const header of ["User Pool", "Identifier", "Status", "Created"]) {
      await user.click(screen.getByRole("button", { name: header }))
    }
    expect(screen.getByText("customers")).toBeInTheDocument()
  })

  it("opens the details page when a row is clicked", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render()
    await user.click(screen.getByText("customers"))
    expect(navigate).toHaveBeenCalledWith("/t1/user-pools/1")
  })

  it("does not navigate when using the row actions menu; opens the confirm dialog", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render()
    // open the first row's (customers, active) actions menu and click Deactivate
    await user.click(screen.getAllByRole("button", { name: /open menu/i })[0])
    await user.click(await screen.findByText("Deactivate"))
    // the row's onRowClick must NOT fire from the portaled menu
    expect(navigate).not.toHaveBeenCalled()
    // and the confirmation dialog is shown
    expect(screen.getByRole("button", { name: "Deactivate" })).toBeInTheDocument()
  })

  it("navigates to the create page from the New button", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render()
    await user.click(screen.getByRole("button", { name: /new user pool/i }))
    expect(navigate).toHaveBeenCalledWith("/t1/user-pools/create")
  })
})
