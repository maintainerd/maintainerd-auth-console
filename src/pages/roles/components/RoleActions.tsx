"use client"

import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
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
  Shield,
  ShieldOff,
  Trash2,
  Users,
  Eye,
  Settings
} from "lucide-react"
import type { Role } from "./RoleColumns"

interface RoleActionsProps {
  role: Role
}

export function RoleActions({ role }: RoleActionsProps) {
  const { containerId } = useParams<{ containerId: string }>()
  const navigate = useNavigate()

  const handleViewRole = () => {
    navigate(`/c/${containerId}/roles/${role.id}`)
  }

  const handleEditRole = () => {
    navigate(`/c/${containerId}/roles/${role.id}/edit`)
  }

  const handleDuplicateRole = () => {
    console.log("Duplicate role:", role.name)
    // TODO: Implement duplicate role functionality
  }

  const handleManagePermissions = () => {
    navigate(`/c/${containerId}/roles/${role.id}/edit`)
  }

  const handleViewUsers = () => {
    navigate(`/c/${containerId}/roles/${role.id}?tab=users`)
  }

  const handleToggleStatus = () => {
    console.log("Toggle status for role:", role.name)
    // TODO: Implement toggle role status
  }

  const handleDeleteRole = () => {
    console.log("Delete role:", role.name)
    // TODO: Implement delete role with confirmation
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
        
        <DropdownMenuItem onClick={handleViewRole}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleViewUsers}>
          <Users className="mr-2 h-4 w-4" />
          View Users ({role.userCount})
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleEditRole} disabled={role.isSystem}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Role
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleDuplicateRole}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate Role
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleManagePermissions} disabled={role.isSystem}>
          <Settings className="mr-2 h-4 w-4" />
          Manage Permissions
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleToggleStatus} disabled={role.isSystem}>
          {role.isActive ? (
            <>
              <ShieldOff className="mr-2 h-4 w-4" />
              Deactivate Role
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Activate Role
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleDeleteRole} 
          className="text-red-600"
          disabled={role.isSystem || role.userCount > 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Role
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
