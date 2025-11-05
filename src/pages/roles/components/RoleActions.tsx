"use client"

import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
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
  Edit,
  Shield,
  ShieldOff,
  Trash2,
  Eye
} from "lucide-react"
import type { Role } from "./RoleColumns"

interface RoleActionsProps {
  role: Role
}

export function RoleActions({ role }: RoleActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate(`/${tenantId}/roles/${role.id}`)
  }

  const handleEditRole = () => {
    navigate(`/${tenantId}/roles/${role.id}/edit`)
  }

  const handleToggleStatus = () => {
    console.log("Toggle status for role:", role.name)
    // TODO: Implement toggle role status
  }

  const handleDelete = () => {
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
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleEditRole} disabled={role.isSystem}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Role
        </DropdownMenuItem>

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

        {!role.isSystem && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive"
              disabled={role.userCount > 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Role
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
