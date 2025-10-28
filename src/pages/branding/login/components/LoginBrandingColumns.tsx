import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Eye, Palette } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { LoginBranding } from "../types"
import { LoginBrandingActions } from "./LoginBrandingActions"

// Helper function for system badge
const getSystemBadge = (isSystem: boolean, isDefault: boolean) => {
  if (isSystem) {
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
        System
      </Badge>
    )
  }
  if (isDefault) {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        Default
      </Badge>
    )
  }
  return null
}

export const loginBrandingColumns: ColumnDef<LoginBranding>[] = [
  {
    accessorKey: "name",
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
      const branding = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1 max-w-xs">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{branding.name}</span>
            {getSystemBadge(branding.isSystem, branding.isDefault)}
          </div>
          <span className="text-sm text-muted-foreground truncate">
            {branding.description}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "template",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        Template
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const branding = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <Badge
            className={
              branding.template === "modern"
                ? "bg-blue-100 text-blue-800 border-blue-200"
                : branding.template === "classic"
                ? "bg-gray-100 text-gray-800 border-gray-200"
                : branding.template === "minimal"
                ? "bg-slate-100 text-slate-800 border-slate-200"
                : branding.template === "corporate"
                ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                : branding.template === "creative"
                ? "bg-purple-100 text-purple-800 border-purple-200"
                : "bg-orange-100 text-orange-800 border-orange-200"
            }
          >
            {branding.template}
          </Badge>
          <span className="text-xs text-muted-foreground capitalize">
            {branding.layout} layout
          </span>
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
    accessorKey: "usageCount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        Usage
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const branding = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {branding.usageCount.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">
            applications
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        Last Updated
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const branding = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(branding.updatedAt), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            by {branding.updatedBy}
          </span>
        </div>
      )
    },
  },
  {
    id: "preview",
    header: "Preview",
    cell: ({ row }) => {
      const branding = row.original
      return (
        <div className="px-3 py-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(branding.previewUrl, '_blank')}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <LoginBrandingActions branding={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
]
