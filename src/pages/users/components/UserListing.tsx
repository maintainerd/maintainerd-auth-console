import * as React from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { ColumnFiltersState, VisibilityState } from "@tanstack/react-table"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { UserToolbar } from "./UserToolbar"
import { userColumns } from "./UserColumns"
import { DataTable, DataTablePagination, DataTableActiveFilters } from "@/components/data-table"
import { useUserQuery } from "../hooks/useUserQuery"

export function UserListing() {
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const columns = React.useMemo(() => userColumns, [])

  const {
    users,
    rowCount,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    sorting,
    setSorting,
    pagination,
    setPagination,
  } = useUserQuery()

  const table = useReactTable({
    data: users,
    columns,
    pageCount: Math.ceil(rowCount / pagination.pageSize),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualSorting: true, // Server-side sorting
    manualPagination: true, // Server-side pagination
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  })

  // Get active filters for display
  const activeFilters = React.useMemo(() => {
    const filterLabels: string[] = []
    if (filters.status.length > 0) {
      filterLabels.push(`Status: ${filters.status.join(", ")}`)
    }
    return filterLabels
  }, [filters])

  const clearAllFilters = React.useCallback(() => {
    setFilters({
      status: []
    })
  }, [setFilters])

  return (
    <div className="space-y-4">
      <UserToolbar
        filter={searchQuery}
        setFilter={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
        table={table}
      />
      <DataTableActiveFilters
        activeFilters={activeFilters}
        onClearAll={clearAllFilters}
      />
      <DataTable
        table={table}
        columnCount={columns.length}
        isLoading={isLoading}
        error={error}
        onRowClick={(user) => navigate(`/${tenantId}/users/${user.user_id}`)}
      />
      <DataTablePagination table={table} />
    </div>
  )
}
