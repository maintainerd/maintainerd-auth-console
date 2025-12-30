import * as React from "react"
import type { ColumnFiltersState, VisibilityState } from "@tanstack/react-table"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { MemberToolbar } from "./MemberToolbar"
import { memberColumns } from "./MemberColumns"
import { AddMemberDialog } from "./AddMemberDialog"
import { DataTable, DataTablePagination, DataTableActiveFilters } from "@/components/data-table"
import { useMemberQuery } from "../hooks/useMemberQuery"

export function MemberListing() {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [showAddDialog, setShowAddDialog] = React.useState(false)

  const columns = React.useMemo(() => memberColumns, [])

  const {
    members,
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
  } = useMemberQuery()

  const table = useReactTable({
    data: members,
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
    if (filters.role !== "all") {
      filterLabels.push(`Role: ${filters.role}`)
    }
    return filterLabels
  }, [filters])

  const clearAllFilters = React.useCallback(() => {
    setFilters({
      role: "all"
    })
  }, [setFilters])

  return (
    <div className="space-y-4">
      <MemberToolbar
        filter={searchQuery}
        setFilter={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
        table={table}
        onAddMember={() => setShowAddDialog(true)}
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
      
      <AddMemberDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  )
}
