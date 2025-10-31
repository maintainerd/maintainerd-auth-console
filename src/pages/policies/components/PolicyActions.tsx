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
  Eye,
  Edit,
  Copy,
  Download,
  Play,
  Pause,
  Trash2
} from "lucide-react"
import type { Policy } from "../constants"

interface PolicyActionsProps {
  policy: Policy
}

export function PolicyActions({ policy }: PolicyActionsProps) {
  const { containerId } = useParams<{ containerId: string }>()
  const navigate = useNavigate()

  const handleViewPolicy = () => {
    navigate(`/c/${containerId}/policies/${policy.id}`)
  }

  const handleEditPolicy = () => {
    navigate(`/c/${containerId}/policies/${policy.id}/edit`)
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



  const handleDeletePolicy = () => {
    console.log("Delete policy:", policy.id)
  }

  const isActive = policy.status === "active"
  const isDraft = policy.status === "draft"
  const isDeprecated = policy.status === "deprecated"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleViewPolicy}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleEditPolicy} disabled={policy.isSystem}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Policy
        </DropdownMenuItem>

        {!isActive && !isDeprecated && (
          <DropdownMenuItem onClick={handleActivatePolicy}>
            <Play className="mr-2 h-4 w-4" />
            Activate Policy
          </DropdownMenuItem>
        )}

        {isActive && (
          <DropdownMenuItem onClick={handleDeactivatePolicy}>
            <Pause className="mr-2 h-4 w-4" />
            Deactivate Policy
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleDuplicatePolicy}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDownloadPolicy}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleDeletePolicy}
          className="text-destructive"
          disabled={policy.isSystem}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
