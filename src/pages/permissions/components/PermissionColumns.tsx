import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Shield, Key, Users, Server } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { PermissionActions } from "./PermissionActions"

export type Permission = {
  name: string
  description: string
  apiId: string
  apiName: string
  isSystem: boolean
  roleCount: number
  createdAt: string
  createdBy: string
  updatedAt: string
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

export const permissionColumns: ColumnDef<Permission>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Permission
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const permission = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1 max-w-xs">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium font-mono text-sm">{permission.name}</span>
            {getSystemBadge(permission.isSystem)}
          </div>
          <span className="text-sm text-muted-foreground truncate">{permission.description}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "apiName",
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
      const permission = row.original
      return (
        <div className="flex items-center gap-2 px-3 py-1">
          <Server className="h-3 w-3 text-muted-foreground" />
          <span className="font-medium text-sm">{permission.apiName}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "roleCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Usage
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const permission = row.original
      return (
        <div className="flex items-center gap-1 px-3 py-1">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span className="font-medium">{permission.roleCount}</span>
          <span className="text-sm text-muted-foreground">roles</span>
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
      const permission = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(permission.createdAt), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            by {permission.createdBy}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const permission = row.original
      return <PermissionActions permission={permission} />
    },
  },
]
