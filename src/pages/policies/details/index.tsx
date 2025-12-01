import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DetailsContainer } from "@/components/container"
import { usePolicy } from "@/hooks/usePolicies"
import { PolicyHeader, PolicyInformation, PolicyTabs } from "./components"
import { getStatusColor, getStatusText } from "./utils"

export default function PolicyDetailsPage() {
  const { tenantId, policyId } = useParams<{ tenantId: string; policyId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("statements")

  // Fetch policy from API
  const { data: policyData, isLoading, isError } = usePolicy(policyId || '')

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            Fetching policy details
          </p>
        </div>
      </div>
    )
  }

  // Error or not found state
  if (isError || !policyData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Policy Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The policy you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/${tenantId}/policies`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Policies
        </Button>
      </div>
    )
  }

  // Map API response to component data
  const policy = {
    policy_id: policyData.policy_id,
    name: policyData.name,
    description: policyData.description,
    version: policyData.version,
    status: policyData.status,
    is_default: policyData.is_default,
    is_system: policyData.is_system,
    created_at: policyData.created_at,
    updated_at: policyData.updated_at,
    document: policyData.document,
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tenantId}/policies`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Policies
          </Button>
        </div>

        {/* Header */}
        <PolicyHeader
          policy={policy}
          tenantId={tenantId!}
          policyId={policyId!}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />

        {/* Policy Information */}
        <PolicyInformation policy={policy} />

        {/* Tabs */}
        <PolicyTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          statements={policy.document.statement}
          tenantId={tenantId!}
          policyId={policyId!}
        />
      </div>
    </DetailsContainer>
  )
}
