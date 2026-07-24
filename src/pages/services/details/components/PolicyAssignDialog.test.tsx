import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithProviders } from "@/test/utils"
import { PolicyAssignDialog } from "./PolicyAssignDialog"
import type { Policy } from "@/services/api/policies/types"

const { usePoliciesMock, assignMutateAsync, assignState, showSuccessMock, showErrorMock } =
  vi.hoisted(() => ({
    usePoliciesMock: vi.fn(),
    assignMutateAsync: vi.fn(),
    assignState: { isPending: false },
    showSuccessMock: vi.fn(),
    showErrorMock: vi.fn(),
  }))

vi.mock("@/hooks/usePolicies", () => ({
  usePolicies: (...args: unknown[]) => usePoliciesMock(...args),
}))

vi.mock("../hooks/useServicePolicyMutations", () => ({
  useServicePolicyMutations: () => ({
    assignPolicy: { mutateAsync: assignMutateAsync, isPending: assignState.isPending },
    removePolicy: { mutateAsync: vi.fn(), isPending: false },
  }),
}))

vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({ showSuccess: showSuccessMock, showError: showErrorMock }),
}))

function makePolicy(overrides: Partial<Policy> = {}): Policy {
  return {
    policy_id: "p1",
    name: "read-only",
    description: "Read only access",
    version: "1.0.0",
    status: "active",
    is_system: false,
    created_at: "",
    updated_at: "",
    ...overrides,
  }
}

function setPolicies(rows: Policy[], overrides: Record<string, unknown> = {}) {
  usePoliciesMock.mockReturnValue({ data: { rows, total: rows.length }, isLoading: false, ...overrides })
}

const u = () => userEvent.setup({ pointerEventsCheck: 0 })

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  serviceId: "s1",
  existingPolicyIds: [] as string[],
}

describe("PolicyAssignDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    assignState.isPending = false
    setPolicies([])
  })

  it("disables the policies query while closed", () => {
    setPolicies([])
    renderWithProviders(<PolicyAssignDialog {...baseProps} open={false} />)
    expect(usePoliciesMock).toHaveBeenCalledWith(expect.anything(), { enabled: false })
  })

  it("shows the loading state while policies load", () => {
    usePoliciesMock.mockReturnValue({ data: undefined, isLoading: true })
    renderWithProviders(<PolicyAssignDialog {...baseProps} />)
    expect(screen.getByText("Loading policies...")).toBeInTheDocument()
  })

  it("shows the all-assigned empty state and excludes assigned policies", () => {
    setPolicies([makePolicy()])
    renderWithProviders(<PolicyAssignDialog {...baseProps} existingPolicyIds={["p1"]} />)
    expect(screen.getByText("All available policies are already assigned")).toBeInTheDocument()
    expect(screen.queryByText("read-only")).not.toBeInTheDocument()
  })

  it("filters by search and shows the no-match state", async () => {
    setPolicies([makePolicy()])
    renderWithProviders(<PolicyAssignDialog {...baseProps} />)
    await u().type(screen.getByPlaceholderText("Search policies..."), "zzz")
    expect(screen.getByText("No policies found matching your search")).toBeInTheDocument()
  })

  it("renders the system badge on policies", () => {
    setPolicies([makePolicy({ is_system: true })])
    renderWithProviders(<PolicyAssignDialog {...baseProps} />)
    expect(screen.getByText("System")).toBeInTheDocument()
  })

  it("toggles select-all and deselect-all", async () => {
    setPolicies([makePolicy(), makePolicy({ policy_id: "p2", name: "admin-policy" })])
    renderWithProviders(<PolicyAssignDialog {...baseProps} />)
    await u().click(screen.getByRole("button", { name: "Select All" }))
    expect(screen.getByText("2 policies selected")).toBeInTheDocument()
    await u().click(screen.getByRole("button", { name: "Deselect All" }))
    expect(screen.queryByText("2 policies selected")).not.toBeInTheDocument()
  })

  it("keeps the Assign button disabled with no selection", () => {
    setPolicies([makePolicy()])
    renderWithProviders(<PolicyAssignDialog {...baseProps} />)
    expect(screen.getByRole("button", { name: /assign policies/i })).toBeDisabled()
  })

  it("assigns the selected policies and closes on success", async () => {
    assignMutateAsync.mockResolvedValue(undefined)
    const onOpenChange = vi.fn()
    setPolicies([makePolicy()])
    renderWithProviders(<PolicyAssignDialog {...baseProps} onOpenChange={onOpenChange} />)

    await u().click(screen.getByRole("checkbox"))
    await u().click(screen.getByRole("button", { name: /assign policies/i }))

    await waitFor(() => expect(assignMutateAsync).toHaveBeenCalledWith("p1"))
    expect(showSuccessMock).toHaveBeenCalledWith("1 policy assigned successfully")
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("assigns multiple policies and shows the plural success message", async () => {
    assignMutateAsync.mockResolvedValue(undefined)
    setPolicies([makePolicy(), makePolicy({ policy_id: "p2", name: "admin-policy" })])
    renderWithProviders(<PolicyAssignDialog {...baseProps} />)

    await u().click(screen.getByRole("button", { name: "Select All" }))
    await u().click(screen.getByRole("button", { name: /assign policies/i }))

    await waitFor(() => expect(assignMutateAsync).toHaveBeenCalledTimes(2))
    expect(showSuccessMock).toHaveBeenCalledWith("2 policies assigned successfully")
  })

  it("shows an error when assigning rejects", async () => {
    const err = new Error("fail")
    assignMutateAsync.mockRejectedValueOnce(err)
    setPolicies([makePolicy()])
    renderWithProviders(<PolicyAssignDialog {...baseProps} />)

    await u().click(screen.getByRole("checkbox"))
    await u().click(screen.getByRole("button", { name: /assign policies/i }))

    await waitFor(() => expect(showErrorMock).toHaveBeenCalledWith(err))
  })

  it("shows the Assigning... label while the mutation is pending", () => {
    assignState.isPending = true
    setPolicies([makePolicy()])
    renderWithProviders(<PolicyAssignDialog {...baseProps} />)
    expect(screen.getByText("Assigning...")).toBeInTheDocument()
  })

  it("cancel calls onOpenChange(false)", async () => {
    const onOpenChange = vi.fn()
    setPolicies([makePolicy()])
    renderWithProviders(<PolicyAssignDialog {...baseProps} onOpenChange={onOpenChange} />)
    await u().click(screen.getByRole("button", { name: "Cancel" }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
