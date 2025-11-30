import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiPermissionsTab } from "./ApiPermissionsTab"

interface ApiTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  tenantId: string
  apiId: string
}

export function ApiTabs({ activeTab, setActiveTab, tenantId, apiId }: ApiTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
      </TabsList>

      {/* Tab Content */}
      <div className="space-y-6">
        <ApiPermissionsTab tenantId={tenantId} apiId={apiId} />
      </div>
    </Tabs>
  )
}

