"use client"

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  Settings,
  Star,
  StarOff
} from "lucide-react"
import type { LoginBranding } from "../types"
import { LoginBrandingForm } from "./LoginBrandingForm"

interface LoginBrandingActionsProps {
  branding: LoginBranding
}

export function LoginBrandingActions({ branding }: LoginBrandingActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [showEditForm, setShowEditForm] = React.useState(false)

  const handleEdit = () => {
    setShowEditForm(true)
  }

  const handleDuplicate = () => {
    console.log("Duplicate branding:", branding.id)
    // TODO: Create duplicate with new name
  }

  const handlePreview = () => {
    window.open(branding.previewUrl, '_blank')
  }

  const handleSetDefault = () => {
    console.log("Set as default:", branding.id)
    // TODO: Set this branding as default
  }

  const handleDelete = () => {
    console.log("Delete branding:", branding.id)
    setShowDeleteDialog(false)
    // TODO: Delete branding
  }

  const handleConfigure = () => {
    setShowEditForm(true)
  }

  const handleSave = (updatedBranding: Partial<LoginBranding>) => {
    console.log("Save branding:", updatedBranding)
    // TODO: Save the updated branding
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleConfigure}>
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {!branding.isDefault && (
            <DropdownMenuItem onClick={handleSetDefault}>
              <Star className="mr-2 h-4 w-4" />
              Set as Default
            </DropdownMenuItem>
          )}
          
          {branding.isDefault && !branding.isSystem && (
            <DropdownMenuItem onClick={() => console.log("Remove default")}>
              <StarOff className="mr-2 h-4 w-4" />
              Remove Default
            </DropdownMenuItem>
          )}
          
          {!branding.isSystem && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the login branding "{branding.name}". 
              {branding.usageCount > 0 && (
                <span className="block mt-2 text-orange-600">
                  Warning: This branding is currently used by {branding.usageCount} application(s).
                </span>
              )}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LoginBrandingForm
        branding={branding}
        open={showEditForm}
        onOpenChange={setShowEditForm}
        onSave={handleSave}
      />
    </>
  )
}
