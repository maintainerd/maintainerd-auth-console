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
import { LogToolbar, type LogFilterState } from "./LogToolbar"
import type { LogEntry } from "../constants"

interface LogDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function LogDataTable<TData, TValue>({ columns, data }: LogDataTableProps<TData, TValue>) {
  const [filter, setFilter] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "timestamp", desc: true }])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isLiveMode, setIsLiveMode] = React.useState(false)
  const [advancedFilters, setAdvancedFilters] = React.useState<LogFilterState>({
    levels: [],
    services: [],
    status: [],
    timeRange: "24h",
    ipAddress: "",
    userId: "",
    requestId: "",
    tags: [],
    hasError: false,
    hasUser: false,
    minResponseTime: "",
    maxResponseTime: ""
  })

  // Apply advanced filters to data
  const filteredData = React.useMemo(() => {
    let filtered = data as LogEntry[]

    // Apply advanced filters
    if (advancedFilters.levels.length > 0) {
      filtered = filtered.filter(log => advancedFilters.levels.includes(log.level))
    }



    if (advancedFilters.services.length > 0) {
      filtered = filtered.filter(log => advancedFilters.services.includes(log.service))
    }

    if (advancedFilters.status.length > 0) {
      filtered = filtered.filter(log => advancedFilters.status.includes(log.status))
    }

    if (advancedFilters.ipAddress.trim()) {
      filtered = filtered.filter(log => 
        log.ipAddress.toLowerCase().includes(advancedFilters.ipAddress.toLowerCase())
      )
    }

    if (advancedFilters.userId.trim()) {
      filtered = filtered.filter(log => 
        log.userId?.toLowerCase().includes(advancedFilters.userId.toLowerCase())
      )
    }

    if (advancedFilters.requestId.trim()) {
      filtered = filtered.filter(log => 
        log.requestId?.toLowerCase().includes(advancedFilters.requestId.toLowerCase())
      )
    }

    if (advancedFilters.tags.length > 0) {
      filtered = filtered.filter(log => 
        advancedFilters.tags.some(tag => log.tags.includes(tag))
      )
    }

    if (advancedFilters.minResponseTime.trim()) {
      const minTime = parseInt(advancedFilters.minResponseTime)
      if (!isNaN(minTime)) {
        filtered = filtered.filter(log => (log.responseTime || 0) >= minTime)
      }
    }

    if (advancedFilters.maxResponseTime.trim()) {
      const maxTime = parseInt(advancedFilters.maxResponseTime)
      if (!isNaN(maxTime)) {
        filtered = filtered.filter(log => (log.responseTime || 0) <= maxTime)
      }
    }

    if (advancedFilters.hasError) {
      filtered = filtered.filter(log => log.level === "error" || log.status === "failure")
    }

    if (advancedFilters.hasUser) {
      filtered = filtered.filter(log => log.userId && log.userEmail)
    }

    // Apply time range filter
    if (advancedFilters.timeRange !== "all") {
      const now = new Date()
      let cutoffTime: Date

      switch (advancedFilters.timeRange) {
        case "5m":
          cutoffTime = new Date(now.getTime() - 5 * 60 * 1000)
          break
        case "15m":
          cutoffTime = new Date(now.getTime() - 15 * 60 * 1000)
          break
        case "1h":
          cutoffTime = new Date(now.getTime() - 60 * 60 * 1000)
          break
        case "6h":
          cutoffTime = new Date(now.getTime() - 6 * 60 * 60 * 1000)
          break
        case "24h":
          cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          break
        case "7d":
          cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case "30d":
          cutoffTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        default:
          cutoffTime = new Date(0)
      }

      filtered = filtered.filter(log => new Date(log.timestamp) >= cutoffTime)
    }

    return filtered
  }, [data, advancedFilters])

  const selectedCount = Object.keys(rowSelection).length

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
      const log = row.original as LogEntry

      // Search in multiple fields
      const searchFields = [
        log.message,
        log.userEmail,
        log.ipAddress,
        log.requestId,
        log.service,
        log.endpoint,
        log.source,
        ...log.tags
      ]

      return searchFields.some(field => {
        return field && String(field).toLowerCase().includes(searchValue)
      })
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: filter,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  })

  return (
    <div className="space-y-4">
      <LogToolbar
        filter={filter}
        setFilter={setFilter}
        selectedCount={selectedCount}
        onFiltersChange={setAdvancedFilters}
        isLiveMode={isLiveMode}
        onToggleLiveMode={() => setIsLiveMode(!isLiveMode)}
      />

      {/* Live Mode Indicator */}
      {isLiveMode && (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-700 font-medium">Live mode active - logs updating in real-time</span>
        </div>
      )}

      {/* Applied Filters Summary */}
      {(advancedFilters.levels.length > 0 ||
        advancedFilters.services.length > 0 ||
        advancedFilters.status.length > 0 ||
        advancedFilters.tags.length > 0) && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md">
          <span className="text-sm font-medium">Active filters:</span>
          {advancedFilters.levels.map(level => (
            <Badge key={level} variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
              Level: {level}
            </Badge>
          ))}
          {advancedFilters.services.map(service => (
            <Badge key={service} variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
              Service: {service}
            </Badge>
          ))}
          {advancedFilters.status.map(status => (
            <Badge key={status} variant="outline" className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
              Status: {status}
            </Badge>
          ))}
          {advancedFilters.tags.map(tag => (
            <Badge key={tag} variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 text-xs">
              Tag: {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {table.getFilteredRowModel().rows.length} of {(data as LogEntry[]).length} logs
          {filter && ` matching "${filter}"`}
        </div>
        <div>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

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
                    className="hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No logs found.
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
                {[10, 20, 30, 50, 100].map((pageSize) => (
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

        {/* Right side - Pagination controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
