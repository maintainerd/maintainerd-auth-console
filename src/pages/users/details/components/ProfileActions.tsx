import { MoreHorizontal, Edit, Trash2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { UserProfileType } from "@/services/api/user/types"

interface ProfileActionsProps {
  profile: UserProfileType
  onEdit: (profile: UserProfileType) => void
  onDelete: (profile: UserProfileType) => void
  onSetAsDefault: (profile: UserProfileType) => void
}

export function ProfileActions({ profile, onEdit, onDelete, onSetAsDefault }: ProfileActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(profile)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </DropdownMenuItem>
        
        {!profile.is_default && (
          <DropdownMenuItem onClick={() => onSetAsDefault(profile)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Set As Default
          </DropdownMenuItem>
        )}

        {!profile.is_default && <DropdownMenuSeparator />}
        
        {!profile.is_default && (
          <DropdownMenuItem
            onClick={() => onDelete(profile)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Profile
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
