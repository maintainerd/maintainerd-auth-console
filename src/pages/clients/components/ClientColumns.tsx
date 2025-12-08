import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, CheckCircle, AlertTriangle, Monitor, Smartphone, Globe, Cog } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ClientActions } from "./ClientActions"
import { SystemBadge } from "@/components/badges"
import type { ClientType, ClientStatusType, ClientTypeEnum } from "@/services/api/auth-client/types"

const getStatusBadge = (status: ClientStatusType) => {
  const statusConfig = {
    active: {
      icon: CheckCircle,
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
    },
    inactive: {
      icon: AlertTriangle,
      className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

const getTypeBadge = (type: ClientTypeEnum) => {
  const typeConfig = {
    traditional: {
      icon: Globe,
      label: "Traditional Web",
      className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
    },
    mobile: {
      icon: Smartphone,
      label: "Native Mobile",
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
    },
    spa: {
      icon: Monitor,
      label: "Single Page App",
      className: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200"
    },
    m2m: {
      icon: Cog,
      label: "Machine to Machine",
      className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
    }
  }

  // Fallback for unknown types or legacy "native" type
  const config = typeConfig[type] || typeConfig.mobile || {
    icon: Monitor,
    label: type,
    className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
  }

  const Icon = config.icon

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}

export const clientColumns: ColumnDef<ClientType>[] = [
  {
    id: "Client",
    accessorKey: "display_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1 max-w-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium">{client.display_name}</span>
            <SystemBadge isSystem={client.is_default} />
          </div>
          <span className="text-sm text-muted-foreground truncate">{client.name}</span>
        </div>
      )
    },
  },
  {
    id: "Type",
    accessorKey: "client_type",
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
      return (
        <div className="px-3 py-1">
          {getTypeBadge(row.original.client_type)}
        </div>
      )
    },
  },
  {
    id: "Status",
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
      return (
        <div className="px-3 py-1">
          {getStatusBadge(row.original.status)}
        </div>
      )
    },
  },
  {
    id: "Identity Provider",
    accessorKey: "identity_provider.display_name",
    enableHiding: true,
    meta: {
      defaultHidden: true,
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Identity Provider
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className="px-3 py-1">
          <span className="text-sm">{client.identity_provider.display_name}</span>
        </div>
      )
    },
  },
  {
    id: "Domain",
    accessorKey: "domain",
    enableHiding: true,
    meta: {
      defaultHidden: true,
    },
    header: "Domain",
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className="px-3 py-1">
          <span className="text-sm font-mono text-muted-foreground">{client.domain}</span>
        </div>
      )
    },
  },
  {
    id: "Created",
    accessorKey: "created_at",
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
      const client = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(client.created_at), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(client.created_at).toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className="px-3 py-1">
          <ClientActions client={client} />
        </div>
      )
    },
  },
]
