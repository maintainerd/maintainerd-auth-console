import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, CheckCircle, AlertTriangle, Wrench, Shield, Settings, Cloud, Key } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { IdentityProviderActions } from "./IdentityProviderActions"

export type IdentityProviderStatus = "active" | "inactive" | "configuring"
export type IdentityProviderType = "cognito" | "auth0" | "okta" | "azure_ad" | "keycloak" | "firebase" | "custom"

export type IdentityProvider = {
  id: string
  name: string
  description: string
  type: IdentityProviderType
  status: IdentityProviderStatus
  userCount: number
  isDefault: boolean
  region?: string
  endpoint: string
  createdAt: string
  createdBy: string
  updatedAt: string
  lastSync?: string
}

const getStatusBadge = (status: IdentityProviderStatus) => {
  const statusConfig = {
    active: {
      label: "Active",
      variant: "default" as const,
      icon: CheckCircle,
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
    },
    inactive: {
      label: "Inactive",
      variant: "secondary" as const,
      icon: AlertTriangle,
      className: ""
    },
    configuring: {
      label: "Configuring",
      variant: "default" as const,
      icon: Wrench,
      className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`${config.className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}

const getInternalExternalBadge = (isDefault: boolean) => {
  if (isDefault) {
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

const getProviderBadge = (type: IdentityProviderType, isDefault: boolean) => {
  // For default provider, show "Built-in" instead of type
  if (isDefault) {
    return (
      <Badge variant="secondary" className="text-xs">
        <Shield className="h-3 w-3 mr-1" />
        Built-in
      </Badge>
    )
  }

  const typeConfig = {
    cognito: { label: "AWS Cognito", icon: Cloud },
    auth0: { label: "Auth0", icon: Shield },
    okta: { label: "Okta", icon: Shield },
    azure_ad: { label: "Azure AD", icon: Shield },
    keycloak: { label: "Keycloak", icon: Key },
    firebase: { label: "Firebase", icon: Cloud },
    custom: { label: "Custom", icon: Settings }
  }

  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <Badge variant="secondary" className="text-xs">
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}

const getSystemBadge = (isDefault: boolean) => {
  if (!isDefault) return null

  return (
    <Badge variant="secondary" className="text-xs">
      <Shield className="h-3 w-3 mr-1" />
      System
    </Badge>
  )
}



export const identityProviderColumns: ColumnDef<IdentityProvider>[] = [
  {
    accessorKey: "name",
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
            <span className="font-medium">{provider.name}</span>
            {getSystemBadge(provider.isDefault)}
          </div>
          <span className="text-sm text-muted-foreground truncate">{provider.description}</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{provider.id}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "isDefault",
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
      return getInternalExternalBadge(row.original.isDefault)
    },
  },
  {
    accessorKey: "type",
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
      return getProviderBadge(row.original.type, row.original.isDefault)
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
      return getStatusBadge(row.original.status)
    },
  },
  {
    accessorKey: "userCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Users
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const count = row.original.userCount
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <div className="flex items-center gap-1 text-sm">
            <span className="font-medium">{count.toLocaleString()}</span>
            <span className="text-muted-foreground">users</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
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
            {formatDistanceToNow(new Date(provider.createdAt), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(provider.createdAt).toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <IdentityProviderActions provider={row.original} />
    },
  },
]
