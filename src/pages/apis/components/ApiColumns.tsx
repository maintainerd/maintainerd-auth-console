import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, CheckCircle, AlertTriangle, Wrench, Archive, Key, Server, Globe } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ApiActions } from "./ApiActions"

export type ApiStatus = "active" | "maintenance" | "deprecated" | "inactive"

export type Api = {
  id: string
  name: string
  description: string
  serviceId: string
  serviceName: string
  status: ApiStatus
  permissionCount: number
  version: string
  isPublic: boolean
  createdAt: string
  createdBy: string
}

const getStatusBadge = (status: ApiStatus) => {
  const statusConfig = {
    active: { label: "Active", variant: "default" as const, icon: CheckCircle, className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" },
    maintenance: { label: "Maintenance", variant: "default" as const, icon: Wrench, className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200" },
    deprecated: { label: "Deprecated", variant: "default" as const, icon: Archive, className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200" },
    inactive: { label: "Inactive", variant: "secondary" as const, icon: AlertTriangle, className: "" },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  )
}



export const apiColumns: ColumnDef<Api>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
            <span className="font-medium">{api.name}</span>
            {api.isPublic && (
              <Badge variant="outline" className="text-xs">
                <Globe className="mr-1 h-3 w-3" />
                Public
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground truncate">{api.description}</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{api.id}</span>
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
          {getStatusBadge(api.status)}
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
