import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { renderWithProviders } from "@/test/utils"
import { UserToolbar, type FilterState } from "./UserToolbar"
import { userColumns } from "./UserColumns"
import type { User } from "@/services/api/users/types"

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }))

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom")
  return { ...actual, useNavigate: () => navigateMock }
})

const u = () => userEvent.setup({ pointerEventsCheck: 0 })

function Harness({
  filter = "",
  filters = { status: [] },
  setFilter = vi.fn(),
  onFiltersChange = vi.fn(),
}: {
  filter?: string
  filters?: FilterState
  setFilter?: (v: string) => void
  onFiltersChange?: (f: FilterState) => void
}) {
  const table = useReactTable({
    data: [] as User[],
    columns: userColumns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <UserToolbar
      filter={filter}
      setFilter={setFilter}
      filters={filters}
      onFiltersChange={onFiltersChange}
      table={table}
    />
  )
}

describe("UserToolbar", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("triggers search on Enter", async () => {
    const setFilter = vi.fn()
    const user = u()
    renderWithProviders(<Harness setFilter={setFilter} />)
    const input = screen.getByPlaceholderText(/search users/i)
    await user.type(input, "alice{Enter}")
    await waitFor(() => expect(setFilter).toHaveBeenCalledWith("alice"))
  })

  it("toggles a status checkbox on and off", async () => {
    const onFiltersChange = vi.fn()
    const user = u()
    renderWithProviders(
      <Harness filters={{ status: [] }} onFiltersChange={onFiltersChange} />,
    )

    await user.click(screen.getByRole("button", { name: /filters/i }))

    // Turn "active" on
    const activeCheckbox = await screen.findByLabelText("active")
    await user.click(activeCheckbox)
    expect(onFiltersChange).toHaveBeenLastCalledWith({ status: ["active"] })
  })

  it("removes a status when its checkbox is unchecked", async () => {
    const onFiltersChange = vi.fn()
    const user = u()
    renderWithProviders(
      <Harness filters={{ status: ["active"] }} onFiltersChange={onFiltersChange} />,
    )

    await user.click(screen.getByRole("button", { name: /filters/i }))

    const activeCheckbox = await screen.findByLabelText("active")
    await user.click(activeCheckbox)
    expect(onFiltersChange).toHaveBeenLastCalledWith({ status: [] })
  })

  it("clears all filters via Clear All (only shown when active)", async () => {
    const onFiltersChange = vi.fn()
    const user = u()
    renderWithProviders(
      <Harness filters={{ status: ["active", "pending"] }} onFiltersChange={onFiltersChange} />,
    )

    await user.click(screen.getByRole("button", { name: /filters/i }))
    await user.click(await screen.findByRole("button", { name: /clear all/i }))
    expect(onFiltersChange).toHaveBeenCalledWith({ status: [] })
  })

  it("navigates to create user", async () => {
    const user = u()
    renderWithProviders(<Harness />)
    await user.click(screen.getByRole("button", { name: /new user/i }))
    expect(navigateMock).toHaveBeenCalledWith("/t1/users/create")
  })
})
