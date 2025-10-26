import * as React from "react"
import { MoreHorizontal, Eye, Edit, Settings, RotateCcw, Trash2, Copy, Key, Activity, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ApiKey } from "../constants"

interface ApiKeyActionsProps {
  apiKey: ApiKey
}

export function ApiKeyActions({ apiKey }: ApiKeyActionsProps) {
  const handleViewDetails = () => {
    console.log("View API key details:", apiKey.id)
  }

  const handleEditApiKey = () => {
    console.log("Edit API key:", apiKey.id)
  }

  const handleConfigurePermissions = () => {
    console.log("Configure API key permissions:", apiKey.id)
  }

  const handleRegenerateKey = () => {
    console.log("Regenerate API key:", apiKey.id)
  }

  const handleCopyKey = () => {
    // In a real app, you'd copy the actual key value
    navigator.clipboard.writeText(`${apiKey.keyPrefix}****`)
    console.log("Copied API key:", apiKey.keyPrefix)
  }

  const handleToggleStatus = () => {
    const newStatus = apiKey.status === "active" ? "inactive" : "active"
    console.log(`${newStatus === "active" ? "Activate" : "Deactivate"} API key:`, apiKey.id)
  }

  const handleViewUsage = () => {
    console.log("View API key usage:", apiKey.id)
  }

  const handleDeleteApiKey = () => {
    console.log("Delete API key:", apiKey.id)
  }

  const isExpired = apiKey.status === "expired"
  const isActive = apiKey.status === "active"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditApiKey}>
          <Edit className="mr-2 h-4 w-4" />
          Edit API Key
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleConfigurePermissions}>
          <Settings className="mr-2 h-4 w-4" />
          Configure Permissions
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyKey}>
          <Copy className="mr-2 h-4 w-4" />
          Copy API Key
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleViewUsage}>
          <Activity className="mr-2 h-4 w-4" />
          View Usage
        </DropdownMenuItem>
        {!isExpired && (
          <DropdownMenuItem onClick={handleToggleStatus}>
            {isActive ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleRegenerateKey} disabled={isExpired}>
          <Key className="mr-2 h-4 w-4" />
          Regenerate Key
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDeleteApiKey}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete API Key
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
