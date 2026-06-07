import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, Mail, Phone } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { UserActions } from "./UserActions"
import { DataTableColumnHeader } from "@/components/data-table"
import type { User } from "@/services/api/users/types"

type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended'

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

const getVerificationBadge = (isVerified: boolean, label: string) => {
  if (isVerified) {
    return (
      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
      <XCircle className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  )
}

export const userColumns: ColumnDef<User>[] = [
  {
    id: "User",
    accessorKey: "username",
    header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1 max-w-xs">
          <span className="font-medium">{user.fullname || user.username}</span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Mail className="w-3 h-3" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone className="w-3 h-3" />
              <span>{user.phone}</span>
            </div>
          )}
        </div>
      )
    },
  },
  {
    id: "Username",
    accessorKey: "username",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="px-3 py-1">
          <span className="font-mono text-sm">{user.username}</span>
        </div>
      )
    },
  },
  {
    id: "Verification",
    accessorKey: "is_email_verified",
    header: () => <div className="px-4">Verification</div>,
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          {getVerificationBadge(user.is_email_verified, "Email")}
          {getVerificationBadge(user.is_phone_verified, "Phone")}
        </div>
      )
    },
  },
  {
    id: "Status",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="px-3 py-1">
          {getStatusBadge(user.status)}
        </div>
      )
    },
  },
  {
    id: "Profile Status",
    accessorKey: "is_profile_completed",
    header: () => <div className="px-4">Profile Status</div>,
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <div className="flex items-center gap-2 text-sm">
            {user.is_profile_completed ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-muted-foreground">Profile</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {user.is_account_completed ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-muted-foreground">Account</span>
          </div>
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
        <div className="flex flex-col gap-1 px-3 py-1">
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
      return (
        <div className="px-3 py-1">
          <UserActions user={user} />
        </div>
      )
    },
  },
];

