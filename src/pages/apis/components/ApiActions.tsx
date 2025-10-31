import * as React from "react"
import { Button } from "@/components/ui/button"
import { useNavigate, useParams } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Archive
} from "lucide-react"
import type { Api } from "./ApiColumns"

interface ApiActionsProps {
  api: Api
}

export function ApiActions({ api }: ApiActionsProps) {
  const { containerId } = useParams<{ containerId: string }>()
  const navigate = useNavigate()

  const isActive = api.status === "active"
  const isMaintenance = api.status === "maintenance"
  const isDeprecated = api.status === "deprecated"

  // Action handlers
  const handleViewDetails = () => {
    navigate(`/c/${containerId}/apis/${api.id}`)
  }

  const handleUpdateApi = () => {
    navigate(`/c/${containerId}/apis/${api.id}/edit`)
  }

  const handleActivate = () => {
    console.log("Activate API:", api.id)
    // TODO: Implement activate API
  }

  const handleMaintenance = () => {
    console.log("Set API to maintenance:", api.id)
    // TODO: Implement maintenance mode
  }

  const handleDeprecate = () => {
    console.log("Deprecate API:", api.id)
    // TODO: Implement deprecate API
  }

  const handleDelete = () => {
    console.log("Delete API:", api.id)
    // TODO: Implement delete API with confirmation
  }

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

        <DropdownMenuItem onClick={handleUpdateApi}>
          <Edit className="mr-2 h-4 w-4" />
          Update API
        </DropdownMenuItem>

        {!isActive && !isMaintenance && (
          <DropdownMenuItem onClick={handleActivate}>
            <Play className="mr-2 h-4 w-4" />
            Activate API
          </DropdownMenuItem>
        )}

        {isActive && (
          <DropdownMenuItem onClick={handleMaintenance}>
            <Pause className="mr-2 h-4 w-4" />
            Set Maintenance
          </DropdownMenuItem>
        )}

        {!isDeprecated && (
          <DropdownMenuItem onClick={handleDeprecate}>
            <Archive className="mr-2 h-4 w-4" />
            Deprecate API
          </DropdownMenuItem>
        )}

        {!api.isSystem && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete API
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
