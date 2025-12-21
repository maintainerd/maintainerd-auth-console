import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { SignupFlowType } from "@/services/api/signup-flow/types"
import { SignupFlowActions } from "./SignupFlowActions"

export const signupFlowColumns: ColumnDef<SignupFlowType>[] = [
  {
    id: "Name",
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const flow = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="font-medium">{flow.name}</span>
          {flow.description && (
            <span className="text-sm text-muted-foreground">
              {flow.description}
            </span>
          )}
        </div>
      )
    },
  },
  {
    id: "Identifier",
    accessorKey: "identifier",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        Identifier
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="px-3 py-1">
          <code className="text-sm bg-muted px-2 py-1 rounded">
            {row.getValue("Identifier")}
          </code>
        </div>
      )
    },
  },

  {
    id: "Status",
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("Status") as string
      if (!status) return null
      return (
        <div className="px-3 py-1">
          <Badge
            className={
              status === "active"
                ? "bg-green-100 text-green-800 border-green-200"
                : status === "inactive"
                ? "bg-red-100 text-red-800 border-red-200"
                : "bg-yellow-100 text-yellow-800 border-yellow-200"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      )
    },
  },

  {
    id: "Created",
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const flow = row.original
      return (
        <div className="px-3 py-1">
          <span className="text-sm">
            {formatDistanceToNow(new Date(flow.created_at), { addSuffix: true })}
          </span>
        </div>
      )
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <SignupFlowActions signupFlow={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
]
