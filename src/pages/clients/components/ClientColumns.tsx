import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, CheckCircle, AlertTriangle, Monitor, Smartphone, Globe, Cog, Clock, Shield } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ClientActions } from "./ClientActions"
import type { Client, ClientStatus, ClientType } from "../constants"

const getStatusBadge = (status: ClientStatus) => {
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

const getSystemBadge = (isDefault: boolean) => {
  if (!isDefault) return null

  return (
    <Badge variant="secondary" className="text-xs">
      <Shield className="h-3 w-3 mr-1" />
      System
    </Badge>
  )
}

const getTypeBadge = (type: ClientType) => {
  const typeConfig = {
    regular: { 
      icon: Globe, 
      label: "Regular Web",
      className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200" 
    },
    native: { 
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

  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}

const formatTokenLifetime = (seconds: number) => {
  if (seconds === 0) return "No expiry"
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}

export const clientColumns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
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
            <span className="font-medium">{client.name}</span>
            {getSystemBadge(client.isDefault)}
          </div>
          <span className="text-sm text-muted-foreground truncate">{client.description}</span>
          <span className="text-xs text-muted-foreground font-mono">{client.id}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "type",
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
          {getTypeBadge(row.original.type)}
        </div>
      )
    },
  },
  {
    accessorKey: "identityProviderName",
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
          <span className="text-sm">{client.identityProviderName}</span>
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
      return (
        <div className="px-3 py-1">
          {getStatusBadge(row.original.status)}
        </div>
      )
    },
  },



  {
    accessorKey: "tokenLifetime",
    header: "Token Lifetime",
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{formatTokenLifetime(client.tokenLifetime)}</span>
          </div>
          {client.refreshTokenLifetime > 0 && (
            <div className="text-xs text-muted-foreground">
              Refresh: {formatTokenLifetime(client.refreshTokenLifetime)}
            </div>
          )}
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
      const client = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(client.createdAt), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(client.createdAt).toLocaleDateString()}
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
