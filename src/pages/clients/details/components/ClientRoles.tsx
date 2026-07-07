import { useState } from "react"
import { Shield, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InformationCard } from "@/components/card"
import { EmptyState, ListSkeleton } from "@/components/details"
import { useRoles } from "@/hooks/useRoles"
import { useClientRoles, useAddClientRole, useRemoveClientRole } from "@/hooks/useClients"
import { useToast } from "@/hooks/useToast"
import { RowActions, type RowActionItem } from "@/components/data-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Role } from "@/services/api/roles/types"

interface ClientRolesProps {
  clientId: string
}

export function ClientRoles({ clientId }: ClientRolesProps) {
  const { showSuccess, showError } = useToast()
  const [selectedRoleId, setSelectedRoleId] = useState("")

  const { data: clientRoles, isLoading } = useClientRoles(clientId)
  const { data: allRolesData } = useRoles({ page: 1, limit: 100, status: "active" })
  const addRole = useAddClientRole(clientId)
  const removeRole = useRemoveClientRole(clientId)

  const assignedIds = new Set((clientRoles ?? []).map((r) => r.role_id))
  const availableRoles = (allRolesData?.rows ?? []).filter((r) => !assignedIds.has(r.role_id))

  const handleAdd = async () => {
    if (!selectedRoleId) return
    try {
      await addRole.mutateAsync(selectedRoleId)
      setSelectedRoleId("")
      showSuccess("Role added")
    } catch (err) {
      showError(err)
    }
  }

  const handleRemove = async (roleId: string) => {
    try {
      await removeRole.mutateAsync(roleId)
      showSuccess("Role removed")
    } catch (err) {
      showError(err)
    }
  }

  const getActions = (role: Role): RowActionItem[] => [
    {
      key: "remove",
      label: "Remove",
      icon: Trash2,
      destructive: true,
      onSelect: () => handleRemove(role.role_id),
      confirm: {
        title: "Remove role",
        description: "Remove this role from the client?",
        confirmText: "Remove",
      },
    },
  ]

  return (
    <InformationCard
      title="Roles"
      description="Roles assigned to this client for access control."
      icon={Shield}
    >
      <div className="space-y-4">
        {availableRoles.length > 0 && (
          <div className="flex items-center gap-2">
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a role to add..." />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role.role_id} value={role.role_id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!selectedRoleId || addRole.isPending}
            >
              <Plus className="mr-1 size-4" />
              Add
            </Button>
          </div>
        )}

        {isLoading && <ListSkeleton />}

        {!isLoading && (clientRoles?.length ?? 0) === 0 && (
          <EmptyState
            icon={Shield}
            title="No roles assigned"
            description="This client has no roles."
          />
        )}

        {(clientRoles ?? []).map((role) => (
          <div
            key={role.role_id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div>
              <p className="text-sm font-medium">{role.name}</p>
              {role.description && (
                <p className="text-xs text-muted-foreground">{role.description}</p>
              )}
            </div>
            <RowActions items={getActions(role)} />
          </div>
        ))}
      </div>
    </InformationCard>
  )
}
