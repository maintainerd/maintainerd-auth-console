import { Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IdentityProviderConfigTab } from "./IdentityProviderConfigTab"

interface IdentityProviderTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  provider: {
    provider: string
    is_system: boolean
    config: Record<string, any>
  }
}

export function IdentityProviderTabs({ activeTab, setActiveTab, provider }: IdentityProviderTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="configuration" className="gap-2">
          <Settings className="h-4 w-4" />
          Configuration
        </TabsTrigger>
      </TabsList>

      <TabsContent value="configuration" className="mt-6">
        <IdentityProviderConfigTab provider={provider} />
      </TabsContent>
    </Tabs>
  )
}

