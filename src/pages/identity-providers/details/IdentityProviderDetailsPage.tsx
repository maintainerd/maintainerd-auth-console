import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DetailsContainer } from "@/components/container"
import { useIdentityProvider } from "@/hooks/useIdentityProviders"
import { IdentityProviderHeader, IdentityProviderInformation, IdentityProviderTabs } from "./components"
import { getStatusColor, getStatusText } from "./utils"

export default function IdentityProviderDetailsPage() {
  const { tenantId, providerId } = useParams<{ tenantId: string; providerId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("configuration")

  // Fetch identity provider from API
  const { data: providerData, isLoading, isError } = useIdentityProvider(providerId || '')

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            Fetching identity provider details
          </p>
        </div>
      </div>
    )
  }

  // Error or not found state
  if (isError || !providerData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Identity Provider Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The identity provider you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/${tenantId}/providers/identity`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Identity Providers
        </Button>
      </div>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tenantId}/providers/identity`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Identity Providers
          </Button>
        </div>

        {/* Header */}
        <IdentityProviderHeader
          provider={providerData}
          tenantId={tenantId!}
          providerId={providerId!}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />

        {/* Provider Information */}
        <IdentityProviderInformation provider={providerData} />

        {/* Tabs */}
        <IdentityProviderTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          provider={providerData}
        />
      </div>
    </DetailsContainer>
  )
}
