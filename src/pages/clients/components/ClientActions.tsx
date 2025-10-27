import * as React from "react"
import { MoreHorizontal, Eye, Edit, Settings, RotateCcw, Trash2, Copy, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Client } from "../constants"

interface ClientActionsProps {
  client: Client
}

export function ClientActions({ client }: ClientActionsProps) {
  const handleViewDetails = () => {
    console.log("View client details:", client.id)
  }

  const handleEditClient = () => {
    console.log("Edit client:", client.id)
  }

  const handleConfigureClient = () => {
    console.log("Configure client:", client.id)
  }

  const handleRotateSecret = () => {
    console.log("Rotate client secret:", client.id)
  }

  const handleCopyClientId = () => {
    navigator.clipboard.writeText(client.clientId)
    console.log("Copied client ID:", client.clientId)
  }

  const handleDeleteClient = () => {
    console.log("Delete client:", client.id)
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
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditClient}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Client
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleConfigureClient}>
          <Settings className="mr-2 h-4 w-4" />
          Configure
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyClientId}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Client ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRotateSecret}>
          <Key className="mr-2 h-4 w-4" />
          Rotate Secret
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDeleteClient}
          className="text-destructive"
          disabled={client.isDefault}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Client
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
