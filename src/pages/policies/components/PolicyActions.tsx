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
  Eye, 
  Edit, 
  Copy, 
  Download, 
  Play, 
  Pause, 
  Trash2, 
  Server,
  FileText,
  History
} from "lucide-react"
import type { Policy } from "../constants"

interface PolicyActionsProps {
  policy: Policy
}

export function PolicyActions({ policy }: PolicyActionsProps) {
  const handleViewPolicy = () => {
    console.log("View policy:", policy.id)
  }

  const handleEditPolicy = () => {
    console.log("Edit policy:", policy.id)
  }

  const handleDuplicatePolicy = () => {
    console.log("Duplicate policy:", policy.id)
  }

  const handleDownloadPolicy = () => {
    console.log("Download policy:", policy.id)
  }

  const handleActivatePolicy = () => {
    console.log("Activate policy:", policy.id)
  }

  const handleDeactivatePolicy = () => {
    console.log("Deactivate policy:", policy.id)
  }

  const handleManageServices = () => {
    console.log("Manage services for policy:", policy.id)
  }

  const handleViewStatements = () => {
    console.log("View statements for policy:", policy.id)
  }

  const handleViewHistory = () => {
    console.log("View history for policy:", policy.id)
  }

  const handleDeletePolicy = () => {
    console.log("Delete policy:", policy.id)
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
        <DropdownMenuLabel>Policy Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleViewPolicy}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleEditPolicy}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Policy
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleViewStatements}>
          <FileText className="mr-2 h-4 w-4" />
          View Statements
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleManageServices}>
          <Server className="mr-2 h-4 w-4" />
          Manage Services
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleDuplicatePolicy}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate Policy
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleDownloadPolicy}>
          <Download className="mr-2 h-4 w-4" />
          Export Policy
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {policy.status === "active" ? (
          <DropdownMenuItem onClick={handleDeactivatePolicy}>
            <Pause className="mr-2 h-4 w-4" />
            Deactivate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleActivatePolicy}>
            <Play className="mr-2 h-4 w-4" />
            Activate
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={handleViewHistory}>
          <History className="mr-2 h-4 w-4" />
          View History
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleDeletePolicy}
          className="text-destructive"
          disabled={policy.isSystem}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Policy
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
