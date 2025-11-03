import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Key,
  Play,
  Pause,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ApiKey } from "../constants"

interface ApiKeyActionsProps {
  apiKey: ApiKey
}

export function ApiKeyActions({ apiKey }: ApiKeyActionsProps) {
  const { containerId } = useParams<{ containerId: string }>()
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate(`/c/${containerId}/api-keys/${apiKey.id}`)
  }

  const handleEditApiKey = () => {
    navigate(`/c/${containerId}/api-keys/${apiKey.id}/edit`)
  }

  const handleCopyKey = () => {
    // In a real app, you'd copy the actual key value
    navigator.clipboard.writeText(`${apiKey.keyPrefix}****`)
    console.log("Copied API key:", apiKey.keyPrefix)
  }

  const handleRegenerateKey = () => {
    console.log("Regenerate API key:", apiKey.id)
  }

  const handleActivate = () => {
    console.log("Activate API key:", apiKey.id)
  }

  const handleDeactivate = () => {
    console.log("Deactivate API key:", apiKey.id)
  }

  const handleDeleteApiKey = () => {
    console.log("Delete API key:", apiKey.id)
  }

  const isExpired = apiKey.status === "expired"
  const isActive = apiKey.status === "active"
  const isInactive = apiKey.status === "inactive"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleEditApiKey}>
          <Edit className="mr-2 h-4 w-4" />
          Edit API Key
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopyKey}>
          <Copy className="mr-2 h-4 w-4" />
          Copy API Key
        </DropdownMenuItem>

        {!isExpired && !isActive && (
          <DropdownMenuItem onClick={handleActivate}>
            <Play className="mr-2 h-4 w-4" />
            Activate API Key
          </DropdownMenuItem>
        )}

        {isActive && (
          <DropdownMenuItem onClick={handleDeactivate}>
            <Pause className="mr-2 h-4 w-4" />
            Deactivate API Key
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
