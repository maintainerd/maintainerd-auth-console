import { Server, FileText } from "lucide-react"
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
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
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

      {/* Tab Content */}
      <div className="space-y-6">
        <ServiceApisTab tenantId={tenantId} serviceId={serviceId} />
        <ServicePoliciesTab serviceId={serviceId} />
      </div>
    </Tabs>
  )
}

