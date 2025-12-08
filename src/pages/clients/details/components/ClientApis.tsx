import { useState } from "react"
import { Server, Search, Plus, ChevronDown, ChevronRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SystemBadge } from "@/components/badges"
import { InformationCard } from "@/components/card"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { useClientApis, useRemoveClientApi, useRemoveClientApiPermission } from "@/hooks/useClients"
import { useToast } from "@/hooks/useToast"
import { AddClientApiDialog } from "./AddClientApiDialog"
import { AddClientApiPermissionsDialog } from "./AddClientApiPermissionsDialog"
import type { ClientApiAssociationType } from "@/services/api/auth-client/types"

interface ClientApisProps {
  clientId: string
}

export function ClientApis({ clientId }: ClientApisProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedApis, setExpandedApis] = useState<Set<string>>(new Set())
  const [addApiDialogOpen, setAddApiDialogOpen] = useState(false)
  const [addPermissionsDialog, setAddPermissionsDialog] = useState<{
    open: boolean
    apiId: string | null
    apiName: string | null
    existingPermissionIds: string[]
  }>({
    open: false,
    apiId: null,
    apiName: null,
    existingPermissionIds: []
  })
  const [deleteApiDialog, setDeleteApiDialog] = useState<{ open: boolean; api: ClientApiAssociationType | null }>({
    open: false,
    api: null
  })
  const [deletePermissionDialog, setDeletePermissionDialog] = useState<{
    open: boolean
    apiId: string | null
    permissionId: string | null
    permissionName: string | null
  }>({
    open: false,
    apiId: null,
    permissionId: null,
    permissionName: null
  })

  const { data, isLoading, error } = useClientApis(clientId)
  const removeApiMutation = useRemoveClientApi()
  const removePermissionMutation = useRemoveClientApiPermission()
  const { showSuccess, showError } = useToast()

  const toggleApiExpanded = (apiId: string) => {
    const newExpanded = new Set(expandedApis)
    if (newExpanded.has(apiId)) {
      newExpanded.delete(apiId)
    } else {
      newExpanded.add(apiId)
    }
    setExpandedApis(newExpanded)
  }

  const handleRemoveApi = async () => {
    if (!deleteApiDialog.api) return

    try {
      await removeApiMutation.mutateAsync({
        clientId,
        apiId: deleteApiDialog.api.api.api_id
      })
      showSuccess("API removed from client successfully")
      setDeleteApiDialog({ open: false, api: null })
    } catch (error) {
      showError(error)
    }
  }

  const handleRemovePermission = async () => {
    if (!deletePermissionDialog.apiId || !deletePermissionDialog.permissionId) return

    try {
      await removePermissionMutation.mutateAsync({
        clientId,
        apiId: deletePermissionDialog.apiId,
        permissionId: deletePermissionDialog.permissionId
      })
      showSuccess("Permission removed from client API successfully")
      setDeletePermissionDialog({ open: false, apiId: null, permissionId: null, permissionName: null })
    } catch (error) {
      showError(error)
    }
  }

  // Filter APIs based on search query
  const filteredApis = data?.apis.filter(item =>
    item.api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.api.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <>
      <InformationCard
        title="Client APIs"
        description="Manage APIs and their permissions for this client"
        icon={Server}
      >
        <div className="space-y-4">
          {/* Search filter and Add button */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search APIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button size="sm" className="gap-2" onClick={() => setAddApiDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Add API
            </Button>
          </div>

          {/* Horizontal line */}
          <div className="border-t" />

          {/* Content area */}
          <div className="max-h-[600px] overflow-y-auto pr-2">
            {isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                Loading APIs...
              </div>
            )}

            {error && (
              <div className="text-center py-8 text-destructive">
                Failed to load APIs
              </div>
            )}

            {data && filteredApis.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No APIs found matching your search" : "No APIs assigned to this client"}
              </div>
            )}

            {filteredApis.length > 0 && (
              <div className="space-y-2">
                {filteredApis.map((item) => {
                  const isExpanded = expandedApis.has(item.api.api_id)
                  const permissions = item.permissions || []
                  return (
                    <div key={item.auth_client_api_id} className="border rounded-lg">
                      {/* API Header */}
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3 flex-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleApiExpanded(item.api.api_id)}
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
                              <h4 className="font-medium">{item.api.display_name}</h4>
                              <SystemBadge isSystem={item.api.is_default} />
                            </div>
                            <p className="text-sm text-muted-foreground">{item.api.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {permissions.length} {permissions.length === 1 ? 'permission' : 'permissions'}
                          </Badge>
                          <Badge variant={item.api.status === "active" ? "secondary" : "outline"} className="capitalize">
                            {item.api.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteApiDialog({ open: true, api: item })}
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
                                onClick={() => setAddPermissionsDialog({
                                  open: true,
                                  apiId: item.api.api_id,
                                  apiName: item.api.display_name,
                                  existingPermissionIds: permissions.map(p => p.permission_id)
                                })}
                              >
                                <Plus className="h-3 w-3" />
                                Add Permission
                              </Button>
                            </div>
                            {permissions.length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                No permissions assigned
                              </p>
                            ) : (
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
                                        onClick={() => setDeletePermissionDialog({
                                          open: true,
                                          apiId: item.api.api_id,
                                          permissionId: permission.permission_id,
                                          permissionName: permission.name
                                        })}
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
                })}
              </div>
            )}
          </div>
        </div>
      </InformationCard>

      {/* Delete API Dialog */}
      <DeleteConfirmationDialog
        open={deleteApiDialog.open}
        onOpenChange={(open) => setDeleteApiDialog({ open, api: null })}
        onConfirm={handleRemoveApi}
        title="Remove API from Client"
        description="This action will remove the API and all its permissions from this client."
        confirmationText="This will remove the API from this client. The API itself will not be deleted."
        itemName={deleteApiDialog.api?.api.display_name || ""}
        isDeleting={removeApiMutation.isPending}
      />

      {/* Delete Permission Dialog */}
      <DeleteConfirmationDialog
        open={deletePermissionDialog.open}
        onOpenChange={(open) => setDeletePermissionDialog({ open, apiId: null, permissionId: null, permissionName: null })}
        onConfirm={handleRemovePermission}
        title="Remove Permission from Client API"
        description="This action will remove the permission from this client API."
        confirmationText="This will remove the permission from this client API. The permission itself will not be deleted."
        itemName={deletePermissionDialog.permissionName || ""}
        isDeleting={removePermissionMutation.isPending}
      />

      {/* Add API Dialog */}
      <AddClientApiDialog
        open={addApiDialogOpen}
        onOpenChange={setAddApiDialogOpen}
        clientId={clientId}
      />

      {/* Add Permissions Dialog */}
      {addPermissionsDialog.apiId && (
        <AddClientApiPermissionsDialog
          open={addPermissionsDialog.open}
          onOpenChange={(open) => setAddPermissionsDialog({
            open,
            apiId: null,
            apiName: null,
            existingPermissionIds: []
          })}
          clientId={clientId}
          apiId={addPermissionsDialog.apiId}
          apiName={addPermissionsDialog.apiName || ""}
          existingPermissionIds={addPermissionsDialog.existingPermissionIds}
        />
      )}
    </>
  )
}


