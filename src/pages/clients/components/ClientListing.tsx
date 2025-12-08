import * as React from "react"
import type { ColumnFiltersState, VisibilityState } from "@tanstack/react-table"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ClientToolbar } from "./ClientToolbar"
import { clientColumns } from "./ClientColumns"
import { DataTable, DataTablePagination, DataTableActiveFilters } from "@/components/data-table"
import { useClientQuery } from "../hooks/useClientQuery"

export function ClientListing() {
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    "Identity Provider": false,
    "Domain": false,
  })

	const columns = React.useMemo(() => clientColumns, [])

  const {
    clients,
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
  } = useClientQuery()

  const table = useReactTable({
    data: clients,
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
    if (filters.clientType.length > 0) {
      filterLabels.push(`Type: ${filters.clientType.map(t => t === "spa" ? "SPA" : t === "m2m" ? "M2M" : t).join(", ")}`)
    }
    if (filters.isSystem !== "all") {
      const typeLabel = filters.isSystem === "system" ? "System" : "Regular"
      filterLabels.push(`System Type: ${typeLabel}`)
    }
    if (filters.identityProviderId) {
      filterLabels.push(`Identity Provider ID: ${filters.identityProviderId}`)
    }
    return filterLabels
  }, [filters])

  const clearAllFilters = React.useCallback(() => {
    setFilters({
      status: [],
      clientType: [],
      isSystem: "all",
      identityProviderId: ""
    })
  }, [setFilters])

  return (
    <div className="space-y-4">
      <ClientToolbar
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
      />
      <DataTablePagination table={table} />
    </div>
  )
}

