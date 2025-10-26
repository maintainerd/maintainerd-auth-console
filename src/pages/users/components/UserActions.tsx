import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Key,
  Mail,
  Shield,
  Eye,
  ShieldCheck,
  RotateCcw
} from "lucide-react"
import type { User as UserType } from "./UserColumns"

interface Props {
  user: UserType
  children: React.ReactNode
}

export function UserActions({ user, children }: Props) {
  const handleViewProfile = () => {
    console.log("View profile:", user)
  }

  const handleEdit = () => {
    console.log("Edit user:", user)
  }

  const handleToggleStatus = () => {
    const newStatus = user.status === "active" ? "inactive" : "active"
    console.log(`${newStatus === "active" ? "Activate" : "Deactivate"} user:`, user)
  }

  const handleResetPassword = () => {
    console.log("Reset password for user:", user)
  }

  const handleResendVerification = () => {
    console.log("Resend verification email to:", user)
  }

  const handleManageRoles = () => {
    console.log("Manage roles for user:", user)
  }

  const handleToggle2FA = () => {
    const action = user.twoFactorEnabled ? "disable" : "enable"
    console.log(`${action} 2FA for user:`, user)
  }

  const handleResetLoginAttempts = () => {
    console.log("Reset login attempts for user:", user)
  }

  const handleDelete = () => {
    console.log("Delete user:", user)
  }

  const isActive = user.status === "active"
  const isPending = user.status === "pending"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleViewProfile}>
          <Eye className="mr-2 h-4 w-4" />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit User
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleToggleStatus}>
          {isActive ? (
            <>
              <UserX className="mr-2 h-4 w-4" />
              Deactivate
            </>
          ) : (
            <>
              <UserCheck className="mr-2 h-4 w-4" />
              Activate
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleResetPassword}>
          <Key className="mr-2 h-4 w-4" />
          Reset Password
        </DropdownMenuItem>

        {(!user.emailVerified || isPending) && (
          <DropdownMenuItem onClick={handleResendVerification}>
            <Mail className="mr-2 h-4 w-4" />
            Resend Verification
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleManageRoles}>
          <Shield className="mr-2 h-4 w-4" />
          Manage Roles
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleToggle2FA}>
          <ShieldCheck className="mr-2 h-4 w-4" />
          {user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
        </DropdownMenuItem>

        {user.loginAttempts > 0 && (
          <DropdownMenuItem onClick={handleResetLoginAttempts}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Login Attempts ({user.loginAttempts})
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
