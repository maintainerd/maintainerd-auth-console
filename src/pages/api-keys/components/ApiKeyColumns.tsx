import type { ColumnDef } from "@tanstack/react-table"
import { KeyRound, TimerReset } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ApiKeyActions } from "./ApiKeyActions"
import { DataTableColumnHeader } from "@/components/data-table"
import { StatusBadge } from "@/components/badges"
import type { ApiKey } from "@/services/api/api-keys/types"

export const apiKeyColumns: ColumnDef<ApiKey>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="API Key" />,
    cell: ({ row }) => {
      const apiKey = row.original
      return (
        <div className="flex items-center gap-3 px-3 py-1 max-w-sm">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted/50">
            <KeyRound className="size-4 text-muted-foreground" />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-medium truncate">{apiKey.name}</span>
            <span className="text-sm text-muted-foreground truncate">{apiKey.description || "No description"}</span>
            <span className="text-xs text-muted-foreground font-mono truncate">{apiKey.key_prefix}</span>
          </div>
        </div>
      )
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      return (
        <div className="px-3 py-1">
          <StatusBadge status={row.original.status} />
        </div>
      )
    },
  },
  {
    id: "rate_limit",
    accessorKey: "rate_limit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rate Limit" />,
    cell: ({ row }) => {
      const apiKey = row.original
      return (
        <div className="flex items-center gap-2 px-3 py-1 text-sm">
          <TimerReset className="size-4 text-muted-foreground" />
          <span className="font-medium">{apiKey.rate_limit.toLocaleString()}</span>
          <span className="text-muted-foreground">req/hour</span>
        </div>
      )
    },
  },
  {
    id: "expires_at",
    accessorKey: "expires_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Expires" />,
    cell: ({ row }) => {
      const apiKey = row.original
      if (!apiKey.expires_at) {
        return (
          <div className="px-3 py-1">
            <span className="text-sm text-muted-foreground">Never</span>
          </div>
        )
      }

      const expiresAt = new Date(apiKey.expires_at)
      const isExpired = expiresAt < new Date()

      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className={`text-sm font-medium ${isExpired ? "text-destructive" : ""}`}>
            {formatDistanceToNow(expiresAt, { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {expiresAt.toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const apiKey = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(apiKey.created_at), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(apiKey.created_at).toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const apiKey = row.original
      return (
        <div className="px-3 py-1">
          <ApiKeyActions apiKey={apiKey} />
        </div>
      )
    },
  },
]
