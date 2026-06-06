import { describe, it, expect, vi } from "vitest"
import { screen } from "@testing-library/react"
import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { renderWithProviders } from "@/test/utils"
import { userColumns } from "./UserColumns"
import { DataTable } from "@/components/data-table"
import type { User, UserStatus } from "@/services/api/users/types"

// UserActions (rendered by the actions column) pulls in hooks we stub out here.
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom")
  return { ...actual, useNavigate: () => vi.fn() }
})

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

function Harness({ data }: { data: User[] }) {
  const table = useReactTable({
    data,
    columns: userColumns,
    getCoreRowModel: getCoreRowModel(),
  })
  return <DataTable table={table} columnCount={userColumns.length} />
}

const statuses: UserStatus[] = ["active", "inactive", "pending", "suspended"]

describe("userColumns", () => {
  it("renders all cell branches across multiple users", () => {
    const data: User[] = [
      // status active, fullname present, phone present, profile+account variants
      makeUser({
        user_id: "u1",
        username: "active_user",
        fullname: "Active Person",
        phone: "111",
        status: "active",
        is_profile_completed: true,
        is_account_completed: true,
        is_email_verified: true,
        is_phone_verified: true,
      }),
      // status inactive, no fullname (falls back to username), no phone
      makeUser({
        user_id: "u2",
        username: "inactive_user",
        fullname: "",
        phone: "",
        status: "inactive",
        is_profile_completed: false,
        is_account_completed: false,
        is_email_verified: false,
        is_phone_verified: false,
      }),
      makeUser({ user_id: "u3", username: "pending_user", status: "pending" }),
      makeUser({ user_id: "u4", username: "suspended_user", status: "suspended" }),
    ]

    renderWithProviders(<Harness data={data} />)

    // Headers
    expect(screen.getByText("User")).toBeInTheDocument()
    expect(screen.getByText("Username")).toBeInTheDocument()
    expect(screen.getByText("Verification")).toBeInTheDocument()
    expect(screen.getByText("Profile Status")).toBeInTheDocument()

    // status badges for each status value
    for (const s of statuses) {
      const label = s.charAt(0).toUpperCase() + s.slice(1)
      expect(screen.getByText(label)).toBeInTheDocument()
    }

    // fullname present vs fallback to username
    expect(screen.getByText("Active Person")).toBeInTheDocument()
    // u2 has empty fullname -> the "User" cell shows the username
    expect(screen.getAllByText("inactive_user").length).toBeGreaterThan(0)

    // phone present rendered
    expect(screen.getByText("111")).toBeInTheDocument()

    // verification badges (Email/Phone labels appear per row)
    expect(screen.getAllByText("Email").length).toBe(data.length)
    expect(screen.getAllByText("Phone").length).toBe(data.length)

    // profile/account labels per row
    expect(screen.getAllByText("Profile").length).toBe(data.length)
    expect(screen.getAllByText("Account").length).toBe(data.length)

    // actions menu trigger renders per row
    expect(screen.getAllByRole("button", { name: /open menu/i }).length).toBe(data.length)
  })
})
