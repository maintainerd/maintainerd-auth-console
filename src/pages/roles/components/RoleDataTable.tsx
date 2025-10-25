"use client"

import * as React from "react"
import type { ColumnDef, SortingState, ColumnFiltersState, VisibilityState } from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { RoleToolbar, type FilterState } from "./RoleToolbar"

interface RoleDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function RoleDataTable<TData, TValue>({ columns, data }: RoleDataTableProps<TData, TValue>) {
  const [filter, setFilter] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const [advancedFilters, setAdvancedFilters] = React.useState<FilterState>({
    status: [],
    isSystem: "all",
    userCount: "all"
  })



  // Apply advanced filters to data
  const filteredData = React.useMemo(() => {
    return data.filter((item: any) => {
      // Status filter
      if (advancedFilters.status.length > 0) {
        const status = item.isActive ? "active" : "inactive"
        if (!advancedFilters.status.includes(status)) {
          return false
        }
      }
      

      // System role filter
      if (advancedFilters.isSystem !== "all") {
        if (advancedFilters.isSystem === "system" && !item.isSystem) return false
        if (advancedFilters.isSystem === "custom" && item.isSystem) return false
      }
      
      // User count filter
      if (advancedFilters.userCount !== "all") {
        const userCount = item.userCount || 0
        switch (advancedFilters.userCount) {
          case "empty":
            if (userCount !== 0) return false
            break
          case "low":
            if (userCount < 1 || userCount > 5) return false
            break
          case "medium":
            if (userCount < 6 || userCount > 15) return false
            break
          case "high":
            if (userCount < 16) return false
            break
        }
      }
      
      return true
    })
  }, [data, advancedFilters])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter: filter,
    },
    onGlobalFilterChange: setFilter,
  })



  // Active filters display
  const activeFilters = React.useMemo(() => {
    const filters = []
    if (advancedFilters.status.length > 0) {
      filters.push(`Status: ${advancedFilters.status.join(", ")}`)
    }
    if (advancedFilters.isSystem !== "all") {
      filters.push(`Type: ${advancedFilters.isSystem} roles`)
    }
    if (advancedFilters.userCount !== "all") {
      const labels = {
        empty: "No users",
        low: "Few users (1-5)",
        medium: "Some users (6-15)",
        high: "Many users (16+)"
      }
      filters.push(`Users: ${labels[advancedFilters.userCount as keyof typeof labels]}`)
    }
    return filters
  }, [advancedFilters])

  const clearAllFilters = () => {
    setAdvancedFilters({
      status: [],
      isSystem: "all",
      userCount: "all"
    })
  }

  return (
    <div className="space-y-4">
      <RoleToolbar
        filter={filter}
        setFilter={setFilter}
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
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs"
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
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
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
                      <TableCell key={cell.id}>
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
        {/* Left side - Rows per page and page info */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:space-x-6 lg:space-x-8">
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
          <div className="flex items-center justify-center text-sm font-medium">
            <span className="hidden sm:inline">Page </span>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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

        {/* Right side - Selection info */}
        <div className="flex items-center justify-center sm:justify-end">
          <p className="text-sm font-medium text-center sm:text-right">
            <span className="hidden sm:inline">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected
            </span>
            <span className="sm:hidden">
              {table.getFilteredSelectedRowModel().rows.length}/{table.getFilteredRowModel().rows.length} selected
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
