import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Workflow } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { SignupFlow } from "@/services/api/signup-flows/types"
import { SignupFlowActions } from "./SignupFlowActions"
import { DataTableColumnHeader } from "@/components/data-table"

export const signupFlowColumns: ColumnDef<SignupFlow>[] = [
  {
    id: "Name",
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const flow = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1 max-w-xs">
          <div className="flex items-center gap-2">
            <Workflow className="size-4 text-muted-foreground shrink-0" />
            <span className="font-medium">{flow.name}</span>
          </div>
          {flow.description && (
            <span className="text-sm text-muted-foreground truncate">{flow.description}</span>
          )}
        </div>
      )
    },
  },
  {
    id: "Identifier",
    accessorKey: "identifier",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Identifier" />,
    cell: ({ row }) => (
      <div className="px-3 py-1">
        <code className="rounded bg-muted px-2 py-1 text-sm">{row.getValue("Identifier")}</code>
      </div>
    ),
  },
  {
    id: "Status",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("Status") as string
      if (!status) return null
      const isActive = status === "active"
      return (
        <div className="px-3 py-1">
          <Badge
            variant="outline"
            className={
              isActive
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-gray-100 text-gray-800 border-gray-200"
            }
          >
            <span className="capitalize">{status}</span>
          </Badge>
        </div>
      )
    },
  },
  {
    id: "Created",
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const flow = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(flow.created_at), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(flow.created_at).toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="px-3 py-1">
        <SignupFlowActions signupFlow={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
