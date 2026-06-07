"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Boxes } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { UserPoolActions } from "./UserPoolActions"
import { SystemBadge } from "@/components/badges"
import type { UserPool } from "@/services/api/user-pools/types"

// Consistent sortable-header styling, applied identically to every column.
const SORT_HEADER_CLASS = "h-auto p-0 font-semibold hover:bg-transparent"

export const userPoolColumns: ColumnDef<UserPool>[] = [
  {
    accessorKey: "name",
    id: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className={SORT_HEADER_CLASS}
      >
        User Pool
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const pool = row.original
      return (
        <div className="flex max-w-xs flex-col gap-1 px-3 py-1">
          <div className="flex items-center gap-2">
            <Boxes className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{pool.name}</span>
            <SystemBadge isSystem={pool.is_system} />
          </div>
          <span className="truncate text-sm text-muted-foreground">{pool.display_name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "identifier",
    id: "identifier",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className={SORT_HEADER_CLASS}
      >
        Identifier
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="px-3 py-1">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
          {row.original.identifier}
        </code>
      </div>
    ),
  },
  {
    accessorKey: "status",
    id: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className={SORT_HEADER_CLASS}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const pool = row.original
      return (
        <div className="px-3 py-1">
          <Badge variant={pool.status === "active" ? "secondary" : "outline"} className="capitalize">
            {pool.status}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "created_at",
    id: "created",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className={SORT_HEADER_CLASS}
      >
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const pool = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(pool.created_at), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(pool.created_at).toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <UserPoolActions userPool={row.original} />,
  },
]
