import { createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"
import { DataTableColumnHeader, DataTableBadgeStatus } from "@/components/data-table"
import type { PermissionEntity } from "@/services/api/permissions/types"

const columnHelper = createColumnHelper<PermissionEntity>()

export const permissionColumns = [
  columnHelper.accessor("name", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: ({ getValue }) => <span className="text-muted-foreground text-sm">{getValue() ?? "—"}</span>,
  }),
  columnHelper.accessor("api.display_name" as any, {
    id: "api",
    header: "API",
    cell: ({ row }) => <span className="text-sm">{row.original.api?.display_name ?? row.original.api?.name ?? "—"}</span>,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => <DataTableBadgeStatus status={getValue()} />,
  }),
  columnHelper.accessor("is_system", {
    header: "Type",
    cell: ({ getValue }) => getValue() ? <span className="text-xs text-muted-foreground">System</span> : null,
  }),
  columnHelper.accessor("created_at", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{format(new Date(getValue()), "PP")}</span>,
  }),
]
