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
import { SocialProviderToolbar, type FilterState } from "./SocialProviderToolbar"

interface SocialProviderDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function SocialProviderDataTable<TData, TValue>({
  columns,
  data,
}: SocialProviderDataTableProps<TData, TValue>) {
  const [filter, setFilter] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const [advancedFilters, setAdvancedFilters] = React.useState<FilterState>({
    type: [],
    status: []
  })

  const filteredData = React.useMemo(() => {
    return data.filter((item: any) => {
      // Text search
      if (filter) {
        const searchFields = [item.name, item.description, item.type, item.clientId, item.id]
        const searchText = searchFields.join(" ").toLowerCase()
        if (!searchText.includes(filter.toLowerCase())) {
          return false
        }
      }

      // Provider type filter
      if (advancedFilters.type.length > 0) {
        if (!advancedFilters.type.includes(item.type)) return false
      }

      // Status filter
      if (advancedFilters.status.length > 0) {
        if (!advancedFilters.status.includes(item.status)) return false
      }

      return true
    })
  }, [data, filter, advancedFilters])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => (row as any).id, // Use id as the unique identifier
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  // Generate active filters display
  const activeFilters = React.useMemo(() => {
    const filters: string[] = []
    
    if (advancedFilters.type.length > 0) {
      const typeNames = advancedFilters.type.map(type => 
        type.charAt(0).toUpperCase() + type.slice(1)
      )
      filters.push(...typeNames.map(name => `Type: ${name}`))
    }
    
    if (advancedFilters.status.length > 0) {
      const statusNames = advancedFilters.status.map(status => 
        status.charAt(0).toUpperCase() + status.slice(1)
      )
      filters.push(...statusNames.map(name => `Status: ${name}`))
    }
    
    return filters
  }, [advancedFilters])

  const clearAllFilters = () => {
    setFilter("")
    setAdvancedFilters({
      type: [],
      status: []
    })
  }

  return (
    <div className="space-y-4">
      <SocialProviderToolbar
        searchValue={filter}
        onSearchChange={setFilter}
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
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
            onClick={clearAllFilters}
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
