import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithProviders } from "@/test/utils"
import { PolicyHistoryTab } from "./PolicyHistoryTab"
import type { PolicyVersionHistory } from "@/services/api/policies/types"

const { usePolicyHistoryMock } = vi.hoisted(() => ({
  usePolicyHistoryMock: vi.fn(),
}))

vi.mock("@/hooks/usePolicies", () => ({
  usePolicyHistory: (...args: unknown[]) => usePolicyHistoryMock(...args),
}))

function makeVersion(overrides: Partial<PolicyVersionHistory> = {}): PolicyVersionHistory {
  return {
    version_number: 2,
    document: { version: "2012-10-17", statement: [{ effect: "allow", action: ["users:read"], resource: ["*"] }] },
    snapshot_at: "2024-03-01T10:00:00Z",
    changed_by_user_id: "u1",
    ...overrides,
  }
}

const u = () => userEvent.setup({ pointerEventsCheck: 0 })

describe("PolicyHistoryTab", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    usePolicyHistoryMock.mockReturnValue({ data: undefined, isLoading: false, isError: false })
  })

  it("renders loading", () => {
    usePolicyHistoryMock.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    const { container } = renderWithProviders(<PolicyHistoryTab policyId="p1" />)
    expect(container.querySelector(".animate-pulse")).toBeTruthy()
  })

  it("renders error", () => {
    usePolicyHistoryMock.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    renderWithProviders(<PolicyHistoryTab policyId="p1" />)
    expect(screen.getByText("Failed to load history")).toBeInTheDocument()
  })

  it("renders empty", () => {
    usePolicyHistoryMock.mockReturnValue({ data: { rows: [] }, isLoading: false, isError: false })
    renderWithProviders(<PolicyHistoryTab policyId="p1" />)
    expect(screen.getByText("No history")).toBeInTheDocument()
  })

  it("renders version rows with the change author", () => {
    usePolicyHistoryMock.mockReturnValue({
      data: { rows: [makeVersion()] },
      isLoading: false,
      isError: false,
    })
    renderWithProviders(<PolicyHistoryTab policyId="p1" />)
    expect(screen.getByText("Version 2")).toBeInTheDocument()
    expect(screen.getByText(/— by u1/)).toBeInTheDocument()
  })

  it("opens the version dialog with the document JSON", async () => {
    usePolicyHistoryMock.mockReturnValue({
      data: { rows: [makeVersion()] },
      isLoading: false,
      isError: false,
    })
    renderWithProviders(<PolicyHistoryTab policyId="p1" />)
    await u().click(screen.getByRole("button", { name: /view/i }))

    const dialog = await screen.findByRole("dialog")
    expect(dialog).toHaveTextContent("Version 2")
    expect(dialog).toHaveTextContent("users:read")
  })
})
