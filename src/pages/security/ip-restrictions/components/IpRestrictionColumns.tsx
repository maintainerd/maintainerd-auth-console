import type { ColumnDef } from "@tanstack/react-table"
import { Ban, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { IpRestrictionActions } from "./IpRestrictionActions"
import { DataTableColumnHeader } from "@/components/data-table"
import { StatusBadge } from "@/components/details/StatusBadge"
import type { IpRestrictionRule } from "@/services/api/ip-restriction-rules/types"

export function ipRestrictionColumns(
  onEdit: (rule: IpRestrictionRule) => void,
): ColumnDef<IpRestrictionRule>[] {
  return [
    {
      id: "Type",
      accessorKey: "type",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => {
        const rule = row.original
        return (
          <div className="px-3 py-1">
            {rule.type === "allow" ? (
              <Badge variant="default" className="flex items-center gap-1 w-fit">
                <CheckCircle className="h-3 w-3" />
                Allow
              </Badge>
            ) : (
              <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                <Ban className="h-3 w-3" />
                Deny
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      id: "IP Address",
      accessorKey: "ipAddress",
      header: ({ column }) => <DataTableColumnHeader column={column} title="IP Address/Range" />,
      cell: ({ row }) => (
        <div className="px-3 py-1 font-mono text-sm">{row.original.ipAddress}</div>
      ),
    },
    {
      id: "Description",
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      cell: ({ row }) => (
        <div className="px-3 py-1 text-muted-foreground max-w-xs truncate">
          {row.original.description}
        </div>
      ),
    },
    {
      id: "Status",
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <div className="px-3 py-1">
          <StatusBadge status={row.original.status} />
        </div>
      ),
    },
    {
      id: "Created",
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
      cell: ({ row }) => {
        const rule = row.original
        return (
          <div className="flex flex-col gap-1 px-3 py-1">
            <span className="text-sm font-medium">
              {formatDistanceToNow(new Date(rule.createdAt), { addSuffix: true })}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(rule.createdAt).toLocaleDateString()}
            </span>
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const rule = row.original
        return (
          <div className="px-3 py-1">
            <IpRestrictionActions rule={rule} onEdit={onEdit} />
          </div>
        )
      },
    },
  ]
}
