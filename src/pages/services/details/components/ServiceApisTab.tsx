import { useNavigate } from "react-router-dom"
import { Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TabsContent } from "@/components/ui/tabs"
import { InformationCard } from "@/components/card"

interface ServiceApisTabProps {
  tenantId: string
}

export function ServiceApisTab({ tenantId }: ServiceApisTabProps) {
  const navigate = useNavigate()

  return (
    <TabsContent value="apis" className="space-y-6">
      <InformationCard
        title="Service APIs"
        description="Manage APIs and their permissions for this service"
        icon={Server}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">User Management API</h4>
              <p className="text-sm text-muted-foreground">CRUD operations for user management</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">12 endpoints</Badge>
              <Badge variant="outline">8 permissions</Badge>
            </div>
          </div>
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Authentication API</h4>
              <p className="text-sm text-muted-foreground">Login, logout, and token management</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">8 endpoints</Badge>
              <Badge variant="outline">5 permissions</Badge>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/c/${tenantId}/apis`)}
            >
              View All APIs
            </Button>
          </div>
        </div>
      </InformationCard>
    </TabsContent>
  )
}

