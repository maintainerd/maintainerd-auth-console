import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Settings, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailsContainer } from "@/components/container"
import { useSignupFlow } from "@/hooks/useSignupFlows"
import { SignupFlowHeader } from "./components/SignupFlowHeader"
import { SignupFlowInformation } from "./components/SignupFlowInformation"
import { SignupFlowConfig } from "./components/SignupFlowConfig"
import { SignupFlowRoles } from "./components/SignupFlowRoles"

export default function SignupFlowDetailsPage() {
  const { tenantId, signupFlowId } = useParams<{ tenantId: string; signupFlowId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Get active tab from URL or default to 'config'
  const activeTab = searchParams.get('tab') || 'config'

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab })
  }

  // Fetch signup flow from API
  const { data: signupFlowData, isLoading, isError } = useSignupFlow(signupFlowId || '')

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            Fetching sign up flow details
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (isError || !signupFlowData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-semibold">Sign Up Flow Not Found</h2>
        <p className="text-muted-foreground">The sign up flow you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(`/${tenantId}/signup-flows`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign Up Flows
        </Button>
      </div>
    )
  }

  const signupFlow = signupFlowData

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tenantId}/signup-flows`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign Up Flows
          </Button>
        </div>

        {/* Header */}
        <SignupFlowHeader
          signupFlow={signupFlow}
          tenantId={tenantId!}
          signupFlowId={signupFlowId!}
        />

        {/* Signup Flow Information */}
        <SignupFlowInformation signupFlow={signupFlow} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="config" className="gap-2">
              <Settings className="h-4 w-4" />
              Config
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-2">
              <Shield className="h-4 w-4" />
              Roles
            </TabsTrigger>
          </TabsList>

          {/* Config Tab */}
          <TabsContent value="config" className="mt-6">
            <SignupFlowConfig signupFlowId={signupFlowId!} />
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles" className="mt-6">
            <SignupFlowRoles signupFlowId={signupFlowId!} />
          </TabsContent>
        </Tabs>
      </div>
    </DetailsContainer>
  )
}
