import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Key } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailLayout } from "@/components/details"
import { useApi } from "@/hooks/useApis"
import { ApiHeader, ApiPermissionsTab } from "./components"

const TABS = [
  { value: "permissions", label: "Permissions", icon: Key },
] as const

export default function ApiDetailsPage() {
  const { tenantId, apiId } = useParams<{ tenantId: string; apiId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = searchParams.get("tab") || "permissions"
  const handleTabChange = (tab: string) => setSearchParams({ tab })

  const { data: api, isLoading, isError } = useApi(apiId || "")

  return (
    <DetailLayout
      backLabel="Back to APIs"
      onBack={() => navigate(`/${tenantId}/apis`)}
      isLoading={isLoading}
      isError={isError || !api}
      notFoundTitle="API not found"
      notFoundDescription="The API you're looking for doesn't exist or may have been removed."
    >
      <ApiHeader api={api!} tenantId={tenantId!} apiId={apiId!} />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          {TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="gap-2">
              <Icon className="size-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="permissions" className="mt-4">
          <ApiPermissionsTab apiId={apiId!} />
        </TabsContent>
      </Tabs>
    </DetailLayout>
  )
}
