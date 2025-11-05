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
import type { Service } from "./ServiceColumns"

interface ServiceActionsProps {
  service: Service
}

export function ServiceActions({ service }: ServiceActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()

  const isActive = service.status === "active"
  const isMaintenance = service.status === "maintenance"
  const isDeprecated = service.status === "deprecated"

  // Action handlers
  const handleViewDetails = () => {
    navigate(`/${tenantId}/services/${service.id}`)
  }

  const handleUpdateService = () => {
    navigate(`/${tenantId}/services/${service.id}/edit`)
  }



  const handleActivate = () => {
    console.log("Activate service:", service.id)
    // TODO: Implement activate service
  }

  const handleMaintenance = () => {
    console.log("Set service to maintenance:", service.id)
    // TODO: Implement maintenance mode
  }

  const handleDeprecate = () => {
    console.log("Deprecate service:", service.id)
    // TODO: Implement deprecate service
  }

  const handleDelete = () => {
    console.log("Delete service:", service.id)
    // TODO: Implement delete service with confirmation
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

        <DropdownMenuItem onClick={handleUpdateService}>
          <Edit className="mr-2 h-4 w-4" />
          Update Service
        </DropdownMenuItem>

        {!isActive && !isMaintenance && (
          <DropdownMenuItem onClick={handleActivate}>
            <Play className="mr-2 h-4 w-4" />
            Activate Service
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
            Deprecate Service
          </DropdownMenuItem>
        )}

        {!service.isSystem && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Service
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
