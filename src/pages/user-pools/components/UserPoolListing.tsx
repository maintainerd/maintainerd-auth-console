import * as React from "react"
import type { SortingState, VisibilityState, PaginationState } from "@tanstack/react-table"
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { UserPoolToolbar } from "./UserPoolToolbar"
import { DEFAULT_USER_POOL_FILTERS, type FilterState } from "./userPoolFilters"
import { userPoolColumns } from "./UserPoolColumns"
import { DataTable, DataTablePagination, DataTableActiveFilters } from "@/components/data-table"
import { useUserPools } from "@/hooks/useUserPools"

export function UserPoolListing() {
  const columns = React.useMemo(() => userPoolColumns, [])

  const [search, setSearch] = React.useState("")
  const [filters, setFilters] = React.useState<FilterState>(DEFAULT_USER_POOL_FILTERS)
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "name", desc: false }])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  const { data, isLoading, error } = useUserPools()
  // Memoize so the table receives a STABLE data reference. Without this, `data ?? []`
  // is a new array every render, which makes react-table's autoResetPageIndex fire
  // onPaginationChange on each render → infinite re-render loop (the app freezes).
  const pools = React.useMemo(() => data ?? [], [data])

  // The list endpoint returns every pool at once, so search + filters are applied client-side.
  const filteredPools = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    return pools.filter((pool) => {
      if (
        query &&
        !(
          pool.name.toLowerCase().includes(query) ||
          pool.display_name.toLowerCase().includes(query) ||
          pool.identifier.toLowerCase().includes(query)
        )
      ) {
        return false
      }
      if (filters.status.length > 0 && !filters.status.includes(pool.status)) return false
      if (filters.isSystem === "system" && !pool.is_system) return false
      if (filters.isSystem === "regular" && pool.is_system) return false
      return true
    })
  }, [pools, search, filters])

  const table = useReactTable({
    data: filteredPools,
    columns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination,
      columnVisibility,
    },
  })

  const activeFilters = React.useMemo(() => {
    const labels: string[] = []
    if (filters.status.length > 0) {
      labels.push(`Status: ${filters.status.join(", ")}`)
    }
    if (filters.isSystem !== "all") {
      labels.push(`System Type: ${filters.isSystem === "system" ? "System" : "Regular"}`)
    }
    return labels
  }, [filters])

  const clearAllFilters = React.useCallback(() => {
    setFilters(DEFAULT_USER_POOL_FILTERS)
  }, [])

  return (
    <div className="space-y-4">
      <UserPoolToolbar
        filter={search}
        setFilter={setSearch}
        filters={filters}
        onFiltersChange={setFilters}
        table={table}
      />
      <DataTableActiveFilters activeFilters={activeFilters} onClearAll={clearAllFilters} />
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
