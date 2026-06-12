import { useState } from "react"
import { ChevronDown, ChevronRight, Key, Plus, Server, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SystemBadge } from "@/components/badges"
import { InformationCard } from "@/components/card"
import { EmptyState, ListSkeleton, StatusBadge } from "@/components/details"
import { RowActions, type RowActionItem } from "@/components/data-table"
import { useApiKeyApiPermissions, useApiKeyApis, useRemoveApiKeyApi, useRemoveApiKeyApiPermission } from "@/hooks/useApiKeys"
import { useToast } from "@/hooks/useToast"
import { AddApiKeyApiDialog } from "./AddApiKeyApiDialog"
import { AddApiKeyApiPermissionsDialog } from "./AddApiKeyApiPermissionsDialog"
import type { ApiKeyApiItem, ApiKeyApiPermission } from "@/services/api/api-keys/types"
import type { Status } from "@/types/status"

interface ApiKeyApisProps {
  apiKeyId: string
}

interface AddPermissionsDialogState {
  open: boolean
  apiId: string | null
  apiName: string | null
  existingPermissionIds: string[]
}

export function ApiKeyApis({ apiKeyId }: ApiKeyApisProps) {
  const [expandedApis, setExpandedApis] = useState<Set<string>>(new Set())
  const [addApiDialogOpen, setAddApiDialogOpen] = useState(false)
  const [addPermissionsDialog, setAddPermissionsDialog] = useState<AddPermissionsDialogState>({
    open: false,
    apiId: null,
    apiName: null,
    existingPermissionIds: [],
  })

  const { data, isLoading, error } = useApiKeyApis(apiKeyId)
  const removeApiMutation = useRemoveApiKeyApi()
  const removePermissionMutation = useRemoveApiKeyApiPermission()
  const { showSuccess, showError } = useToast()

  const toggleApiExpanded = (apiId: string) => {
    const nextExpanded = new Set(expandedApis)
    if (nextExpanded.has(apiId)) {
      nextExpanded.delete(apiId)
    } else {
      nextExpanded.add(apiId)
    }
    setExpandedApis(nextExpanded)
  }

  const openAddPermissionsDialog = (apiId: string, apiName: string, existingPermissionIds: string[]) => {
    setAddPermissionsDialog({
      open: true,
      apiId,
      apiName,
      existingPermissionIds,
    })
  }

  const removeApi = async (api: ApiKeyApiItem) => {
    try {
      await removeApiMutation.mutateAsync({
        apiKeyId,
        apiId: api.api_id,
      })
      showSuccess("API removed from API key successfully")
    } catch (error) {
      showError(error)
    }
  }

  const removePermission = async (apiId: string, permission: ApiKeyApiPermission) => {
    try {
      await removePermissionMutation.mutateAsync({
        apiKeyId,
        apiId,
        permissionId: permission.permission_id,
      })
      showSuccess("Permission removed from API key API successfully")
    } catch (error) {
      showError(error)
    }
  }

  return (
    <>
      <InformationCard
        title="API Permissions"
        description="Manage API access and assigned permissions for this API key."
        icon={Server}
        action={
          <Button size="sm" onClick={() => setAddApiDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add API
          </Button>
        }
      >
        <div className="space-y-4">
          {isLoading && <ListSkeleton />}

          {error && (
            <p className="py-8 text-center text-sm text-destructive">Failed to load APIs</p>
          )}

          {data && data.rows.length === 0 && (
            <EmptyState
              icon={Server}
              title="No API permissions"
              description="This API key has no APIs assigned yet. Add an API to grant access and permissions."
            />
          )}

          {data && data.rows.length > 0 && (
            <div className="space-y-3">
              {data.rows.map((api) => (
                <ApiKeyApiAccessItem
                  key={api.api_id}
                  apiKeyId={apiKeyId}
                  api={api}
                  isExpanded={expandedApis.has(api.api_id)}
                  onToggleExpand={() => toggleApiExpanded(api.api_id)}
                  onAddPermissions={openAddPermissionsDialog}
                  onRemoveApi={removeApi}
                  onRemovePermission={removePermission}
                />
              ))}
            </div>
          )}
        </div>
      </InformationCard>

      <AddApiKeyApiDialog
        open={addApiDialogOpen}
        onOpenChange={setAddApiDialogOpen}
        apiKeyId={apiKeyId}
      />

      {addPermissionsDialog.apiId && (
        <AddApiKeyApiPermissionsDialog
          open={addPermissionsDialog.open}
          onOpenChange={(open) => setAddPermissionsDialog({
            open,
            apiId: null,
            apiName: null,
            existingPermissionIds: [],
          })}
          apiKeyId={apiKeyId}
          apiId={addPermissionsDialog.apiId}
          apiName={addPermissionsDialog.apiName || ""}
          existingPermissionIds={addPermissionsDialog.existingPermissionIds}
        />
      )}
    </>
  )
}

interface ApiKeyApiAccessItemProps {
  apiKeyId: string
  api: ApiKeyApiItem
  isExpanded: boolean
  onToggleExpand: () => void
  onAddPermissions: (apiId: string, apiName: string, existingPermissionIds: string[]) => void
  onRemoveApi: (api: ApiKeyApiItem) => Promise<void>
  onRemovePermission: (apiId: string, permission: ApiKeyApiPermission) => Promise<void>
}

function ApiKeyApiAccessItem({
  apiKeyId,
  api,
  isExpanded,
  onToggleExpand,
  onAddPermissions,
  onRemoveApi,
  onRemovePermission,
}: ApiKeyApiAccessItemProps) {
  const { data, isLoading, error } = useApiKeyApiPermissions(apiKeyId, api.api_id, isExpanded)
  const permissions = data?.permissions ?? []
  const existingPermissionIds = permissions.map((permission) => permission.permission_id)

  const apiActions: RowActionItem[] = [
    {
      key: "add-permission",
      label: "Add Permission",
      icon: Plus,
      onSelect: () => onAddPermissions(api.api_id, api.display_name, existingPermissionIds),
    },
    {
      key: "remove-api",
      label: "Remove API",
      icon: Trash2,
      destructive: true,
      separatorBefore: true,
      onSelect: () => onRemoveApi(api),
      confirm: {
        title: "Remove API from API Key",
        description: "This will remove the API and all of its permissions from this API key. The API itself will not be deleted.",
        destructive: true,
        itemName: api.display_name,
      },
    },
  ]

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Server className="size-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">{api.display_name}</span>
              <StatusBadge status={api.status as Status} />
              <SystemBadge isSystem={api.is_system} />
              {api.is_default && (
                <Badge variant="outline" className="text-xs">
                  Default
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{api.description}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="font-mono">{api.name}</span>
              {api.identifier && <span className="font-mono">{api.identifier}</span>}
              {api.api_type && <span>{api.api_type}</span>}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isExpanded && !isLoading && !error && (
            <Badge variant="secondary" className="text-xs">
              {permissions.length} {permissions.length === 1 ? "permission" : "permissions"}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            aria-expanded={isExpanded}
            onClick={onToggleExpand}
          >
            <span className="sr-only">{isExpanded ? "Collapse permissions" : "Expand permissions"}</span>
            {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          </Button>
          <RowActions items={apiActions} />
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 border-t pt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold">Permissions</h4>
              <p className="text-sm text-muted-foreground">Permissions granted for this API key.</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-2"
              onClick={() => onAddPermissions(api.api_id, api.display_name, existingPermissionIds)}
              disabled={isLoading}
            >
              <Plus className="size-4" />
              Add Permission
            </Button>
          </div>

          {isLoading && <ListSkeleton rows={2} />}

          {error && (
            <p className="py-6 text-center text-sm text-destructive">Failed to load permissions</p>
          )}

          {!isLoading && !error && permissions.length === 0 && (
            <EmptyState
              icon={Key}
              title="No permissions"
              description="This API is assigned to the API key, but no permissions are granted yet."
            />
          )}

          {!isLoading && !error && permissions.length > 0 && (
            <div className="space-y-2">
              {permissions.map((permission) => {
                const permissionActions: RowActionItem[] = [
                  {
                    key: "remove-permission",
                    label: "Remove Permission",
                    icon: Trash2,
                    destructive: true,
                    onSelect: () => onRemovePermission(api.api_id, permission),
                    confirm: {
                      title: "Remove Permission",
                      description: `This will remove "${permission.name}" from this API key's access to ${api.display_name}.`,
                      confirmText: "Remove",
                    },
                  },
                ]

                return (
                  <div
                    key={permission.permission_id}
                    className="flex items-start justify-between gap-3 rounded-md border bg-background p-3"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-medium">{permission.name}</span>
                        <StatusBadge status={permission.status as Status} />
                        <SystemBadge isSystem={permission.is_system} />
                        {permission.is_default && (
                          <Badge variant="outline" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{permission.description}</p>
                    </div>
                    <RowActions items={permissionActions} />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
