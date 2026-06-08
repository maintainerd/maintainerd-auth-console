import { useState } from "react"
import {
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle2,
  Phone,
  UserCheck,
  Mail,
  Building2,
  CalendarDays,
  Minus,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirmationDialog, ConfirmationDialog } from "@/components/dialog"
import { DetailHeaderCard, StatusBadge, type DetailAttribute } from "@/components/details"
import { useDeleteUser, useVerifyUserEmail, useVerifyUserPhone, useCompleteUserAccount } from "@/hooks/useUsers"
import { useToast } from "@/hooks/useToast"
import type { User } from "@/services/api/users/types"

interface UserHeaderProps {
  user: User
  tenantId: string
  userId: string
}

/** A subtle verified / not-verified inline indicator (no pastel blocks). */
function VerifiedMark({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
      <CheckCircle2 className="size-3.5" />
      Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
      <Minus className="size-3.5" />
      Not verified
    </span>
  )
}

/** Profile / account completion shown as a subtle check or dash. */
function CompletionMark({ label, complete }: { label: string; complete: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      {complete ? (
        <CheckCircle2 className="size-3.5 text-emerald-600" />
      ) : (
        <Minus className="size-3.5 text-muted-foreground" />
      )}
      <span className={complete ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </span>
  )
}

export function UserHeader({ user, tenantId, userId }: UserHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteUserMutation = useDeleteUser()
  const verifyEmailMutation = useVerifyUserEmail()
  const verifyPhoneMutation = useVerifyUserPhone()
  const completeAccountMutation = useCompleteUserAccount()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showVerifyEmailDialog, setShowVerifyEmailDialog] = useState(false)
  const [showVerifyPhoneDialog, setShowVerifyPhoneDialog] = useState(false)
  const [showCompleteAccountDialog, setShowCompleteAccountDialog] = useState(false)

  const runAction = async (mutate: () => Promise<unknown>, successMessage: string) => {
    try {
      await mutate()
      showSuccess(successMessage)
    } catch (error) {
      showError(error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteUserMutation.mutateAsync(userId)
      showSuccess("User deleted successfully")
      navigate(`/${tenantId}/users`)
    } catch (error) {
      showError(error)
    }
  }

  const initials = (user.fullname || user.username).slice(0, 2).toUpperCase()

  const attributes: DetailAttribute[] = [
    {
      icon: Mail,
      label: "Email",
      value: (
        <div className="flex flex-col gap-0.5">
          <span className="break-all">{user.email}</span>
          <VerifiedMark verified={user.is_email_verified} />
        </div>
      ),
    },
    {
      icon: Phone,
      label: "Phone",
      value: user.phone ? (
        <div className="flex flex-col gap-0.5">
          <span>{user.phone}</span>
          <VerifiedMark verified={user.is_phone_verified} />
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
    },
    {
      icon: UserCheck,
      label: "Account",
      value: (
        <div className="flex flex-col gap-1">
          <CompletionMark label="Profile" complete={user.is_profile_completed} />
          <CompletionMark label="Account" complete={user.is_account_completed} />
        </div>
      ),
    },
    ...(user.tenant
      ? [
          {
            icon: Building2,
            label: "Tenant",
            value: (
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{user.tenant.name}</span>
                <span className="font-mono text-xs text-muted-foreground">{user.tenant.identifier}</span>
              </div>
            ),
          } satisfies DetailAttribute,
        ]
      : []),
    { icon: CalendarDays, label: "Created", value: format(new Date(user.created_at), "PP") },
    { icon: CalendarDays, label: "Last updated", value: format(new Date(user.updated_at), "PP") },
  ]

  return (
    <>
      <DetailHeaderCard
        leading={
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-semibold text-white shadow-sm shadow-blue-500/20">
            {initials}
          </div>
        }
        title={user.fullname || user.username}
        badge={<StatusBadge status={user.status} />}
        subtitle={`@${user.username}`}
        attributes={attributes}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={() =>
                navigate(`/${tenantId}/users/${userId}/edit`, {
                  state: { from: `/${tenantId}/users/${userId}`, backLabel: "Back to User Details" },
                })
              }
            >
              <Edit className="size-4" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                  <span className="sr-only">Open actions</span>
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowVerifyEmailDialog(true)}>
                  <CheckCircle2 className="mr-2 size-4" />
                  Mark Email as Verified
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowVerifyPhoneDialog(true)}>
                  <Phone className="mr-2 size-4" />
                  Mark Phone as Verified
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowCompleteAccountDialog(true)}>
                  <UserCheck className="mr-2 size-4" />
                  Mark Account as Completed
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete User"
        description="This permanently deletes the user account and all associated data. This action cannot be undone."
        itemName={user.fullname || user.username}
        isDeleting={deleteUserMutation.isPending}
      />

      <ConfirmationDialog
        open={showVerifyEmailDialog}
        onOpenChange={setShowVerifyEmailDialog}
        onConfirm={() => runAction(() => verifyEmailMutation.mutateAsync(userId), "Email verified successfully")}
        title="Verify Email"
        description="Are you sure you want to mark this user's email as verified?"
        isLoading={verifyEmailMutation.isPending}
      />

      <ConfirmationDialog
        open={showVerifyPhoneDialog}
        onOpenChange={setShowVerifyPhoneDialog}
        onConfirm={() => runAction(() => verifyPhoneMutation.mutateAsync(userId), "Phone verified successfully")}
        title="Verify Phone"
        description="Are you sure you want to mark this user's phone as verified?"
        isLoading={verifyPhoneMutation.isPending}
      />

      <ConfirmationDialog
        open={showCompleteAccountDialog}
        onOpenChange={setShowCompleteAccountDialog}
        onConfirm={() =>
          runAction(() => completeAccountMutation.mutateAsync(userId), "Account completed successfully")
        }
        title="Complete Account"
        description="Are you sure you want to mark this user's account as completed?"
        isLoading={completeAccountMutation.isPending}
      />
    </>
  )
}
