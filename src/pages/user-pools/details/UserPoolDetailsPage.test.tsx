import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithProviders } from "@/test/utils"
import UserPoolDetailsPage from "./UserPoolDetailsPage"
import type { UserPool } from "@/services/api/user-pools/types"

const navigate = vi.fn()
vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useNavigate: () => navigate,
}))

const useUserPoolMock = vi.fn()
vi.mock("@/hooks/useUserPools", () => ({
  useUserPool: (id: string) => useUserPoolMock(id),
  useDeleteUserPool: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))
vi.mock("@/hooks/useToast", () => ({ useToast: () => ({ showSuccess: vi.fn(), showError: vi.fn() }) }))

const pool: UserPool = {
  user_pool_id: "up-1",
  name: "customers",
  display_name: "Customer Accounts",
  identifier: "cust",
  is_system: false,
  status: "active",
  metadata: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-02T00:00:00Z",
}

function render() {
  return renderWithProviders(<UserPoolDetailsPage />, {
    route: "/t1/user-pools/up-1",
    path: "/:tenantId/user-pools/:userPoolId",
  })
}

beforeEach(() => vi.clearAllMocks())

describe("UserPoolDetailsPage", () => {
  it("shows a loading state", () => {
    useUserPoolMock.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    render()
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("shows a not-found state on error and goes back", async () => {
    useUserPoolMock.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render()
    expect(screen.getByText("User Pool Not Found")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /back to user pools/i }))
    expect(navigate).toHaveBeenCalledWith("/t1/user-pools")
  })

  it("renders the header and information on success, with a working back button", async () => {
    useUserPoolMock.mockReturnValue({ data: pool, isLoading: false, isError: false })
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render()
    expect(screen.getByRole("heading", { name: "customers" })).toBeInTheDocument()
    expect(screen.getByText("User Pool Information")).toBeInTheDocument()
    expect(screen.getByText("cust")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /back to user pools/i }))
    expect(navigate).toHaveBeenCalledWith("/t1/user-pools")
  })

  it("handles a missing userPoolId route param", () => {
    useUserPoolMock.mockReturnValue({ data: pool, isLoading: false, isError: false })
    renderWithProviders(<UserPoolDetailsPage />, {
      route: "/t1/user-pools",
      path: "/:tenantId/user-pools",
    })
    expect(screen.getByRole("heading", { name: "customers" })).toBeInTheDocument()
  })
})
