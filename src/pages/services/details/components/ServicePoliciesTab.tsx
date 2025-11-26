import { useNavigate } from "react-router-dom"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TabsContent } from "@/components/ui/tabs"
import { InformationCard } from "@/components/card"

interface ServicePoliciesTabProps {
  tenantId: string
}

export function ServicePoliciesTab({ tenantId }: ServicePoliciesTabProps) {
  const navigate = useNavigate()

  return (
    <TabsContent value="policies" className="space-y-6">
      <InformationCard
        title="Applied Policies"
        description="Policies applied to this service (not owned by this service)"
        icon={FileText}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Rate Limiting Policy</h4>
              <p className="text-sm text-muted-foreground">Limits requests per minute per user</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Active</Badge>
              <Badge variant="outline">Global</Badge>
            </div>
          </div>
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Security Headers Policy</h4>
              <p className="text-sm text-muted-foreground">Enforces security headers on all responses</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Active</Badge>
              <Badge variant="outline">Security</Badge>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/c/${tenantId}/policies`)}
            >
              View All Policies
            </Button>
          </div>
        </div>
      </InformationCard>
    </TabsContent>
  )
}

