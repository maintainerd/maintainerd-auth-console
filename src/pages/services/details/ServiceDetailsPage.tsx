import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Server, FileText } from "lucide-react"
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailTabs } from "@/components/details/DetailTabs"
import { DetailLayout } from "@/components/details"
import { useService } from "@/hooks/useServices"
import { ServiceHeader, ServiceApisTab, ServicePoliciesTab } from "./components"

const TABS = [
  { value: "apis", label: "APIs", icon: Server },
  { value: "policies", label: "Policies", icon: FileText },
] as const

export default function ServiceDetailsPage() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = searchParams.get("tab") || "apis"
  const handleTabChange = (tab: string) => setSearchParams({ tab })

  const { data: service, isLoading, isError } = useService(serviceId || "")

  return (
    <DetailLayout
      backLabel="Back to Services"
      onBack={() => navigate(`/services`)}
      isLoading={isLoading}
      isError={isError || !service}
      notFoundTitle="Service not found"
      notFoundDescription="The service you're looking for doesn't exist or may have been removed."
    >
      <ServiceHeader service={service!} serviceId={serviceId!} />

      <DetailTabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          {TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="gap-2">
              <Icon className="size-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="apis">
          <ServiceApisTab serviceId={serviceId!} />
        </TabsContent>
        <TabsContent value="policies">
          <ServicePoliciesTab serviceId={serviceId!} />
        </TabsContent>
      </DetailTabs>
    </DetailLayout>
  )
}
