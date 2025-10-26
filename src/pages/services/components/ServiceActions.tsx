import * as React from "react"
import { Button } from "@/components/ui/button"
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
  Server,
  FileText,
  Settings,
  Copy,
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
  const isActive = service.status === "active"
  const isMaintenance = service.status === "maintenance"
  const isDeprecated = service.status === "deprecated"

  // Action handlers
  const handleViewDetails = () => {
    console.log("View service details:", service.id)
    // TODO: Navigate to service details page
  }

  const handleManageAPIs = () => {
    console.log("Manage APIs for service:", service.id)
    // TODO: Navigate to APIs management page
  }

  const handleManagePolicies = () => {
    console.log("Manage policies for service:", service.id)
    // TODO: Navigate to policies management page
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

  const handleEditSettings = () => {
    console.log("Edit service settings:", service.id)
    // TODO: Open service settings modal
  }

  const handleDuplicate = () => {
    console.log("Duplicate service:", service.id)
    // TODO: Implement duplicate service
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
        
        <DropdownMenuItem onClick={handleManageAPIs}>
          <Server className="mr-2 h-4 w-4" />
          Manage APIs
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleManagePolicies}>
          <FileText className="mr-2 h-4 w-4" />
          Manage Policies
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
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
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleEditSettings}>
          <Settings className="mr-2 h-4 w-4" />
          Edit Settings
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate Service
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {!service.isSystem && (
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Service
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
