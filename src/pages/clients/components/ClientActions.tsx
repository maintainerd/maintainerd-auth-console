import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
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
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate(`/${tenantId}/clients/${client.id}`)
  }

  const handleEditClient = () => {
    navigate(`/${tenantId}/clients/${client.id}/edit`)
  }

  const handleRotateSecret = () => {
    // TODO: Implement client secret rotation
    console.log("Rotate client secret:", client.id)
  }

  const handleCopyClientId = () => {
    navigator.clipboard.writeText(client.clientId)
    // TODO: Add toast notification
    console.log("Copied client ID:", client.clientId)
  }

  const handleDeleteClient = () => {
    // TODO: Implement client deletion with confirmation
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
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditClient} disabled={client.isDefault}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Client
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyClientId}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Client ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRotateSecret} disabled={client.isDefault}>
          <Key className="mr-2 h-4 w-4" />
          Rotate Secret
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDeleteClient}
          className="text-destructive"
          disabled={client.isDefault || client.userCount > 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Client
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
