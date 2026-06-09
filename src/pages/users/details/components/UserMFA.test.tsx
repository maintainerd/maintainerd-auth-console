import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithProviders } from "@/test/utils"
import { UserMFA } from "./UserMFA"

const { useUserMFAMock, resetMfaMutateAsync, showSuccessMock, showErrorMock } = vi.hoisted(() => ({
  useUserMFAMock: vi.fn(),
  resetMfaMutateAsync: vi.fn(),
  showSuccessMock: vi.fn(),
  showErrorMock: vi.fn(),
}))

vi.mock("@/hooks/useUsers", () => ({
  useUserMFA: () => useUserMFAMock(),
  useResetUserMfa: () => ({ mutateAsync: resetMfaMutateAsync, isPending: false }),
}))

vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({ showSuccess: showSuccessMock, showError: showErrorMock }),
}))

function setData(overrides: Record<string, unknown> = {}) {
  useUserMFAMock.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
    ...overrides,
  })
}

describe("UserMFA", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setData()
  })

  it("renders loading", () => {
    setData({ isLoading: true })
    const { container } = renderWithProviders(<UserMFA userId="u1" />)
    expect(container.querySelector(".animate-pulse")).toBeTruthy()
  })

  it("renders error", () => {
    setData({ isError: true })
    renderWithProviders(<UserMFA userId="u1" />)
    expect(screen.getByText("Failed to load MFA configuration")).toBeInTheDocument()
  })

  it("renders method cards when nothing is enabled", () => {
    setData({ data: { is_totp_enabled: false, is_webauthn_enabled: false, is_sms_enabled: false, backup_codes_count: 0 } })
    renderWithProviders(<UserMFA userId="u1" />)
    expect(screen.getByText("TOTP")).toBeInTheDocument()
    expect(screen.getByText("SMS")).toBeInTheDocument()
    expect(screen.getByText("Passkeys")).toBeInTheDocument()
  })

  it("renders method cards and backup codes", () => {
    setData({ data: { is_totp_enabled: true, is_webauthn_enabled: true, is_sms_enabled: true, backup_codes_count: 5 } })
    renderWithProviders(<UserMFA userId="u1" />)
    expect(screen.getByText("TOTP")).toBeInTheDocument()
    expect(screen.getByText("SMS")).toBeInTheDocument()
    expect(screen.getByText("Passkeys")).toBeInTheDocument()
    expect(screen.getByText("5 unused")).toBeInTheDocument()
  })

  it("shows the Reset MFA button when any method is enabled", () => {
    setData({ data: { is_totp_enabled: true, is_webauthn_enabled: false, is_sms_enabled: false, backup_codes_count: 0 } })
    renderWithProviders(<UserMFA userId="u1" />)
    expect(screen.getByText("Reset MFA")).toBeInTheDocument()
  })

  it("resets MFA with confirmation", async () => {
    const u = userEvent.setup({ pointerEventsCheck: 0 })
    setData({ data: { is_totp_enabled: true, is_webauthn_enabled: false, is_sms_enabled: false, backup_codes_count: 0 } })
    resetMfaMutateAsync.mockResolvedValueOnce(undefined)
    renderWithProviders(<UserMFA userId="u1" />)
    await u.click(screen.getByText("Reset MFA"))
    await u.click(screen.getByRole("button", { name: "Reset MFA" }))
    await waitFor(() => expect(resetMfaMutateAsync).toHaveBeenCalledWith("u1"))
    expect(showSuccessMock).toHaveBeenCalledWith("MFA reset successfully")
  })

  it("shows error when reset fails", async () => {
    const u = userEvent.setup({ pointerEventsCheck: 0 })
    const err = new Error("fail")
    setData({ data: { is_totp_enabled: true, is_webauthn_enabled: false, is_sms_enabled: false, backup_codes_count: 0 } })
    resetMfaMutateAsync.mockRejectedValueOnce(err)
    renderWithProviders(<UserMFA userId="u1" />)
    await u.click(screen.getByText("Reset MFA"))
    await u.click(screen.getByRole("button", { name: "Reset MFA" }))
    await waitFor(() => expect(showErrorMock).toHaveBeenCalledWith(err))
  })

  it("renders WebAuthn keys list", () => {
    setData({
      data: {
        is_totp_enabled: false, is_webauthn_enabled: true, is_sms_enabled: false, backup_codes_count: 3,
        webauthn_keys: [{ credential_uuid: "c1", name: "iPhone Touch ID", transport: "internal", last_used_at: "2024-06-01T00:00:00Z", created_at: "2024-01-01T00:00:00Z" }],
      },
    })
    renderWithProviders(<UserMFA userId="u1" />)
    expect(screen.getByText("iPhone Touch ID")).toBeInTheDocument()
    expect(screen.getByText("Registered Passkeys")).toBeInTheDocument()
  })

  it("shows MFA enabled date when present", () => {
    setData({ data: { is_totp_enabled: true, is_webauthn_enabled: false, is_sms_enabled: false, backup_codes_count: 0, mfa_enabled_at: "2024-01-01T00:00:00Z" } })
    renderWithProviders(<UserMFA userId="u1" />)
    expect(screen.getByText(/MFA enabled on/)).toBeInTheDocument()
  })
})
