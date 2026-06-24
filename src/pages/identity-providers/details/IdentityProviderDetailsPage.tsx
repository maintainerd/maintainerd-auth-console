import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { AppWindow, KeyRound, Settings2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailLayout } from "@/components/details"
import { useIdentityProvider } from "@/hooks/useIdentityProviders"
import {
  IdentityProviderHeader,
  IdentityProviderConnectionTab,
  IdentityProviderConfigurationTab,
  IdentityProviderClients,
} from "./components"

const TABS = [
  { value: "connection", label: "Connection", icon: KeyRound },
  { value: "configuration", label: "Configuration", icon: Settings2 },
  { value: "connected-clients", label: "Connected Clients", icon: AppWindow },
] as const

const TAB_VALUES = new Set(TABS.map((tab) => tab.value))
const LEGACY_TAB_MAP: Record<string, (typeof TABS)[number]["value"]> = {
  information: "connection",
  metadata: "configuration",
  clients: "connected-clients",
}

export default function IdentityProviderDetailsPage() {
  const { tenantId, providerId } = useParams<{ tenantId: string; providerId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const requestedTab = searchParams.get("tab") || ""
  const activeTab = TAB_VALUES.has(requestedTab as (typeof TABS)[number]["value"])
    ? requestedTab
    : LEGACY_TAB_MAP[requestedTab] ?? "connection"
  const handleTabChange = (tab: string) => setSearchParams({ tab })

  const { data: provider, isLoading, isError } = useIdentityProvider(providerId || "")

  return (
    <DetailLayout
      backLabel="Back to Identity Providers"
      onBack={() => navigate(`/${tenantId}/providers/identity`)}
      isLoading={isLoading}
      isError={isError || !provider}
      notFoundTitle="Identity Provider not found"
      notFoundDescription="The identity provider you're looking for doesn't exist or may have been removed."
    >
      {provider && (
        <>
          <IdentityProviderHeader provider={provider} tenantId={tenantId!} providerId={providerId!} />

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              {TABS.map(({ value, label, icon: Icon }) => (
                <TabsTrigger key={value} value={value} className="gap-2">
                  <Icon className="size-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="connection" className="mt-4">
              <IdentityProviderConnectionTab provider={provider} />
            </TabsContent>

            <TabsContent value="configuration" className="mt-4">
              <IdentityProviderConfigurationTab provider={provider} />
            </TabsContent>

            <TabsContent value="connected-clients" className="mt-4">
              <IdentityProviderClients
                providerId={providerId!}
                providerName={provider.display_name}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </DetailLayout>
  )
}
