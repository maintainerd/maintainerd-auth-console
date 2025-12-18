import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RolePermissionsTab } from "./RolePermissionsTab"

interface RoleTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  roleId: string
}

export function RoleTabs({ activeTab, setActiveTab, roleId }: RoleTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
      </TabsList>

      {/* Tab Content */}
      <div className="space-y-6">
        <RolePermissionsTab roleId={roleId} />
      </div>
    </Tabs>
  )
}
