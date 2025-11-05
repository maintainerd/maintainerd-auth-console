"use client"

import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, Play, Pause } from "lucide-react"
import type { SocialProvider } from "./SocialProviderColumns"

interface SocialProviderActionsProps {
  provider: SocialProvider
}

export function SocialProviderActions({ provider }: SocialProviderActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate(`/${tenantId}/providers/social/${provider.id}`)
  }

  const handleEditProvider = () => {
    navigate(`/${tenantId}/providers/social/${provider.id}/edit`)
  }

  const handleToggleStatus = () => {
    console.log("Toggle status for provider:", provider.name)
    // TODO: Implement toggle provider status
  }

  const handleDelete = () => {
    console.log("Delete provider:", provider.name)
    // TODO: Implement delete provider with confirmation
  }

  const isActive = provider.status === "active"

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

        <DropdownMenuItem onClick={handleEditProvider}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Provider
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleToggleStatus}>
          {isActive ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Deactivate Provider
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Activate Provider
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive"
          disabled={provider.userCount > 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Provider
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
