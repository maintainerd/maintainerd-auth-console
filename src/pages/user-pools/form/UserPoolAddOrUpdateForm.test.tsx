import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithProviders } from "@/test/utils"
import UserPoolAddOrUpdateForm from "./UserPoolAddOrUpdateForm"
import type { UserPool } from "@/services/api/user-pools/types"

const navigate = vi.fn()
vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useNavigate: () => navigate,
}))

const useUserPoolMock = vi.fn()
const createAsync = vi.fn()
const updateAsync = vi.fn()
vi.mock("@/hooks/useUserPools", () => ({
  useUserPool: (id: string) => useUserPoolMock(id),
  useCreateUserPool: () => ({ mutateAsync: createAsync, isPending: false }),
  useUpdateUserPool: () => ({ mutateAsync: updateAsync, isPending: false }),
}))

const showSuccess = vi.fn()
const showError = vi.fn()
vi.mock("@/hooks/useToast", () => ({ useToast: () => ({ showSuccess, showError }) }))

const pool: UserPool = {
  user_pool_id: "up-1",
  name: "customers",
  display_name: "Customer Accounts",
  identifier: "cust",
  is_system: false,
  status: "active",
  metadata: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
}

function renderCreate() {
  return renderWithProviders(<UserPoolAddOrUpdateForm />, {
    route: "/t1/user-pools/create",
    path: "/:tenantId/user-pools/create",
  })
}
function renderEdit() {
  return renderWithProviders(<UserPoolAddOrUpdateForm />, {
    route: "/t1/user-pools/up-1/edit",
    path: "/:tenantId/user-pools/:userPoolId/edit",
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  useUserPoolMock.mockReturnValue({ data: undefined, isLoading: false })
})

describe("UserPoolAddOrUpdateForm — create", () => {
  it("creates a pool and navigates back to the list", async () => {
    createAsync.mockResolvedValue(pool)
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    renderCreate()

    expect(screen.getByRole("heading", { name: "Create User Pool" })).toBeInTheDocument()
    await user.type(screen.getByPlaceholderText(/e\.g\., customers/i), "partners")
    await user.click(screen.getByRole("button", { name: "Create User Pool" }))

    await waitFor(() => expect(createAsync).toHaveBeenCalled())
    expect(createAsync).toHaveBeenCalledWith({ name: "partners", display_name: "", status: "active" })
    expect(showSuccess).toHaveBeenCalledWith("User pool created successfully")
    expect(navigate).toHaveBeenCalledWith("/t1/user-pools")
  })

  it("shows a validation error when name is empty", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    renderCreate()
    await user.click(screen.getByRole("button", { name: "Create User Pool" }))
    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument()
    expect(createAsync).not.toHaveBeenCalled()
  })

  it("shows a validation error when display name is too long", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    renderCreate()
    await user.type(screen.getByPlaceholderText(/e\.g\., customers/i), "partners")
    await user.click(screen.getByPlaceholderText(/Customer Accounts/i))
    await user.paste("a".repeat(151))
    await user.click(screen.getByRole("button", { name: "Create User Pool" }))
    expect(await screen.findByText(/not exceed 150/i)).toBeInTheDocument()
    expect(createAsync).not.toHaveBeenCalled()
  })

  it("surfaces an error when creation fails", async () => {
    createAsync.mockRejectedValue(new Error("boom"))
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    renderCreate()
    await user.type(screen.getByPlaceholderText(/e\.g\., customers/i), "partners")
    await user.click(screen.getByRole("button", { name: "Create User Pool" }))
    await waitFor(() => expect(showError).toHaveBeenCalled())
  })

  it("cancels back to the list", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    renderCreate()
    await user.click(screen.getByRole("button", { name: /cancel/i }))
    expect(navigate).toHaveBeenCalledWith("/t1/user-pools")
  })
})

describe("UserPoolAddOrUpdateForm — edit", () => {
  it("loads existing values and updates", async () => {
    updateAsync.mockResolvedValue(pool)
    useUserPoolMock.mockReturnValue({ data: pool, isLoading: false })
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    renderEdit()

    expect(await screen.findByDisplayValue("customers")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Update User Pool" }))

    await waitFor(() => expect(updateAsync).toHaveBeenCalled())
    expect(updateAsync).toHaveBeenCalledWith({
      userPoolId: "up-1",
      data: { name: "customers", display_name: "Customer Accounts", status: "active" },
    })
    expect(showSuccess).toHaveBeenCalledWith("User pool updated successfully")
    expect(navigate).toHaveBeenCalledWith("/t1/user-pools")
  })

  it("shows a loading state while fetching", () => {
    useUserPoolMock.mockReturnValue({ data: undefined, isLoading: true })
    renderEdit()
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("shows a not-found state when the pool is missing and goes back", async () => {
    useUserPoolMock.mockReturnValue({ data: undefined, isLoading: false })
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    renderEdit()
    expect(screen.getByText("User Pool Not Found")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /back to user pools/i }))
    expect(navigate).toHaveBeenCalledWith("/t1/user-pools")
  })

  it("disables editing for system pools", async () => {
    useUserPoolMock.mockReturnValue({ data: { ...pool, is_system: true }, isLoading: false })
    renderEdit()
    expect(await screen.findByDisplayValue("customers")).toBeDisabled()
    expect(screen.getByRole("button", { name: "Update User Pool" })).toBeDisabled()
    expect(screen.getByText(/system user pool/i)).toBeInTheDocument()
  })
})
