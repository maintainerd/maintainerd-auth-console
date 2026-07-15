import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Settings, Shield } from "lucide-react"
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailTabs } from "@/components/details/DetailTabs"
import { DetailLayout } from "@/components/details"
import { useRegistrationFlow } from "@/hooks/useRegistrationFlows"
import { RegistrationFlowHeader } from "./components/RegistrationFlowHeader"
import { RegistrationFlowConfig } from "./components/RegistrationFlowConfig"
import { RegistrationFlowRoles } from "./components/RegistrationFlowRoles"

const TABS = [
  { value: "config", label: "Config", icon: Settings },
  { value: "roles", label: "Roles", icon: Shield },
] as const

export default function RegistrationFlowDetailsPage() {
  const { registrationFlowId } = useParams<{ registrationFlowId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = searchParams.get("tab") || "config"
  const handleTabChange = (tab: string) => setSearchParams({ tab })

  const { data: registrationFlow, isLoading, isError } = useRegistrationFlow(registrationFlowId || "")

  return (
    <DetailLayout
      backLabel="Back to Registration"
      onBack={() => navigate(`/registration-flows`)}
      isLoading={isLoading}
      isError={isError || !registrationFlow}
      notFoundTitle="Registration flow not found"
      notFoundDescription="The registration flow you're looking for doesn't exist or may have been removed."
    >
      <RegistrationFlowHeader registrationFlow={registrationFlow!} registrationFlowId={registrationFlowId!} />

      <DetailTabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          {TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="gap-2">
              <Icon className="size-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="config">
          <RegistrationFlowConfig registrationFlowId={registrationFlowId!} />
        </TabsContent>
        <TabsContent value="roles">
          <RegistrationFlowRoles registrationFlowId={registrationFlowId!} />
        </TabsContent>
      </DetailTabs>
    </DetailLayout>
  )
}
