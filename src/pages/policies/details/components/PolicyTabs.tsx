import { FileText, Server } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PolicyStatementsTab } from "./PolicyStatementsTab"
import { PolicyServicesTab } from "./PolicyServicesTab"
import type { PolicyStatementType } from "@/services/api/policy/types"

interface PolicyTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  statements: PolicyStatementType[]
  tenantId: string
  policyId: string
}

export function PolicyTabs({ activeTab, setActiveTab, statements }: PolicyTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="statements" className="gap-2">
            <FileText className="h-4 w-4" />
            Statements ({statements.length})
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2">
            <Server className="h-4 w-4" />
            Applied Services
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        <TabsContent value="statements">
          <PolicyStatementsTab statements={statements} />
        </TabsContent>
        <PolicyServicesTab />
      </div>
    </Tabs>
  )
}

