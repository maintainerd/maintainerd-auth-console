import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithProviders } from "@/test/utils"
import { UserListing } from "./UserListing"
import type { User } from "@/services/api/users/types"

const { navigateMock, useUserQueryMock, setFiltersMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  useUserQueryMock: vi.fn(),
  setFiltersMock: vi.fn(),
}))

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom")
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock("../hooks/useUserQuery", () => ({
  useUserQuery: () => useUserQueryMock(),
}))

// UserActions (rendered inside the actions column) needs these stubbed.
vi.mock("@/hooks/useUsers", () => ({
  useUpdateUserStatus: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDeleteUser: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({ showSuccess: vi.fn(), showError: vi.fn() }),
}))

function makeUser(overrides: Partial<User> = {}): User {
  return {
    user_id: "u1",
    username: "jdoe",
    fullname: "John Doe",
    email: "jdoe@example.com",
    phone: "12345",
    is_email_verified: true,
    is_phone_verified: false,
    is_profile_completed: true,
    is_account_completed: false,
    status: "active",
    metadata: {},
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    ...overrides,
  }
}

type QueryReturn = ReturnType<typeof baseQuery>

function baseQuery(overrides: Partial<ReturnType<typeof baseQueryShape>> = {}) {
  return { ...baseQueryShape(), ...overrides }
}

function baseQueryShape() {
  return {
    users: [] as User[],
    rowCount: 0,
    isLoading: false,
    error: null as Error | null,
    searchQuery: "",
    setSearchQuery: vi.fn(),
    filters: { status: [] as string[] },
    setFilters: setFiltersMock,
    sorting: [{ id: "created_at", desc: false }],
    setSorting: vi.fn(),
    pagination: { pageIndex: 0, pageSize: 10 },
    setPagination: vi.fn(),
  }
}

function setQuery(value: QueryReturn) {
  useUserQueryMock.mockReturnValue(value)
}

const u = () => userEvent.setup({ pointerEventsCheck: 0 })

describe("UserListing", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders rows and navigates on row click", async () => {
    setQuery(
      baseQuery({
        users: [makeUser({ user_id: "u9", fullname: "Jane Doe" })],
        rowCount: 1,
      }),
    )
    const user = u()
    renderWithProviders(<UserListing />)

    const cell = screen.getByText("Jane Doe")
    await user.click(cell)
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/t1/users/u9"))
  })

  it("shows the active-filters chip and Clear all calls setFilters", async () => {
    setQuery(
      baseQuery({
        users: [makeUser()],
        rowCount: 1,
        filters: { status: ["active", "pending"] },
      }),
    )
    const user = u()
    renderWithProviders(<UserListing />)

    expect(screen.getByText("Status: active, pending")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /clear all/i }))
    expect(setFiltersMock).toHaveBeenCalledWith({ status: [] })
  })

  it("renders the loading state without crashing", () => {
    setQuery(baseQuery({ isLoading: true }))
    renderWithProviders(<UserListing />)
    expect(screen.getByPlaceholderText(/search users/i)).toBeInTheDocument()
  })

  it("renders the error state without crashing", () => {
    setQuery(baseQuery({ error: new Error("failed") }))
    renderWithProviders(<UserListing />)
    expect(screen.getByText(/failed to load data/i)).toBeInTheDocument()
  })
})
