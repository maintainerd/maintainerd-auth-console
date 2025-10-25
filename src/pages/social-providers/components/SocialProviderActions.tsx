import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, RefreshCw, Trash2, Settings, Eye } from "lucide-react"
import type { SocialProvider } from "./SocialProviderColumns"

interface SocialProviderActionsProps {
  provider: SocialProvider
}

export function SocialProviderActions({ provider }: SocialProviderActionsProps) {
  const handleViewDetails = () => {
    console.log("View details for provider:", provider.id)
  }

  const handleEditProvider = () => {
    console.log("Edit provider:", provider.id)
  }

  const handleConfigureProvider = () => {
    console.log("Configure provider:", provider.id)
  }

  const handleSyncUsers = () => {
    console.log("Sync users for provider:", provider.id)
  }

  const handleDeleteProvider = () => {
    console.log("Delete provider:", provider.id)
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
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEditProvider}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Provider
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleConfigureProvider}>
          <Settings className="mr-2 h-4 w-4" />
          Configure
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSyncUsers}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync Users
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive"
          onClick={handleDeleteProvider}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Provider
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
