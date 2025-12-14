import { useState } from "react"
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SystemBadge } from "@/components/badges"
import { useApiKeyApiPermissions } from "@/hooks/useApiKeys"
import type { ApiKeyApiItemType } from "@/services/api/api-key/types"

interface ApiKeyApiItemProps {
  apiKeyId: string
  api: ApiKeyApiItemType
  isExpanded: boolean
  onToggleExpand: () => void
  onDelete: () => void
  onAddPermissions: (apiId: string, apiName: string, existingPermissionIds: string[]) => void
  onDeletePermission: (apiId: string, permissionId: string, permissionName: string) => void
}

export function ApiKeyApiItem({
  apiKeyId,
  api,
  isExpanded,
  onToggleExpand,
  onDelete,
  onAddPermissions,
  onDeletePermission
}: ApiKeyApiItemProps) {
  // Fetch permissions only when expanded
  const { data: permissionsData, isLoading: isLoadingPermissions } = useApiKeyApiPermissions(
    apiKeyId,
    api.api_id,
    isExpanded
  )

  const permissions = permissionsData?.permissions || []

  return (
    <div className="border rounded-lg">
      {/* API Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{api.display_name}</h4>
              <SystemBadge isSystem={api.is_default} />
            </div>
            <p className="text-sm text-muted-foreground">{api.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isLoadingPermissions && isExpanded && (
            <Badge variant="secondary" className="text-xs">
              {permissions.length} {permissions.length === 1 ? 'permission' : 'permissions'}
            </Badge>
          )}
          <Badge variant={api.status === "active" ? "secondary" : "outline"} className="capitalize">
            {api.status}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Permissions List (Expandable) */}
      {isExpanded && (
        <div className="border-t bg-muted/30">
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-medium">Permissions</h5>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                onClick={() => onAddPermissions(
                  api.api_id,
                  api.display_name,
                  permissions.map(p => p.permission_id)
                )}
                disabled={isLoadingPermissions}
              >
                <Plus className="h-3 w-3" />
                Add Permission
              </Button>
            </div>

            {isLoadingPermissions && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Loading permissions...
              </p>
            )}

            {!isLoadingPermissions && permissions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No permissions assigned
              </p>
            )}

            {!isLoadingPermissions && permissions.length > 0 && (
              <div className="space-y-1">
                {permissions.map((permission) => (
                  <div
                    key={permission.permission_id}
                    className="flex items-center justify-between p-2 rounded bg-background hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm font-mono">{permission.name}</span>
                      <SystemBadge isSystem={permission.is_default} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{permission.description}</span>
                      <Badge variant={permission.status === "active" ? "secondary" : "outline"} className="text-xs capitalize">
                        {permission.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeletePermission(
                          api.api_id,
                          permission.permission_id,
                          permission.name
                        )}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

