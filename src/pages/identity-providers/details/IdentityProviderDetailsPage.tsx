import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Settings, Braces, AppWindow } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailLayout } from "@/components/details"
import { useIdentityProvider } from "@/hooks/useIdentityProviders"
import {
  IdentityProviderHeader,
  IdentityProviderInformationTab,
  IdentityProviderMetadataTab,
  IdentityProviderClients,
} from "./components"

const TABS = [
  { value: "information", label: "Provider Information", icon: Settings },
  { value: "clients", label: "Clients", icon: AppWindow },
  { value: "metadata", label: "Metadata", icon: Braces },
] as const

export default function IdentityProviderDetailsPage() {
  const { tenantId, providerId } = useParams<{ tenantId: string; providerId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = searchParams.get("tab") || "information"
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

            <TabsContent value="information" className="mt-4">
              <IdentityProviderInformationTab provider={provider} />
            </TabsContent>

            <TabsContent value="clients" className="mt-4">
              <IdentityProviderClients
                providerId={providerId!}
                providerName={provider.display_name}
              />
            </TabsContent>

            <TabsContent value="metadata" className="mt-4">
              <IdentityProviderMetadataTab provider={provider} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </DetailLayout>
  )
}
