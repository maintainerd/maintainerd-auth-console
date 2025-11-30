import { useNavigate } from "react-router-dom"
import { Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TabsContent } from "@/components/ui/tabs"
import { InformationCard } from "@/components/card"
import { SystemBadge } from "@/components/badges"
import { useServiceApis } from "../hooks/useServiceApis"

interface ServiceApisTabProps {
  tenantId: string
  serviceId: string
}

export function ServiceApisTab({ tenantId, serviceId }: ServiceApisTabProps) {
  const navigate = useNavigate()
  const { data, isLoading, error } = useServiceApis({ serviceId, limit: 5 })

  return (
    <TabsContent value="apis" className="space-y-6">
      <InformationCard
        title="Service APIs"
        description="Manage APIs and their permissions for this service"
        icon={Server}
      >
        <div className="space-y-4">
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

          {data && data.rows.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No APIs found for this service
            </div>
          )}

          {data && data.rows.length > 0 && (
            <>
              {data.rows.map((api) => (
                <div
                  key={api.api_id}
                  className="flex justify-between items-center p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => navigate(`/c/${tenantId}/apis/${api.api_id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{api.display_name}</h4>
                      <SystemBadge isSystem={api.is_default} />
                    </div>
                    <p className="text-sm text-muted-foreground">{api.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>Name: <span className="font-mono">{api.name}</span></span>
                      <span>•</span>
                      <span>ID: <span className="font-mono">{api.identifier}</span></span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={api.status === "active" ? "secondary" : "outline"} className="capitalize">
                      {api.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {data.total > 5 && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/c/${tenantId}/apis?service_id=${serviceId}`)}
                  >
                    View All {data.total} APIs
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </InformationCard>
    </TabsContent>
  )
}

