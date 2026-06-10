import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Settings, Shield, Link2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailLayout } from "@/components/details"
import { useSignupFlow } from "@/hooks/useSignupFlows"
import { SignupFlowHeader } from "./components/SignupFlowHeader"
import { SignupFlowConfig } from "./components/SignupFlowConfig"
import { SignupFlowRoles } from "./components/SignupFlowRoles"
import { SignupFlowCallbackURIs } from "./components/SignupFlowCallbackURIs"

const TABS = [
  { value: "config", label: "Config", icon: Settings },
  { value: "roles", label: "Roles", icon: Shield },
  { value: "callback_uris", label: "Callback URIs", icon: Link2 },
] as const

export default function SignupFlowDetailsPage() {
  const { tenantId, signupFlowId } = useParams<{ tenantId: string; signupFlowId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = searchParams.get("tab") || "config"
  const handleTabChange = (tab: string) => setSearchParams({ tab })

  const { data: signupFlow, isLoading, isError } = useSignupFlow(signupFlowId || "")

  return (
    <DetailLayout
      backLabel="Back to Auth Flows"
      onBack={() => navigate(`/${tenantId}/auth-flows`)}
      isLoading={isLoading}
      isError={isError || !signupFlow}
      notFoundTitle="Auth flow not found"
      notFoundDescription="The auth flow you're looking for doesn't exist or may have been removed."
    >
      {signupFlow && (
        <>
          <SignupFlowHeader signupFlow={signupFlow} tenantId={tenantId!} signupFlowId={signupFlowId!} />

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
              <SignupFlowConfig signupFlowId={signupFlowId!} />
            </TabsContent>
            <TabsContent value="roles" className="mt-4">
              <SignupFlowRoles signupFlowId={signupFlowId!} />
            </TabsContent>
            <TabsContent value="callback_uris" className="mt-4">
              <SignupFlowCallbackURIs signupFlowId={signupFlowId!} clientId={signupFlow.client_id} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </DetailLayout>
  )
}
