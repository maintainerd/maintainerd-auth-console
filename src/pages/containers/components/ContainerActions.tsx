import { Button } from "@/components/ui/button"
import { useNavigate, useParams } from "react-router-dom"
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
  Edit,
  Trash2
} from "lucide-react"
import type { Container } from "./ContainerColumns"

interface ContainerActionsProps {
  container: Container
}

export function ContainerActions({ container }: ContainerActionsProps) {
  const navigate = useNavigate()
  const { containerId } = useParams<{ containerId: string }>()
  const handleActivate = () => {
    console.log("Activate tenant:", container.id)
    // TODO: Implement activate tenant
  }

  const handleSuspend = () => {
    console.log("Suspend tenant:", container.id)
    // TODO: Implement suspend tenant
  }

  const handleViewDetails = () => {
    navigate(`/c/${containerId}/containers/${container.id}`)
  }







  const handleUpdateContainer = () => {
    navigate(`/c/${containerId}/containers/${container.id}/edit`)
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

        <DropdownMenuItem onClick={handleUpdateContainer}>
          <Edit className="mr-2 h-4 w-4" />
          Update Container
        </DropdownMenuItem>

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

        {!container.isSystem && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Container
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
