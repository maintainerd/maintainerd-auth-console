import * as React from "react"
import type { ColumnFiltersState, VisibilityState } from "@tanstack/react-table"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ApiToolbar } from "./ApiToolbar"
import { apiColumns } from "./ApiColumns"
import { DataTable, DataTablePagination, DataTableActiveFilters } from "@/components/data-table"
import { useApiQuery } from "../hooks/useApiQuery"

export function ApiListing() {
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

	const columns = React.useMemo(() => apiColumns, [])

  const {
    apis,
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
  } = useApiQuery()

  const table = useReactTable({
    data: apis,
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
    if (filters.apiType.length > 0) {
      filterLabels.push(`Type: ${filters.apiType.join(", ").toUpperCase()}`)
    }
    if (filters.isSystem !== "all") {
      const typeLabel = filters.isSystem === "system" ? "System" : "Regular"
      filterLabels.push(`System Type: ${typeLabel}`)
    }
    if (filters.serviceId) {
      filterLabels.push(`Service ID: ${filters.serviceId}`)
    }
    return filterLabels
  }, [filters])

  const clearAllFilters = React.useCallback(() => {
    setFilters({
      status: [],
      isSystem: "all",
      serviceId: "",
      apiType: []
    })
  }, [setFilters])

  return (
    <div className="space-y-4">
      <ApiToolbar
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

