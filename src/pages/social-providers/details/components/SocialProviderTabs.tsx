import { Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SocialProviderConfigTab } from "./SocialProviderConfigTab"

interface SocialProviderTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  provider: {
    provider: string
    config: Record<string, any>
  }
}

export function SocialProviderTabs({ activeTab, setActiveTab, provider }: SocialProviderTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="configuration" className="gap-2">
          <Settings className="h-4 w-4" />
          Configuration
        </TabsTrigger>
      </TabsList>

      <TabsContent value="configuration" className="mt-6">
        <SocialProviderConfigTab provider={provider} />
      </TabsContent>
    </Tabs>
  )
}

