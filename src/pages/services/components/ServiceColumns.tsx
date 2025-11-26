import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, FileText, Server } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ServiceActions } from "./ServiceActions"
import { SystemBadge, StatusBadge } from "@/components/badges"
import type { ServiceType } from "@/services/api/service/types"

export const serviceColumns: ColumnDef<ServiceType>[] = [
  {
    accessorKey: "display_name",
    id: "service",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
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
            <span className="font-medium">{service.display_name}</span>
            <SystemBadge isSystem={service.is_system} />
          </div>
          <span className="text-sm text-muted-foreground truncate">{service.description}</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Name: <span className="font-mono">{service.name}</span></span>
            <span>•</span>
            <span>Version: <span className="font-mono">{service.version}</span></span>
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
          <StatusBadge status={service.status} />
        </div>
      )
    },
  },
  {
    accessorKey: "api_count",
    id: "apis",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          APIs
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const service = row.original
      return (
        <div className="flex items-center gap-1 px-3 py-1">
          <Server className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{service.api_count}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "policy_count",
    id: "policies",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Policies
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const service = row.original
      return (
        <div className="flex items-center gap-1 px-3 py-1">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{service.policy_count}</span>
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
      const service = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(service.created_at), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(service.created_at).toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const service = row.original
      return <ServiceActions service={service} />
    },
  },
]
