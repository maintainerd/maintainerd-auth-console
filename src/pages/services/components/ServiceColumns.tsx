import type { ColumnDef } from "@tanstack/react-table"
import { FileText, Server } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ServiceActions } from "./ServiceActions"
import { DataTableColumnHeader } from "@/components/data-table"
import { StatusBadge, SystemBadge } from "@/components/badges"
import type { Service } from "@/services/api/services/types"

export const serviceColumns: ColumnDef<Service>[] = [
  {
    id: "display_name",
    accessorKey: "display_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Service" />,
    cell: ({ row }) => {
      const service = row.original
      return (
        <div className="flex max-w-sm items-center gap-3 px-3 py-1">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Server className="size-5" />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="truncate font-medium">{service.display_name}</span>
              <SystemBadge isSystem={service.is_system} />
            </div>
            <span className="truncate text-sm text-muted-foreground">{service.description}</span>
            <span className="truncate font-mono text-xs text-muted-foreground">{service.name}</span>
          </div>
        </div>
      )
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <div className="px-3 py-1">
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    id: "version",
    accessorKey: "version",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Version" />,
    cell: ({ row }) => (
      <div className="px-3 py-1">
        <span className="font-mono text-sm">{row.original.version}</span>
      </div>
    ),
  },
  {
    id: "api_count",
    accessorKey: "api_count",
    header: ({ column }) => <DataTableColumnHeader column={column} title="APIs" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-3 py-1 text-sm">
        <Server className="size-4 text-muted-foreground" />
        <span className="font-medium">{row.original.api_count}</span>
      </div>
    ),
  },
  {
    id: "policy_count",
    accessorKey: "policy_count",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Policies" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-3 py-1 text-sm">
        <FileText className="size-4 text-muted-foreground" />
        <span className="font-medium">{row.original.policy_count}</span>
      </div>
    ),
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const createdAt = new Date(row.original.created_at)
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {createdAt.toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="px-3 py-1">
        <ServiceActions service={row.original} />
      </div>
    ),
  },
]
