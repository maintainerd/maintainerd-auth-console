import type { ColumnDef } from "@tanstack/react-table"
import { Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { TenantActions } from "./TenantActions"
import { DataTableColumnHeader } from "@/components/data-table"
import { StatusBadge } from "@/components/details/StatusBadge"
import type { TenantEntity } from "@/services/api/tenants/types"

export function tenantColumns(
  onEdit: (tenant: TenantEntity) => void,
): ColumnDef<TenantEntity>[] {
  return [
    {
      id: "Tenant",
      accessorKey: "display_name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tenant" />,
      cell: ({ row }) => {
        const tenant = row.original
        return (
          <div className="flex flex-col gap-1 px-3 py-1 max-w-xs">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-muted-foreground shrink-0" />
              <span className="font-medium">{tenant.display_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{tenant.name}</span>
              {tenant.is_system && <Badge variant="secondary" className="text-xs">System</Badge>}
              {tenant.is_default && <Badge variant="outline" className="text-xs">Default</Badge>}
            </div>
          </div>
        )
      },
    },
    {
      id: "Name",
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <div className="px-3 py-1 font-mono text-sm text-muted-foreground">
          {row.original.name}
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
      accessorKey: "created_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
      cell: ({ row }) => {
        const tenant = row.original
        return (
          <div className="flex flex-col gap-1 px-3 py-1">
            <span className="text-sm font-medium">
              {formatDistanceToNow(new Date(tenant.created_at), { addSuffix: true })}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(tenant.created_at).toLocaleDateString()}
            </span>
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const tenant = row.original
        return (
          <div className="px-3 py-1">
            <TenantActions tenant={tenant} onEdit={onEdit} />
          </div>
        )
      },
    },
  ]
}
