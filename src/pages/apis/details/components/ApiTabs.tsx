import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiPermissionsTab } from "./ApiPermissionsTab"

interface ApiTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  api: {
    name: string
    displayName: string
  }
  tenantId: string
  apiId: string
}

export function ApiTabs({ activeTab, setActiveTab, api, tenantId, apiId }: ApiTabsProps) {
  const navigate = useNavigate()

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => navigate(`/${tenantId}/permissions/create?apiId=${apiId}`)}
          >
            <Plus className="h-4 w-4" />
            Add Permission
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        <ApiPermissionsTab tenantId={tenantId} apiId={apiId} />
      </div>
    </Tabs>
  )
}

