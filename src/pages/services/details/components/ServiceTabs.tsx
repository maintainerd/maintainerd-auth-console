import { useNavigate } from "react-router-dom"
import { Server, FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ServiceApisTab } from "./ServiceApisTab"
import { ServicePoliciesTab } from "./ServicePoliciesTab"

interface ServiceTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  service: {
    apiCount: number
    policyCount: number
  }
  tenantId: string
  serviceId: string
}

export function ServiceTabs({ activeTab, setActiveTab, service, tenantId, serviceId }: ServiceTabsProps) {
  const navigate = useNavigate()

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="apis" className="gap-2">
            <Server className="h-4 w-4" />
            APIs ({service.apiCount})
          </TabsTrigger>
          <TabsTrigger value="policies" className="gap-2">
            <FileText className="h-4 w-4" />
            Policies ({service.policyCount})
          </TabsTrigger>
        </TabsList>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => navigate(`/c/${tenantId}/apis/create?serviceId=${serviceId}`)}
          >
            <Plus className="h-4 w-4" />
            Add API
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => navigate(`/c/${tenantId}/policies/create?serviceId=${serviceId}`)}
          >
            <Plus className="h-4 w-4" />
            Add Policy
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        <ServiceApisTab tenantId={tenantId} serviceId={serviceId} />
        <ServicePoliciesTab tenantId={tenantId} />
      </div>
    </Tabs>
  )
}

