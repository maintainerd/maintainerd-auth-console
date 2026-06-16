import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Building2, Settings, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailLayout } from "@/components/details"
import { useTenantById } from "@/hooks/useTenants"
import { TenantHeader, TenantOverview, TenantMembers, TenantSettings } from "./components"

const TABS = [
  { value: "overview", label: "Overview", icon: Building2 },
  { value: "members", label: "Members", icon: Users },
  { value: "settings", label: "Settings", icon: Settings },
] as const

type TenantDetailsTab = (typeof TABS)[number]["value"]

const TAB_VALUES = new Set<string>(TABS.map((tab) => tab.value))

export default function TenantDetailsPage() {
  const { tenantId, id } = useParams<{ tenantId: string; id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const requestedTab = searchParams.get("tab")
  const activeTab: TenantDetailsTab = TAB_VALUES.has(requestedTab || "")
    ? (requestedTab as TenantDetailsTab)
    : "overview"

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab })
  }

  const { data: tenant, isLoading, isError } = useTenantById(id)

  return (
    <DetailLayout
      backLabel="Back to Tenants"
      onBack={() => navigate(`/${tenantId}/tenants`)}
      isLoading={isLoading}
      isError={isError || !tenant}
      notFoundTitle="Tenant not found"
      notFoundDescription="The tenant you're looking for doesn't exist or may have been removed."
    >
      {tenant && (
        <>
          <TenantHeader tenant={tenant} tenantId={tenantId!} />

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
              <TenantOverview tenant={tenant} />
            </TabsContent>

            <TabsContent value="members" className="mt-4">
              <TenantMembers />
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <TenantSettings />
            </TabsContent>
          </Tabs>
        </>
      )}
    </DetailLayout>
  )
}
