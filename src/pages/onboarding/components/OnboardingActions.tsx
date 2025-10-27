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
  ExternalLink, 
  Trash2, 
  Settings,
  Eye,
  BarChart3,
  Users
} from "lucide-react"
import type { OnboardingFlow } from "../constants"

interface OnboardingActionsProps {
  onboarding: OnboardingFlow
}

export function OnboardingActions({ onboarding }: OnboardingActionsProps) {
  const handleEdit = () => {
    console.log("Edit onboarding:", onboarding.id)
    // TODO: Implement edit functionality
  }

  const handleDuplicate = () => {
    console.log("Duplicate onboarding:", onboarding.id)
    // TODO: Implement duplicate functionality
  }

  const handleViewPreview = () => {
    console.log("View preview:", onboarding.id)
    // TODO: Open preview in modal or new tab
  }

  const handleViewAnalytics = () => {
    console.log("View analytics:", onboarding.id)
    // TODO: Navigate to analytics page
  }

  const handleManageRoles = () => {
    console.log("Manage roles:", onboarding.id)
    // TODO: Open role management modal
  }

  const handleConfigure = () => {
    console.log("Configure onboarding:", onboarding.id)
    // TODO: Open configuration modal
  }

  const handleViewLive = () => {
    window.open(onboarding.url, "_blank")
  }

  const handleDelete = () => {
    if (onboarding.isDefault) {
      alert("Cannot delete the default onboarding flow")
      return
    }
    
    if (confirm(`Are you sure you want to delete "${onboarding.name}"?`)) {
      console.log("Delete onboarding:", onboarding.id)
      // TODO: Implement delete functionality
    }
  }

  return (
    <div className="px-3 py-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={handleViewPreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleViewLive}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View Live
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleConfigure}>
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleManageRoles}>
            <Users className="mr-2 h-4 w-4" />
            Manage Roles
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleViewAnalytics}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleDelete}
            className={onboarding.isDefault ? "opacity-50 cursor-not-allowed" : "text-red-600"}
            disabled={onboarding.isDefault}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
