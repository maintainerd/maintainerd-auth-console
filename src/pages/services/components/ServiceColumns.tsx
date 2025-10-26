import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, CheckCircle, AlertTriangle, Wrench, Archive, Shield, Server } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export type ServiceStatus = "active" | "maintenance" | "deprecated" | "inactive"

export type Service = {
  id: string
  name: string
  description: string
  status: ServiceStatus
  apiCount: number
  policyCount: number
  createdAt: string
  createdBy: string
  repository: string
  documentation: string
  isSystem: boolean
}

const getStatusBadge = (status: ServiceStatus) => {
  const statusConfig = {
    active: { 
      label: "Active", 
      variant: "default" as const, 
      icon: CheckCircle, 
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
    },
    maintenance: { 
      label: "Maintenance", 
      variant: "default" as const, 
      icon: Wrench, 
      className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200" 
    },
    deprecated: { 
      label: "Deprecated", 
      variant: "default" as const, 
      icon: Archive, 
      className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200" 
    },
    inactive: { 
      label: "Inactive", 
      variant: "secondary" as const, 
      icon: AlertTriangle, 
      className: "" 
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`${config.className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}



const getSystemBadge = (isSystem: boolean) => {
  if (!isSystem) return null
  
  return (
    <Badge variant="secondary" className="text-xs">
      <Shield className="h-3 w-3 mr-1" />
      System
    </Badge>
  )
}

export const serviceColumns: ColumnDef<Service>[] = [
  {
    accessorKey: "name",
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
      const service = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1 max-w-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium">{service.name}</span>
            {getSystemBadge(service.isSystem)}
          </div>
          <span className="text-sm text-muted-foreground truncate">{service.description}</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{service.id}</span>
          </div>
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
      const service = row.original
      return (
        <div className="px-3 py-1">
          {getStatusBadge(service.status)}
        </div>
      )
    },
  },
  {
    accessorKey: "apiCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          APIs & Policies
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const service = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <div className="flex items-center gap-1 text-sm">
            <Server className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{service.apiCount}</span>
            <span className="text-muted-foreground">APIs</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Shield className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{service.policyCount}</span>
            <span className="text-muted-foreground">Policies</span>
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const service = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(service.createdAt), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(service.createdAt).toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const service = row.original
      return <ServiceActions service={service} />
    },
  },
]

// Import ServiceActions component
import { ServiceActions } from "./ServiceActions"
