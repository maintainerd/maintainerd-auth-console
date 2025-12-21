import { useState, useEffect } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRoles } from "@/hooks/useRoles"
import { useAssignSignupFlowRoles } from "@/hooks/useSignupFlows"
import { useToast } from "@/hooks/useToast"

interface AssignSignupFlowRolesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  signupFlowId: string
  existingRoleIds: string[]
}

export function AssignSignupFlowRolesDialog({
  open,
  onOpenChange,
  signupFlowId,
  existingRoleIds,
}: AssignSignupFlowRolesDialogProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const { showSuccess, showError } = useToast()
  const assignRolesMutation = useAssignSignupFlowRoles()

  // Fetch all roles
  const { data: rolesData, isLoading: isLoadingRoles } = useRoles({
    page: 1,
    limit: 100,
    sort_by: 'name',
    sort_order: 'asc'
  })

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedRoles([])
      setSearchQuery("")
    }
  }, [open])

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    )
  }

  const handleSelectAll = () => {
    if (!rolesData?.rows) return
    
    const availableRoles = rolesData.rows.filter(
      role => !existingRoleIds.includes(role.role_id)
    )
    const availableRoleIds = availableRoles.map(r => r.role_id)
    
    if (selectedRoles.length === availableRoleIds.length) {
      setSelectedRoles([])
    } else {
      setSelectedRoles(availableRoleIds)
    }
  }

  const handleSubmit = async () => {
    if (selectedRoles.length === 0) {
      showError("Please select at least one role")
      return
    }

    try {
      await assignRolesMutation.mutateAsync({
        signupFlowId,
        data: { role_uuids: selectedRoles }
      })

      showSuccess(`${selectedRoles.length} role${selectedRoles.length !== 1 ? 's' : ''} assigned successfully`)
      onOpenChange(false)
    } catch (error) {
      showError(error)
    }
  }

  const isLoading = assignRolesMutation.isPending

  // Filter roles based on search query and exclude already assigned roles
  const filteredRoles = rolesData?.rows.filter(role =>
    !existingRoleIds.includes(role.role_id) &&
    (role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || []

  const availableRolesCount = rolesData?.rows.filter(
    role => !existingRoleIds.includes(role.role_id)
  ).length || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Roles to Sign Up Flow</DialogTitle>
          <DialogDescription>
            Select roles to assign to this sign up flow. Already assigned roles are not shown.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search and Select All */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select Roles</Label>
              {availableRolesCount > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-7 text-xs"
                >
                  {selectedRoles.length === availableRolesCount
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Roles List */}
          <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto">
            {isLoadingRoles ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading roles...
              </div>
            ) : filteredRoles.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchQuery
                  ? "No roles found matching your search"
                  : availableRolesCount === 0
                  ? "All available roles are already assigned"
                  : "No roles available"}
              </div>
            ) : (
              filteredRoles.map((role) => (
                <div
                  key={role.role_id}
                  className="flex items-start space-x-3 p-4 hover:bg-accent/50 cursor-pointer"
                  onClick={() => handleRoleToggle(role.role_id)}
                >
                  <Checkbox
                    id={`role-${role.role_id}`}
                    checked={selectedRoles.includes(role.role_id)}
                    onCheckedChange={() => handleRoleToggle(role.role_id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor={`role-${role.role_id}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {role.name}
                    </Label>
                    {role.description && (
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Selected Count */}
          {selectedRoles.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedRoles.length} role{selectedRoles.length !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || selectedRoles.length === 0}
          >
            {isLoading ? (
              <>
                <Plus className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Assign Roles
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
