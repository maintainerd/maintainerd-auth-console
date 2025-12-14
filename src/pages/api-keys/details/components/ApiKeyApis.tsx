import { useState } from "react"
import { Server, Search, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InformationCard } from "@/components/card"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { useApiKeyApis, useRemoveApiKeyApi, useRemoveApiKeyApiPermission } from "@/hooks/useApiKeys"
import { useToast } from "@/hooks/useToast"
import { AddApiKeyApiDialog } from "./AddApiKeyApiDialog"
import { AddApiKeyApiPermissionsDialog } from "./AddApiKeyApiPermissionsDialog"
import { ApiKeyApiItem } from "./ApiKeyApiItem"
import type { ApiKeyApiItemType } from "@/services/api/api-key/types"

interface ApiKeyApisProps {
  apiKeyId: string
}

export function ApiKeyApis({ apiKeyId }: ApiKeyApisProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedApis, setExpandedApis] = useState<Set<string>>(new Set())
  const [addApiDialog, setAddApiDialog] = useState(false)
  const [addPermissionsDialog, setAddPermissionsDialog] = useState<{
    open: boolean
    apiId: string
    apiName: string
    existingPermissionIds: string[]
  }>({
    open: false,
    apiId: "",
    apiName: "",
    existingPermissionIds: []
  })
  const [deleteApiDialog, setDeleteApiDialog] = useState<{ open: boolean; api: ApiKeyApiItemType | null }>({
    open: false,
    api: null
  })
  const [deletePermissionDialog, setDeletePermissionDialog] = useState<{
    open: boolean
    apiId: string
    permissionId: string
    permissionName: string
  }>({
    open: false,
    apiId: "",
    permissionId: "",
    permissionName: ""
  })

  const { data, isLoading, error } = useApiKeyApis(apiKeyId)
  const removeApiMutation = useRemoveApiKeyApi()
  const removePermissionMutation = useRemoveApiKeyApiPermission()
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
        apiKeyId,
        apiId: deleteApiDialog.api.api_id
      })
      showSuccess("API removed from API key successfully")
      setDeleteApiDialog({ open: false, api: null })
    } catch (error) {
      showError(error)
    }
  }

  const handleRemovePermission = async () => {
    if (!deletePermissionDialog.apiId || !deletePermissionDialog.permissionId) return

    try {
      await removePermissionMutation.mutateAsync({
        apiKeyId,
        apiId: deletePermissionDialog.apiId,
        permissionId: deletePermissionDialog.permissionId
      })
      showSuccess("Permission removed from API key API successfully")
      setDeletePermissionDialog({ open: false, apiId: null, permissionId: null, permissionName: null })
    } catch (error) {
      showError(error)
    }
  }

  // Filter APIs based on search query
  const filteredApis = data?.rows?.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <>
      <InformationCard
        title="API Key APIs"
        description="Manage APIs and their permissions for this API key"
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
            <Button size="sm" className="gap-2" onClick={() => setAddApiDialog(true)}>
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
                {searchQuery ? "No APIs found matching your search" : "No APIs assigned to this API key"}
              </div>
            )}

            {filteredApis.length > 0 && (
              <div className="space-y-2">
                {filteredApis.map((api) => (
                  <ApiKeyApiItem
                    key={api.api_id}
                    apiKeyId={apiKeyId}
                    api={api}
                    isExpanded={expandedApis.has(api.api_id)}
                    onToggleExpand={() => toggleApiExpanded(api.api_id)}
                    onDelete={() => setDeleteApiDialog({ open: true, api })}
                    onAddPermissions={(apiId, apiName, existingPermissionIds) => {
                      setAddPermissionsDialog({
                        open: true,
                        apiId,
                        apiName,
                        existingPermissionIds
                      })
                    }}
                    onDeletePermission={(apiId, permissionId, permissionName) => {
                      setDeletePermissionDialog({
                        open: true,
                        apiId,
                        permissionId,
                        permissionName
                      })
                    }}
                  />
                ))}
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
        title="Remove API from API Key"
        description="This action will remove the API and all its permissions from this API key."
        confirmationText="This will remove the API from this API key. The API itself will not be deleted."
        itemName={deleteApiDialog.api?.display_name || ""}
        isDeleting={removeApiMutation.isPending}
      />

      {/* Delete Permission Dialog */}
      <DeleteConfirmationDialog
        open={deletePermissionDialog.open}
        onOpenChange={(open) => setDeletePermissionDialog({ open, apiId: "", permissionId: "", permissionName: "" })}
        onConfirm={handleRemovePermission}
        title="Remove Permission from API Key API"
        description="This action will remove the permission from this API key API."
        confirmationText="This will remove the permission from this API key API. The permission itself will not be deleted."
        itemName={deletePermissionDialog.permissionName || ""}
        isDeleting={removePermissionMutation.isPending}
      />

      {/* Add API Dialog */}
      <AddApiKeyApiDialog
        open={addApiDialog}
        onOpenChange={setAddApiDialog}
        apiKeyId={apiKeyId}
      />

      {/* Add Permissions Dialog */}
      {addPermissionsDialog.apiId && (
        <AddApiKeyApiPermissionsDialog
          open={addPermissionsDialog.open}
          onOpenChange={(open) => setAddPermissionsDialog({
            open,
            apiId: "",
            apiName: "",
            existingPermissionIds: []
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


