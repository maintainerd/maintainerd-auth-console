import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, CheckCircle, AlertTriangle, Wrench, Shield, Settings, Cloud, Key, Github, Facebook, Twitter, Linkedin, Apple, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { SocialProviderActions } from "./SocialProviderActions"

export type SocialProviderStatus = "active" | "inactive" | "configuring"
export type SocialProviderType = "google" | "facebook" | "github" | "twitter" | "linkedin" | "apple" | "microsoft" | "discord" | "custom"

export interface SocialProvider {
  id: string
  name: string
  displayName: string
  description: string
  identifier: string
  type: SocialProviderType
  status: SocialProviderStatus
  userCount: number
  clientId: string
  clientSecret?: string
  scopes: string[]
  endpoint: string
  metadata?: Record<string, string>
  createdAt: string
  createdBy: string
  updatedAt: string
  lastSync: string | null
}

const getStatusBadge = (status: SocialProviderStatus) => {
  const statusConfig = {
    active: { 
      label: "Active", 
      icon: CheckCircle, 
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
    },
    inactive: { 
      label: "Inactive", 
      icon: AlertTriangle, 
      className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200" 
    },
    configuring: { 
      label: "Configuring", 
      icon: Wrench, 
      className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200" 
    }
  }
  
  const config = statusConfig[status]
  const Icon = config.icon
  
  return (
    <Badge variant="outline" className={`text-xs ${config.className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}

const getProviderBadge = (type: SocialProviderType) => {
  const typeConfig = {
    google: { label: "Google", icon: Cloud },
    facebook: { label: "Facebook", icon: Facebook },
    github: { label: "GitHub", icon: Github },
    twitter: { label: "Twitter", icon: Twitter },
    linkedin: { label: "LinkedIn", icon: Linkedin },
    apple: { label: "Apple", icon: Apple },
    microsoft: { label: "Microsoft", icon: Shield },
    discord: { label: "Discord", icon: MessageSquare },
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

export const socialProviderColumns: ColumnDef<SocialProvider>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const provider = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1 max-w-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium">{provider.displayName}</span>
          </div>
          <span className="text-sm text-muted-foreground truncate">{provider.description}</span>
          <span className="text-xs text-muted-foreground font-mono">{provider.identifier}</span>
        </div>
      )
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
      return (
        <div className="px-3 py-1">
          {getProviderBadge(row.original.type)}
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
          {getStatusBadge(row.original.status)}
        </div>
      )
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
      const count = row.getValue("userCount") as number
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
    accessorKey: "scopes",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Scopes
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const scopes = row.original.scopes
      return (
        <div className="flex flex-wrap gap-1 px-3 py-1">
          {scopes.slice(0, 2).map((scope) => (
            <Badge key={scope} variant="outline" className="font-medium text-xs">
              {scope}
            </Badge>
          ))}
          {scopes.length > 2 && (
            <Badge variant="outline" className="font-medium text-xs">
              +{scopes.length - 2} more
            </Badge>
          )}
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
      const provider = row.original
      return (
        <div className="px-3 py-1">
          <SocialProviderActions provider={provider} />
        </div>
      )
    },
  },
]
