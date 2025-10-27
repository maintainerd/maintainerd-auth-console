import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, CheckCircle, AlertTriangle, FileEdit, Shield, Server } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { PolicyActions } from "./PolicyActions"
import type { Policy, PolicyStatus } from "../constants"

const getStatusBadge = (status: PolicyStatus) => {
  const statusConfig = {
    active: { 
      label: "Active", 
      variant: "default" as const, 
      icon: CheckCircle, 
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
    },
    inactive: { 
      label: "Inactive", 
      variant: "secondary" as const, 
      icon: AlertTriangle, 
      className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200" 
    },
    draft: { 
      label: "Draft", 
      variant: "outline" as const, 
      icon: FileEdit, 
      className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" 
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`${config.className} text-xs`}>
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

export const policyColumns: ColumnDef<Policy>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Policy
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const policy = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1 max-w-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium">{policy.name}</span>
            {getSystemBadge(policy.isSystem)}
          </div>
          <span className="text-sm text-muted-foreground truncate">{policy.description}</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{policy.id}</span>
            <span>•</span>
            <span>v{policy.version}</span>
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
      const policy = row.original
      return (
        <div className="px-3 py-1">
          {getStatusBadge(policy.status)}
        </div>
      )
    },
  },
  {
    accessorKey: "serviceCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Applied To
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const policy = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <div className="flex items-center gap-1 text-sm">
            <Server className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{policy.serviceCount}</span>
            <span className="text-muted-foreground">
              {policy.serviceCount === 1 ? "Service" : "Services"}
            </span>
          </div>
          {policy.appliedToServices.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {policy.appliedToServices.slice(0, 2).map((service) => (
                <Badge key={service} variant="outline" className="text-xs">
                  {service}
                </Badge>
              ))}
              {policy.appliedToServices.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{policy.appliedToServices.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "statements",
    header: "Statements",
    cell: ({ row }) => {
      const policy = row.original
      const allowStatements = policy.statements.filter(s => s.effect === "allow").length
      const denyStatements = policy.statements.filter(s => s.effect === "deny").length
      
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{policy.statements.length}</span>
            <span className="text-muted-foreground">Total</span>
          </div>
          <div className="flex gap-2 text-xs">
            {allowStatements > 0 && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {allowStatements} Allow
              </Badge>
            )}
            {denyStatements > 0 && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {denyStatements} Deny
              </Badge>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const policy = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(policy.updatedAt), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(policy.updatedAt).toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const policy = row.original
      return (
        <div className="px-3 py-1">
          <PolicyActions policy={policy} />
        </div>
      )
    },
  },
]
