import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Mail } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { DataTableColumnHeader } from "@/components/data-table"
import type { Invite, InviteStatus } from "@/services/api/invites/types"
import { InviteActions } from "./InviteActions"

const STATUS_STYLE: Record<InviteStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
  expired: "bg-gray-100 text-gray-800 border-gray-200",
  revoked: "bg-red-100 text-red-800 border-red-200",
}

function formatDate(value?: string | null) {
  if (!value) return null
  try {
    return format(new Date(value), "PP")
  } catch {
    return null
  }
}

export const inviteColumns: ColumnDef<Invite>[] = [
  {
    id: "Email",
    accessorKey: "invited_email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-3 py-1 max-w-sm">
        <Mail className="size-4 text-muted-foreground shrink-0" />
        <span className="truncate font-medium">{row.original.invited_email}</span>
      </div>
    ),
  },
  {
    id: "Status",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <div className="px-3 py-1">
          <Badge variant="outline" className={STATUS_STYLE[status] ?? STATUS_STYLE.expired}>
            <span className="capitalize">{status}</span>
          </Badge>
        </div>
      )
    },
  },
  {
    id: "Auth flow",
    accessorKey: "auth_flow_name",
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Auth flow" />,
    cell: ({ row }) => (
      <div className="px-3 py-1">
        <span className="text-sm">
          {row.original.auth_flow_name ?? (
            <span className="text-muted-foreground">Default registration</span>
          )}
        </span>
      </div>
    ),
  },
  {
    id: "Expires",
    accessorKey: "expires_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Expires" />,
    cell: ({ row }) => {
      const expires = formatDate(row.original.expires_at)
      return (
        <div className="px-3 py-1">
          <span className="text-sm">{expires ?? "—"}</span>
        </div>
      )
    },
  },
  {
    id: "Invited",
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Invited" />,
    cell: ({ row }) => {
      const created = row.original.created_at
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(created), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(created).toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="px-3 py-1">
        <InviteActions invite={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
