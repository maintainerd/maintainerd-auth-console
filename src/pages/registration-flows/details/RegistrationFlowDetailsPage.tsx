import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom"
import { Settings, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  const { tenantId, registrationFlowId } = useParams<{ tenantId: string; registrationFlowId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const navState = (location.state || {}) as { from?: string; backLabel?: string }
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = searchParams.get("tab") || "config"
  const handleTabChange = (tab: string) => setSearchParams({ tab })

  const { data: registrationFlow, isLoading, isError } = useRegistrationFlow(registrationFlowId || "")

  return (
    <DetailLayout
      backLabel={navState.backLabel ?? "Back to Registration Flows"}
      onBack={() => navigate(navState.from ?? `/${tenantId}/registration-flows`)}
      isLoading={isLoading}
      isError={isError || !registrationFlow}
      notFoundTitle="Registration flow not found"
      notFoundDescription="The registration flow you're looking for doesn't exist or may have been removed."
    >
      {registrationFlow && (
        <>
          <RegistrationFlowHeader registrationFlow={registrationFlow} tenantId={tenantId!} registrationFlowId={registrationFlowId!} />

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              {TABS.map(({ value, label, icon: Icon }) => (
                <TabsTrigger key={value} value={value} className="gap-2">
                  <Icon className="size-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="config" className="mt-4">
              <RegistrationFlowConfig registrationFlowId={registrationFlowId!} />
            </TabsContent>
            <TabsContent value="roles" className="mt-4">
              <RegistrationFlowRoles registrationFlowId={registrationFlowId!} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </DetailLayout>
  )
}
