import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUpdateTenantMemberRole } from "@/hooks/useTenantMembers"
import { useToast } from "@/hooks/useToast"
import { useAppSelector } from '@/store/hooks'
import type { TenantMember } from "@/services/api/tenant/members"

interface UpdateMemberRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: TenantMember
}

export function UpdateMemberRoleDialog({ open, onOpenChange, member }: UpdateMemberRoleDialogProps) {
  const currentTenant = useAppSelector((state) => state.tenant.currentTenant)
  const tenantId = currentTenant?.tenant_id || ''
  const { showSuccess, showError } = useToast()
  const [role, setRole] = useState<'owner' | 'member'>(member.role)
  
  const updateRoleMutation = useUpdateTenantMemberRole(tenantId)

  // Reset role when member changes
  useEffect(() => {
    setRole(member.role)
  }, [member.role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (role === member.role) {
      showError("Please select a different role")
      return
    }

    try {
      await updateRoleMutation.mutateAsync({
        tenant_user_id: member.tenant_user_id,
        role
      })
      showSuccess("Member role updated successfully")
      onOpenChange(false)
    } catch (error) {
      showError(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Member Role</DialogTitle>
          <DialogDescription>
            Change the role for {member.user.fullname}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as 'owner' | 'member')}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Current role: <span className="font-medium capitalize">{member.role}</span>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateRoleMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
