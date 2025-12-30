"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { MemberActions } from "./MemberActions"
import type { TenantMember } from "@/services/api/tenant/members"

export const memberColumns: ColumnDef<TenantMember>[] = [
  {
    accessorKey: "user.fullname",
    id: "fullname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Member
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const member = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1 max-w-xs">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{member.user.fullname}</span>
          </div>
          <span className="text-sm text-muted-foreground truncate">{member.user.email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "user.username",
    id: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const member = row.original
      return (
        <div className="px-3 py-1">
          <span className="text-sm">{member.user.username}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    id: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const member = row.original
      return (
        <div className="px-3 py-1">
          <Badge 
            variant={member.role === "owner" ? "default" : "secondary"} 
            className="capitalize"
          >
            {member.role}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "created_at",
    id: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Added
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const member = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(member.created_at), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(member.created_at).toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const member = row.original
      return <MemberActions member={member} />
    },
  },
]
