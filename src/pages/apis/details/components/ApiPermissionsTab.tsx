import { useNavigate } from "react-router-dom"
import { Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TabsContent } from "@/components/ui/tabs"
import { InformationCard } from "@/components/card"

interface ApiPermissionsTabProps {
  tenantId: string
  apiId: string
}

export function ApiPermissionsTab({ tenantId, apiId }: ApiPermissionsTabProps) {
  const navigate = useNavigate()

  // TODO: Fetch permissions from API
  const isLoading = false
  const error = null
  const permissions = [] // Mock data for now

  return (
    <TabsContent value="permissions" className="space-y-6">
      <InformationCard
        title="Permissions"
        description="Manage permissions for this API"
        icon={Key}
      >
        <div className="space-y-4">
          {isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading permissions...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-destructive">Failed to load permissions</p>
            </div>
          )}

          {!isLoading && !error && permissions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No permissions found for this API</p>
            </div>
          )}

          {!isLoading && !error && permissions.length > 0 && (
            <>
              {permissions.map((permission: any) => (
                <div
                  key={permission.id}
                  className="flex justify-between items-center p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => navigate(`/${tenantId}/permissions/${permission.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{permission.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{permission.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
              ))}
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/${tenantId}/permissions?api_id=${apiId}`)}
                >
                  View All Permissions
                </Button>
              </div>
            </>
          )}
        </div>
      </InformationCard>
    </TabsContent>
  )
}

