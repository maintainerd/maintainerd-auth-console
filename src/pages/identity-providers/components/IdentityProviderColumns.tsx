import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Settings, Cloud, Key, Shield } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { IdentityProviderActions } from "./IdentityProviderActions"
import { SystemBadge, StatusBadge } from "@/components/badges"
import type { IdentityProviderType, ProviderOption } from "@/services/api/identity-provider/types"

const getInternalExternalBadge = (isSystem: boolean) => {
  if (isSystem) {
    return (
      <Badge variant="secondary" className="text-xs">
        <Shield className="h-3 w-3 mr-1" />
        Internal
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="text-xs">
      <Cloud className="h-3 w-3 mr-1" />
      External
    </Badge>
  )
}

const getProviderBadge = (provider: ProviderOption, isSystem: boolean) => {
  // For system provider, show "Built-in" instead of type
  if (isSystem) {
    return (
      <Badge variant="secondary" className="text-xs">
        <Shield className="h-3 w-3 mr-1" />
        Built-in
      </Badge>
    )
  }

  const typeConfig: Record<ProviderOption, { label: string; icon: typeof Cloud }> = {
    internal: { label: "Internal", icon: Shield },
    cognito: { label: "AWS Cognito", icon: Cloud },
    auth0: { label: "Auth0", icon: Shield },
    google: { label: "Google", icon: Cloud },
    facebook: { label: "Facebook", icon: Cloud },
    github: { label: "GitHub", icon: Key }
  }

  const config = typeConfig[provider]
  const Icon = config.icon

  return (
    <Badge variant="secondary" className="text-xs">
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}





export const identityProviderColumns: ColumnDef<IdentityProviderType>[] = [
  {
    accessorKey: "display_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Identity Provider
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const provider = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1 max-w-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium">{provider.display_name}</span>
            <SystemBadge isSystem={provider.is_system} />
          </div>
          <span className="text-sm text-muted-foreground truncate">{provider.name}</span>
          <span className="text-xs text-muted-foreground font-mono">{provider.identifier}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "is_system",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="px-3 py-1">
          {getInternalExternalBadge(row.original.is_system)}
        </div>
      )
    },
  },
  {
    accessorKey: "provider",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Provider
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="px-3 py-1">
          {getProviderBadge(row.original.provider, row.original.is_system)}
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
      return (
        <div className="px-3 py-1">
          <StatusBadge status={row.original.status} />
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
      const provider = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(provider.created_at), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(provider.created_at).toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="px-3 py-1">
          <IdentityProviderActions provider={row.original} />
        </div>
      )
    },
  },
]
