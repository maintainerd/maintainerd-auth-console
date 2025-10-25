"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { ArrowUpDown, Shield, User } from "lucide-react"
import { format } from "date-fns"
import { RoleActions } from "./RoleActions"

export type RoleStatus = "active" | "inactive"

export type Role = {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  isSystem: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
}

const getStatusBadge = (status: RoleStatus) => {
  const variants = {
    active: "default",
    inactive: "secondary"
  } as const

  const colors = {
    active: "text-green-700 bg-green-50 border-green-200",
    inactive: "text-gray-700 bg-gray-50 border-gray-200"
  } as const

  return (
    <Badge variant={variants[status]} className={colors[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

const getSystemBadge = (isSystem: boolean) => {
  if (!isSystem) return null
  
  return (
    <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200">
      <Shield className="mr-1 h-3 w-3" />
      System
    </Badge>
  )
}

export const roleColumns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const role = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{role.name}</span>
            {getSystemBadge(role.isSystem)}
          </div>
          <span className="text-sm text-muted-foreground">{role.description}</span>
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
      const userCount = row.getValue("userCount") as number
      return (
        <div className="flex items-center gap-2 px-3 py-1">
          <span className="font-medium">{userCount}</span>
          <span className="text-sm text-muted-foreground">
            {userCount === 1 ? "user" : "users"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "isActive",
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
      const isActive = row.getValue("isActive") as boolean
      return (
        <div className="px-3 py-1">
          {getStatusBadge(isActive ? "active" : "inactive")}
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
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{createdBy}</span>
          </div>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const role = row.original
      return (
        <div className="px-3 py-1">
          <RoleActions role={role} />
        </div>
      )
    },
  },
]
