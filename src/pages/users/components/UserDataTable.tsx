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
import { UserToolbar, type FilterState } from "./UserToolbar"

interface UserDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function UserDataTable<TData, TValue>({ columns, data }: UserDataTableProps<TData, TValue>) {
  const [filter, setFilter] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [advancedFilters, setAdvancedFilters] = React.useState<FilterState>({
    status: [],
    roles: [],
    roleSearch: "",
    emailVerified: "all",
    twoFactorEnabled: "all",
    hasLoginAttempts: false
  })

  // Extract unique roles from data for the filter
  const availableRoles = React.useMemo(() => {
    const allRoles = new Set<string>()
    data.forEach((item: any) => {
      if (item.roles && Array.isArray(item.roles)) {
        item.roles.forEach((role: string) => allRoles.add(role))
      }
    })
    return Array.from(allRoles).sort()
  }, [data])

  // Filter data based on advanced filters
  const filteredData = React.useMemo(() => {
    return data.filter((item: any) => {
      // Status filter
      if (advancedFilters.status.length > 0 && !advancedFilters.status.includes(item.status)) {
        return false
      }

      // Roles filter (selected roles)
      if (advancedFilters.roles.length > 0) {
        const hasMatchingRole = advancedFilters.roles.some(role =>
          item.roles && item.roles.includes(role)
        )
        if (!hasMatchingRole) return false
      }

      // Role search filter (search within user's roles)
      if (advancedFilters.roleSearch.trim()) {
        const searchTerm = advancedFilters.roleSearch.toLowerCase()
        const hasMatchingRoleSearch = item.roles && item.roles.some((role: string) =>
          role.toLowerCase().includes(searchTerm)
        )
        if (!hasMatchingRoleSearch) return false
      }

      // Email verification filter
      if (advancedFilters.emailVerified !== "all") {
        const isVerified = item.emailVerified === true
        if (advancedFilters.emailVerified === "verified" && !isVerified) return false
        if (advancedFilters.emailVerified === "unverified" && isVerified) return false
      }

      // 2FA filter
      if (advancedFilters.twoFactorEnabled !== "all") {
        const has2FA = item.twoFactorEnabled === true
        if (advancedFilters.twoFactorEnabled === "enabled" && !has2FA) return false
        if (advancedFilters.twoFactorEnabled === "disabled" && has2FA) return false
      }

      // Login attempts filter
      if (advancedFilters.hasLoginAttempts && (!item.loginAttempts || item.loginAttempts === 0)) {
        return false
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
    onRowSelectionChange: setRowSelection,
    globalFilterFn: (row, _columnId, value) => {
      const searchValue = value.toLowerCase()
      const user = row.original as any

      // Search in basic fields
      const basicFields = ['name', 'email', 'phone']
      const basicMatch = basicFields.some(field => {
        const fieldValue = user[field]
        return fieldValue && String(fieldValue).toLowerCase().includes(searchValue)
      })

      // Search in roles array
      const rolesMatch = user.roles && user.roles.some((role: string) =>
        role.toLowerCase().includes(searchValue)
      )

      return basicMatch || rolesMatch
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: filter,
    },
  })

  const selectedCount = Object.keys(rowSelection).length

  // Active filters display
  const activeFilters = React.useMemo(() => {
    const filters = []
    if (advancedFilters.status.length > 0) {
      filters.push(`Status: ${advancedFilters.status.join(", ")}`)
    }
    if (advancedFilters.roles.length > 0) {
      filters.push(`Selected roles: ${advancedFilters.roles.join(", ")}`)
    }
    if (advancedFilters.roleSearch.trim()) {
      filters.push(`Role search: "${advancedFilters.roleSearch}"`)
    }
    if (advancedFilters.emailVerified !== "all") {
      filters.push(`Email: ${advancedFilters.emailVerified}`)
    }
    if (advancedFilters.twoFactorEnabled !== "all") {
      filters.push(`2FA: ${advancedFilters.twoFactorEnabled}`)
    }
    if (advancedFilters.hasLoginAttempts) {
      filters.push("Has login attempts")
    }
    return filters
  }, [advancedFilters])

  return (
    <div className="space-y-4">
      <UserToolbar
        filter={filter}
        setFilter={setFilter}
        selectedCount={selectedCount}
        onFiltersChange={setAdvancedFilters}
        availableRoles={availableRoles}
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
            onClick={() => setAdvancedFilters({
              status: [],
              roles: [],
              roleSearch: "",
              emailVerified: "all",
              twoFactorEnabled: "all",
              hasLoginAttempts: false
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
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
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
