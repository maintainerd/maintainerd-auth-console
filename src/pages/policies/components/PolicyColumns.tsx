import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { PolicyActions } from "./PolicyActions"
import { SystemBadge, StatusBadge } from "@/components/badges"
import type { PolicyType } from "@/services/api/policy/types"

export const policyColumns: ColumnDef<PolicyType>[] = [
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
            <SystemBadge isSystem={policy.is_system} />
          </div>
          <span className="text-sm text-muted-foreground truncate">{policy.description}</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Version: <span className="font-mono">{policy.version}</span></span>
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
          <StatusBadge status={policy.status} />
        </div>
      )
    },
  },
  {
    accessorKey: "created_at",
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
      const policy = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(policy.created_at), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(policy.created_at).toLocaleDateString()}
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
