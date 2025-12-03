import * as React from "react"
import type { ColumnFiltersState, VisibilityState } from "@tanstack/react-table"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { SocialProviderToolbar } from "./SocialProviderToolbar"
import { socialProviderColumns } from "./SocialProviderColumns"
import { DataTable, DataTablePagination, DataTableActiveFilters } from "@/components/data-table"
import { useSocialProviderQuery } from "../hooks/useSocialProviderQuery"

export function SocialProviderListing() {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const columns = React.useMemo(() => socialProviderColumns, [])

  const {
    socialProviders,
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
  } = useSocialProviderQuery()

  const table = useReactTable({
    data: socialProviders,
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
    if (filters.provider.length > 0) {
      filterLabels.push(`Provider: ${filters.provider.join(", ")}`)
    }
    if (filters.isSystem !== "all") {
      const typeLabel = filters.isSystem === "system" ? "System" : "Regular"
      filterLabels.push(`Type: ${typeLabel}`)
    }
    return filterLabels
  }, [filters])

  const clearAllFilters = React.useCallback(() => {
    setFilters({
      status: [],
      provider: [],
      isSystem: "all"
    })
  }, [setFilters])

  return (
    <div className="space-y-4">
      <SocialProviderToolbar
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

