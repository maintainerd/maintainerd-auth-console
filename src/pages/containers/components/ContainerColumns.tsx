import type { ColumnDef } from "@tanstack/react-table"
import { Users, ArrowUpDown, Activity, AlertTriangle, CheckCircle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ContainerActions } from "./ContainerActions"
import { format } from "date-fns"

export type ContainerStatus = "active" | "suspended" | "inactive"

export type Container = {
  id: string
  name: string
  description: string
  domain: string
  status: ContainerStatus
  userCount: number
  adminCount: number
  lastActivity: string
  createdAt: string
  createdBy: string
  features: string[]
  isSystem: boolean
}

const getStatusBadge = (status: ContainerStatus) => {
  const statusConfig = {
    active: { label: "Active", variant: "default" as const, icon: CheckCircle, className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" },
    suspended: { label: "Suspended", variant: "default" as const, icon: AlertTriangle, className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200" },
    inactive: { label: "Inactive", variant: "secondary" as const, icon: Activity, className: "" },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`flex items-center gap-1 ${config.className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

export const containerColumns: ColumnDef<Container>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tenant
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const container = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{container.name}</span>
            {container.isSystem && (
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                System
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground">{container.description}</span>
          <span className="text-xs text-muted-foreground font-mono">{container.domain}</span>
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
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as ContainerStatus
      return (
        <div className="px-3 py-1">
          {getStatusBadge(status)}
        </div>
      )
    },
  },

  {
    accessorKey: "userCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Users
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const container = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-medium">{container.userCount.toLocaleString()}</span>
          </div>
          <div className="text-sm text-muted-foreground">Admins: {container.adminCount}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "lastActivity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Activity
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const container = row.original
      const lastActivity = new Date(container.lastActivity)
      const now = new Date()
      const diffHours = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60))

      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {diffHours < 1 ? "Active now" : `${diffHours}h ago`}
          </span>
          <div className="text-xs text-muted-foreground">
            {container.features.length} features
          </div>
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
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string
      const createdBy = row.original.createdBy
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {format(new Date(createdAt), "MMM dd, yyyy")}
          </span>
          <div className="text-xs text-muted-foreground">
            by {createdBy}
          </div>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const container = row.original
      return (
        <div className="px-3 py-1">
          <ContainerActions container={container} />
        </div>
      )
    },
  },
]
