import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserActions } from "./UserActions"
import { formatDistanceToNow } from "date-fns"
import { StatusBadge } from "@/components/badges"
import type { StatusType } from "@/types/status"

export type UserStatus = Extract<StatusType, "active" | "inactive" | "pending" | "suspended">

export type User = {
  id: string // UUID identifier
  username: string
  email: string
  phone?: string
  roles: string[]
  status: UserStatus
  createdAt: string
  lastLogin?: string
  emailVerified: boolean
  isActive: boolean
  twoFactorEnabled: boolean
  loginAttempts: number
  lastPasswordChange?: string
}

export type UserProfile = {
  userId: string
  firstName?: string
  lastName?: string
  displayName?: string
  avatar?: string
  bio?: string
  birthDate?: string
  gender?: string
  phoneNumber?: string
  address?: string
  city?: string
  country?: string
  timezone?: string
  language?: string
  customFields?: Record<string, string>
}



export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-3 px-3 py-1">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt={user.username} />
            <AvatarFallback className="text-xs">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.username}</span>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "roles",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Roles
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const roles = row.getValue("roles") as string[]
      return (
        <div className="flex flex-wrap gap-1 px-3 py-1">
          {roles.map((role, index) => (
            <Badge key={index} variant="outline" className="font-medium text-xs">
              {role}
            </Badge>
          ))}
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
      const status = row.getValue("status") as UserStatus
      return (
        <div className="px-3 py-1">
          <StatusBadge status={status} />
        </div>
      )
    },
  },
  {
    accessorKey: "emailVerified",
    header: "Email Status",
    cell: ({ row }) => {
      const emailVerified = row.getValue("emailVerified") as boolean
      const twoFactorEnabled = row.original.twoFactorEnabled

      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <Badge
            variant="default"
            className={`text-xs w-fit ${emailVerified ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"}`}
          >
            {emailVerified ? "Verified" : "Unverified"}
          </Badge>
          {twoFactorEnabled && (
            <Badge variant="secondary" className="text-xs w-fit">
              2FA Enabled
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "lastLogin",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Login
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const lastLogin = row.getValue("lastLogin") as string
      return (
        <div className="px-3 py-1">
          {lastLogin ? (
            <span className="text-sm">
              {formatDistanceToNow(new Date(lastLogin), { addSuffix: true })}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">Never</span>
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
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string
      return (
        <div className="px-3 py-1">
          <span className="text-sm">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="px-3 py-1">
          <UserActions user={user}>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </UserActions>
        </div>
      )
    },
  },
]
