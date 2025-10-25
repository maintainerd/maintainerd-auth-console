"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Settings, Trash2, Users, RefreshCw, Eye } from "lucide-react"
import type { IdentityProvider } from "./IdentityProviderColumns"

interface IdentityProviderActionsProps {
  provider: IdentityProvider
}

export function IdentityProviderActions({ provider }: IdentityProviderActionsProps) {
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
        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem disabled={provider.isDefault}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Provider
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Configuration
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Users className="mr-2 h-4 w-4" />
          Manage Users
        </DropdownMenuItem>
        <DropdownMenuItem disabled={provider.isDefault}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync Users
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          disabled={provider.isDefault}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Provider
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
