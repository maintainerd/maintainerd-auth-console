import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Braces, KeyRound, Server } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailLayout } from "@/components/details"
import { useApiKey } from "@/hooks/useApiKeys"
import { ApiKeyHeader, ApiKeyInformation, ApiKeyConfig, ApiKeyApis } from "./components"

const TABS = [
  { value: "overview", label: "Overview", icon: KeyRound },
  { value: "apis", label: "API Permissions", icon: Server },
  { value: "config", label: "Configuration", icon: Braces },
] as const

type ApiKeyDetailsTab = typeof TABS[number]["value"]

const TAB_VALUES = new Set<string>(TABS.map((tab) => tab.value))

export default function ApiKeyDetailsPage() {
  const { tenantId, id } = useParams<{ tenantId: string; id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const requestedTab = searchParams.get("tab")
  const activeTab: ApiKeyDetailsTab = TAB_VALUES.has(requestedTab || "")
    ? requestedTab as ApiKeyDetailsTab
    : "overview"

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab })
  }

  const { data: apiKeyData, isLoading, isError } = useApiKey(id || '')

  return (
    <DetailLayout
      backLabel="Back to API Keys"
      onBack={() => navigate(`/${tenantId}/api-keys`)}
      isLoading={isLoading}
      isError={isError || !apiKeyData}
      notFoundTitle="API key not found"
      notFoundDescription="The API key you're looking for doesn't exist or may have been removed."
    >
      {apiKeyData && (
        <>
          <ApiKeyHeader apiKey={apiKeyData} tenantId={tenantId!} apiKeyId={id!} />

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 p-1 md:w-fit">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="h-8 flex-none gap-2 px-3">
                <Icon className="size-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <ApiKeyInformation apiKey={apiKeyData} />
          </TabsContent>

          <TabsContent value="apis" className="mt-4">
            <ApiKeyApis apiKeyId={id!} />
          </TabsContent>

          <TabsContent value="config" className="mt-4">
            <ApiKeyConfig apiKeyId={id!} />
          </TabsContent>
        </Tabs>
        </>
      )}
    </DetailLayout>
  )
}
