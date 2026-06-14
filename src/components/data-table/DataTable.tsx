import type { Table as TableType } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface DataTableProps<TData> {
  table: TableType<TData>
  columnCount: number
  emptyMessage?: string
  isLoading?: boolean
  error?: Error | null
  /** When provided, rows are clickable (except clicks on interactive controls). */
  onRowClick?: (row: TData) => void
}

export function DataTable<TData>({
  table,
  columnCount,
  emptyMessage = "No results.",
  isLoading = false,
  error = null,
  onRowClick,
}: DataTableProps<TData>) {
  return (
    <Table className="border-b text-sm">
      {/* On mobile the header is hidden and each row stacks into one column;
          the normal table layout returns at md+. The header carries a single
          bottom rule (2px) — a touch heavier than the 1px row separators. */}
      <TableHeader className="hidden md:table-header-group [&_tr]:border-b-2 [&_tr]:hover:bg-transparent">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="h-11 text-xs">
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
          {isLoading ? (
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`}>
                {Array.from({ length: columnCount }).map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className="h-5 w-full max-w-[180px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : error ? (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="h-24 text-center"
              >
                <p className="text-destructive">Failed to load data. Please try again.</p>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                // Mobile: a padded card (relative, so the actions can pin to the
                // top-right). md+: a normal table row.
                className={cn(
                  "relative block p-4 pr-14 md:static md:table-row md:p-0 md:pr-0",
                  onRowClick && "cursor-pointer",
                )}
                onClick={
                  onRowClick
                    ? (event) => {
                        const target = event.target as HTMLElement
                        // Portaled UI (the row-actions menu, confirm dialogs) lives
                        // outside the row in the DOM but bubbles here via React's
                        // tree — ignore those so they don't trigger navigation.
                        if (!event.currentTarget.contains(target)) return
                        // Ignore in-row interactive controls (e.g. the menu trigger).
                        if (target.closest("button, a, input, label")) return
                        onRowClick(row.original)
                      }
                    : undefined
                }
              >
                {row.getVisibleCells().map((cell) => {
                  const isActions = cell.column.id === "actions"
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "md:table-cell md:px-3 md:py-2.5",
                        isActions
                          ? // Mobile: pinned to the card's top-right, level with the name.
                            "absolute right-3 top-3 p-0 md:static"
                          : // Mobile: stacked, compact, card padding handles the gutters.
                            "block px-0 py-1",
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="h-24 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
  )
}

