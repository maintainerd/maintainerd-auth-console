import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithProviders } from "@/test/utils"
import UserPoolsPage from "./UserPoolsPage"

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useNavigate: () => vi.fn(),
}))
vi.mock("@/hooks/useUserPools", () => ({
  useUserPools: () => ({ data: [], isLoading: false, error: null }),
  useDeleteUserPool: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))
vi.mock("@/hooks/useToast", () => ({ useToast: () => ({ showSuccess: vi.fn(), showError: vi.fn() }) }))

beforeEach(() => vi.clearAllMocks())

describe("UserPoolsPage", () => {
  it("renders the page header and the listing", () => {
    renderWithProviders(<UserPoolsPage />)
    expect(screen.getByRole("heading", { name: "User Pools" })).toBeInTheDocument()
    expect(screen.getByText(/isolated namespace for users/i)).toBeInTheDocument()
    // toolbar (part of the listing) is present
    expect(screen.getByPlaceholderText(/search user pools/i)).toBeInTheDocument()
  })
})
