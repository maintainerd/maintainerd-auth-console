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
  CheckCircle,
  AlertTriangle,
  Eye,
  Settings,
  FileText,
  Trash2,
  Copy
} from "lucide-react"
import type { Container } from "./ContainerColumns"

interface ContainerActionsProps {
  container: Container
}

export function ContainerActions({ container }: ContainerActionsProps) {
  const handleActivate = () => {
    console.log("Activate tenant:", container.id)
    // TODO: Implement activate tenant
  }

  const handleSuspend = () => {
    console.log("Suspend tenant:", container.id)
    // TODO: Implement suspend tenant
  }

  const handleViewDetails = () => {
    console.log("View tenant details:", container.id)
    // TODO: Implement view details
  }





  const handleViewAuditLogs = () => {
    console.log("View audit logs:", container.id)
    // TODO: Implement view audit logs
  }

  const handleEditSettings = () => {
    console.log("Edit tenant settings:", container.id)
    // TODO: Implement edit settings
  }



  const handleDuplicate = () => {
    console.log("Duplicate tenant:", container.id)
    // TODO: Implement duplicate tenant
  }

  const handleDelete = () => {
    console.log("Delete tenant:", container.id)
    // TODO: Implement delete tenant
  }

  const isActive = container.status === "active"
  const isSuspended = container.status === "suspended"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleViewAuditLogs}>
          <FileText className="mr-2 h-4 w-4" />
          Audit Logs
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {isSuspended && (
          <DropdownMenuItem onClick={handleActivate}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Activate Container
          </DropdownMenuItem>
        )}
        {isActive && (
          <DropdownMenuItem onClick={handleSuspend}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Suspend Container
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleEditSettings}>
          <Settings className="mr-2 h-4 w-4" />
          Edit Settings
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate Container
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {!container.isSystem && (
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Container
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
