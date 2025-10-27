import * as React from "react"
import type {
	ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState
} from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PolicyToolbar } from "./PolicyToolbar"
import type { Policy, PolicyStatus } from "../constants"

interface FilterState {
  statuses: PolicyStatus[]
  isSystem: boolean | null
  hasServices: boolean | null
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function PolicyDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filters, setFilters] = React.useState<FilterState>({
    statuses: [],
    isSystem: null,
    hasServices: null
  })

  const filteredData = React.useMemo(() => {
    return (data as Policy[]).filter((policy) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = !searchQuery ||
        policy.name.toLowerCase().includes(searchLower) ||
        policy.description.toLowerCase().includes(searchLower) ||
        policy.id.toLowerCase().includes(searchLower) ||
        policy.appliedToServices.some(service => service.toLowerCase().includes(searchLower))

      // Status filter
      const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(policy.status)

      // System filter
      const matchesSystem = filters.isSystem === null || policy.isSystem === filters.isSystem

      // Services filter
      const matchesServices = filters.hasServices === null || 
        (filters.hasServices === true && policy.serviceCount > 0)

      return matchesSearch && matchesStatus && matchesSystem && matchesServices
    })
  }, [data, searchQuery, filters])

  const table = useReactTable({
    data: filteredData as TData[],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  // Active filters display
  const activeFilters = React.useMemo(() => {
    const filtersList = []
    if (filters.statuses.length > 0) {
      filtersList.push(`Status: ${filters.statuses.join(", ")}`)
    }
    if (filters.isSystem === true) {
      filtersList.push("Type: System policies")
    }
    if (filters.hasServices === true) {
      filtersList.push("Application: Applied to services")
    }
    return filtersList
  }, [filters])

  return (
    <div className="w-full space-y-4">
      <PolicyToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
          {activeFilters.map((filterText, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {filterText}
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => setFilters({
              statuses: [],
              isSystem: null,
              hasServices: null
            })}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Responsive Table Container */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="whitespace-nowrap"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Responsive Pagination */}
      <div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side - Rows per page and page info */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
        </div>

        {/* Center - Navigation buttons */}
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Right side - Results info */}
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length > 0 ? (
            <>
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{" "}
              of {table.getFilteredRowModel().rows.length} results
            </>
          ) : (
            "No results"
          )}
        </div>
      </div>
    </div>
  )
}
