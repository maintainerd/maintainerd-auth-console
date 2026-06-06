"use client"

import * as React from "react"
import type { ColumnDef, SortingState, ColumnFiltersState, VisibilityState } from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { IdentityProviderToolbar, type FilterState } from "./IdentityProviderToolbar"

interface IdentityProviderDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

/**
 * Subset of fields used for searching and filtering identity provider rows.
 */
interface FilterableProvider {
  id?: string
  name?: string
  display_name?: string
  description?: string
  identifier?: string
  provider?: string
  status?: string
  is_system?: boolean
}

export function IdentityProviderDataTable<TData, TValue>({
  columns,
  data,
}: IdentityProviderDataTableProps<TData, TValue>) {
  const [filter, setFilter] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const [advancedFilters, setAdvancedFilters] = React.useState<FilterState>({
    status: [],
    provider: [],
    isSystem: "all"
  })

  // Apply advanced filters to data
  const filteredData = React.useMemo(() => {
    return data.filter((row) => {
      const item = row as FilterableProvider

      // Search filter
      if (filter.trim()) {
        const searchValue = filter.toLowerCase()
        const searchableFields = [
          item.name,
          item.display_name,
          item.description,
          item.identifier,
          item.id
        ]
        const matchesSearch = searchableFields.some(field =>
          field?.toLowerCase().includes(searchValue)
        )
        if (!matchesSearch) return false
      }

      // Provider filter
      if (advancedFilters.provider.length > 0) {
        if (!item.provider || !advancedFilters.provider.includes(item.provider)) return false
      }

      // Status filter
      if (advancedFilters.status.length > 0) {
        if (!item.status || !advancedFilters.status.includes(item.status)) return false
      }

      // System / regular provider filter
      if (advancedFilters.isSystem !== "all") {
        const wantSystem = advancedFilters.isSystem === "system"
        if (Boolean(item.is_system) !== wantSystem) return false
      }

      return true
    })
  }, [data, advancedFilters, filter])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => (row as FilterableProvider).id ?? "", // Use id as the unique identifier
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  // Calculate active filters for display
  const activeFilters = React.useMemo(() => {
    const filters: string[] = []

    if (advancedFilters.provider.length > 0) {
      // Get provider names for display
      const providerNames = advancedFilters.provider.map(id => {
        const providerMap: Record<string, string> = {
          "internal": "Internal",
          "cognito": "AWS Cognito",
          "auth0": "Auth0"
        }
        return providerMap[id] || id
      })
      filters.push(...providerNames.map(name => `Provider: ${name}`))
    }

    if (advancedFilters.status.length > 0) {
      const statusNames = advancedFilters.status.map(status =>
        status.charAt(0).toUpperCase() + status.slice(1)
      )
      filters.push(...statusNames.map(name => `Status: ${name}`))
    }

    if (advancedFilters.isSystem !== "all") {
      filters.push(advancedFilters.isSystem === "system" ? "System Providers" : "Regular Providers")
    }

    return filters
  }, [advancedFilters])

  const clearAllFilters = () => {
    setAdvancedFilters({
      status: [],
      provider: [],
      isSystem: "all"
    })
  }

  return (
    <div className="space-y-4">
      <IdentityProviderToolbar
        filter={filter}
        setFilter={setFilter}
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
        table={table}
      />

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {filter}
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="whitespace-nowrap">
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
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
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
        {/* Left side - Rows per page and results info */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:space-x-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value: string) => {
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

        {/* Right side - Navigation buttons */}
        <div className="flex items-center space-x-2">
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


      </div>
    </div>
  )
}
