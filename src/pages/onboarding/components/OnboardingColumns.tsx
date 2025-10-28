import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Palette } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { OnboardingFlow } from "../constants"
import { OnboardingActions } from "./OnboardingActions"

export const onboardingColumns: ColumnDef<OnboardingFlow>[] = [
  {
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
      const onboarding = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{onboarding.name}</span>
            {onboarding.isDefault && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Default
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {onboarding.description}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return (
        <div className="px-3 py-1">
          <Badge
            className={
              type === "signup"
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-purple-100 text-purple-800 border-purple-200"
            }
          >
            {type === "signup" ? "Public Signup" : "Invited Signup"}
          </Badge>
        </div>
      )
    },
  },

  {
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
      const status = row.getValue("status") as string
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
            {status}
          </Badge>
        </div>
      )
    },
  },

  {
    accessorKey: "loginBrandingName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        Login Branding
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const onboarding = row.original
      return (
        <div className="flex items-center gap-2 px-3 py-1">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {onboarding.loginBrandingName || "No branding"}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "createdAt",
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
      const onboarding = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(onboarding.createdAt), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            by {onboarding.createdBy}
          </span>
        </div>
      )
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <OnboardingActions onboarding={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
]
