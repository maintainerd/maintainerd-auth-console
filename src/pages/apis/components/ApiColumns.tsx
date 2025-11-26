import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Key, Server, Globe } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ApiActions } from "./ApiActions"
import { SystemBadge, StatusBadge } from "@/components/badges"
import type { StatusType } from "@/types/status"

export type ApiStatus = Extract<StatusType, "active" | "maintenance" | "deprecated" | "inactive">

export type Api = {
  id: string // UUID v4 for database record
  name: string // Short name like "user-management"
  displayName: string // Display name like "User Management API"
  identifier: string // Alphanumeric random identifier for communications
  description: string
  serviceId: string
  serviceName: string
  status: ApiStatus
  permissionCount: number
  version: string
  isPublic: boolean
  isSystem: boolean // System APIs cannot be deleted
  createdAt: string
  createdBy: string
}



export const apiColumns: ColumnDef<Api>[] = [
  {
    accessorKey: "displayName",
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
            <span className="font-medium">{api.displayName}</span>
            <SystemBadge isSystem={api.isSystem} />
            {api.isPublic && (
              <Badge variant="outline" className="text-xs">
                <Globe className="mr-1 h-3 w-3" />
                Public
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground truncate">{api.description}</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Name: <span className="font-mono">{api.name}</span></span>
            <span>•</span>
            <span>ID: <span className="font-mono">{api.identifier}</span></span>
            <span>•</span>
            <span>v{api.version}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "version",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Version
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const api = row.original
      return (
        <div className="px-3 py-1">
          <Badge variant="outline" className="font-mono">
            v{api.version}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "serviceName",
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
          <span className="font-medium">{api.serviceName}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
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
          <StatusBadge status={api.status} />
        </div>
      )
    },
  },
  {
    accessorKey: "permissionCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Permissions
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const api = row.original
      return (
        <div className="flex items-center gap-1 text-sm px-3 py-1">
          <Key className="h-3 w-3 text-muted-foreground" />
          <span className="font-medium">{api.permissionCount}</span>
          <span className="text-muted-foreground">Permissions</span>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
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
      const createdAt = new Date(api.createdAt)
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            by {api.createdBy}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const api = row.original
      return <ApiActions api={api} />
    },
  },
]
