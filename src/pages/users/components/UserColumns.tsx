import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { UserActions } from "./UserActions"
import { DataTableColumnHeader } from "@/components/data-table"
import type { User, UserStatus } from "@/services/api/users/types"

// First letters of the name (max two) for the avatar fallback.
const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?"

const getStatusBadge = (status: UserStatus) => {
  const statusConfig = {
    active: {
      icon: CheckCircle,
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
    },
    inactive: {
      icon: XCircle,
      className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
    },
    pending: {
      icon: AlertTriangle,
      className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
    },
    suspended: {
      icon: AlertTriangle,
      className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
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

export const userColumns: ColumnDef<User>[] = [
  {
    id: "Name",
    accessorKey: "fullname",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const user = row.original
      const name = user.fullname?.trim()
      return (
        <div className="flex items-center gap-3 py-1">
          <Avatar className="size-9">
            <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
              {initials(name || user.username)}
            </AvatarFallback>
          </Avatar>
          {name ? (
            <span className="font-medium">{name}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      )
    },
  },
  {
    id: "Username",
    accessorKey: "username",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
    cell: ({ row }) => (
      <div className="py-1 text-muted-foreground">{row.original.username}</div>
    ),
  },
  {
    id: "Status",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="py-1">
          {getStatusBadge(user.status)}
        </div>
      )
    },
  },
  {
    id: "Created",
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex flex-col gap-1 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(user.created_at).toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      return <UserActions user={user} />
    },
  },
];

