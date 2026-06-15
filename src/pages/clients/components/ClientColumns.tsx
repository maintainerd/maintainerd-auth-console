import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { AppWindow, Monitor, Smartphone, Globe, Cog } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ClientActions } from "./ClientActions"
import { DataTableColumnHeader } from "@/components/data-table"
import { SystemBadge } from "@/components/badges"
import { StatusBadge } from "@/components/details/StatusBadge"
import type { Client, ClientType } from "@/services/api/clients/types"

const getTypeBadge = (type: ClientType) => {
  const typeConfig = {
    traditional: {
      icon: Globe,
      label: "Traditional Web",
      className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
    },
    mobile: {
      icon: Smartphone,
      label: "Native Mobile",
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
    },
    spa: {
      icon: Monitor,
      label: "Single Page App",
      className: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200"
    },
    m2m: {
      icon: Cog,
      label: "Machine to Machine",
      className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
    }
  }

  // Fallback for unknown types or legacy "native" type
  const config = typeConfig[type] || {
    icon: Monitor,
    label: type,
    className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
  }

  const Icon = config.icon

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}

export const clientColumns: ColumnDef<Client>[] = [
  {
    id: "display_name",
    accessorKey: "display_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Client" />,
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className="flex items-center gap-3 px-3 py-1 max-w-xs">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <AppWindow className="size-5" />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{client.display_name}</span>
              <SystemBadge isSystem={client.is_system} />
            </div>
            <span className="text-sm text-muted-foreground truncate">{client.name}</span>
            <span className="text-xs text-muted-foreground font-mono truncate">{client.client_id}</span>
          </div>
        </div>
      )
    },
  },
  {
    id: "client_type",
    accessorKey: "client_type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      return (
        <div className="px-3 py-1">
          {getTypeBadge(row.original.client_type)}
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
    id: "created_at",
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(client.created_at), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(client.created_at).toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className="px-3 py-1">
          <ClientActions client={client} />
        </div>
      )
    },
  },
]
