import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Eye,
  Settings,
  Key,
  Trash2,
  Copy,
  Wrench,
  Archive
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useParams, useNavigate } from "react-router-dom"
import type { Api } from "./ApiColumns"

interface ApiActionsProps {
  api: Api
}

export function ApiActions({ api }: ApiActionsProps) {
  const { containerId } = useParams<{ containerId: string }>()
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate(`/c/${containerId}/apis/${api.id}`)
  }



  const handleViewAuditLogs = () => {
    console.log("View API audit logs:", api.id)
    // TODO: Implement view audit logs
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

  const handleEditSettings = () => {
    navigate(`/c/${containerId}/apis/${api.id}/edit`)
  }

  const handleDuplicate = () => {
    console.log("Duplicate API:", api.id)
    // TODO: Implement duplicate API
  }

  const handleDelete = () => {
    console.log("Delete API:", api.id)
    // TODO: Implement delete API
  }

  const canActivate = api.status !== "active"
  const canMaintenance = api.status === "active"
  const canDeprecate = api.status === "active"
  const canDelete = !api.isSystem

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
        <DropdownMenuItem onClick={handleViewAuditLogs}>
          <Settings className="mr-2 h-4 w-4" />
          Audit Logs
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {canActivate && (
          <DropdownMenuItem onClick={handleActivate}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Activate
          </DropdownMenuItem>
        )}
        {canMaintenance && (
          <DropdownMenuItem onClick={handleMaintenance}>
            <Wrench className="mr-2 h-4 w-4" />
            Set Maintenance
          </DropdownMenuItem>
        )}
        {canDeprecate && (
          <DropdownMenuItem onClick={handleDeprecate}>
            <Archive className="mr-2 h-4 w-4" />
            Deprecate
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleEditSettings}>
          <Settings className="mr-2 h-4 w-4" />
          Edit Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate API
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />

        {canDelete && (
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete API
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
