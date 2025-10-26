import * as React from "react"
import { Button } from "@/components/ui/button"
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
  Edit, 
  Copy, 
  Eye,
  Users,
  Trash2,
  Settings,
  Shield
} from "lucide-react"
import type { Permission } from "./PermissionColumns"

interface PermissionActionsProps {
  permission: Permission
}

export function PermissionActions({ permission }: PermissionActionsProps) {
  const handleViewPermission = () => {
    console.log("View permission:", permission.name)
    // TODO: Implement view permission details
  }

  const handleEditPermission = () => {
    console.log("Edit permission:", permission.name)
    // TODO: Implement edit permission
  }

  const handleDuplicatePermission = () => {
    console.log("Duplicate permission:", permission.name)
    // TODO: Implement duplicate permission
  }

  const handleViewRoles = () => {
    console.log("View roles with permission:", permission.name)
    // TODO: Implement view roles with this permission
  }

  const handleManageAssignments = () => {
    console.log("Manage assignments for permission:", permission.name)
    // TODO: Implement permission assignment management
  }

  const handleDeletePermission = () => {
    console.log("Delete permission:", permission.name)
    // TODO: Implement delete permission
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
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        
        <DropdownMenuItem onClick={handleViewPermission}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleViewRoles}>
          <Users className="mr-2 h-4 w-4" />
          View Roles ({permission.roleCount})
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleEditPermission} disabled={permission.isSystem}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Permission
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleDuplicatePermission}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleManageAssignments}>
          <Shield className="mr-2 h-4 w-4" />
          Manage Assignments
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleDeletePermission}
          disabled={permission.isSystem}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Permission
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
