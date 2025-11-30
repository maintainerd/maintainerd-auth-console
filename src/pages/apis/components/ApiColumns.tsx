import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Server } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ApiActions } from "./ApiActions"
import { SystemBadge } from "@/components/badges"
import type { ApiType } from "@/services/api/api/types"



export const apiColumns: ColumnDef<ApiType>[] = [
  {
    accessorKey: "display_name",
    id: "api",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          API
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const api = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1 max-w-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium">{api.display_name}</span>
            <SystemBadge isSystem={api.is_default} />
          </div>
          <span className="text-sm text-muted-foreground truncate">{api.description}</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Name: <span className="font-mono">{api.name}</span></span>
            <span>•</span>
            <span>ID: <span className="font-mono">{api.identifier}</span></span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "service.display_name",
    id: "service",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Service
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const api = row.original
      return (
        <div className="flex items-center gap-2 px-3 py-1">
          <Server className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{api.service.display_name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "api_type",
    id: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const api = row.original
      return (
        <div className="px-3 py-1">
          <Badge variant="outline" className="uppercase font-mono">
            {api.api_type}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    id: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const api = row.original
      return (
        <div className="px-3 py-1">
          <Badge variant={api.status === "active" ? "secondary" : "outline"} className="capitalize">
            {api.status}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "created_at",
    id: "created",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const api = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(api.created_at), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(api.created_at).toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const api = row.original
      return <ApiActions api={api} />
    },
  },
]
