import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DetailsContainer } from "@/components/container"
import { useApi } from "@/hooks/useApis"
import { ApiHeader, ApiInformation, ApiTabs } from "./components"
import { getStatusColor, getStatusText } from "./utils"

export default function ApiDetailsPage() {
  const { tenantId, apiId } = useParams<{ tenantId: string; apiId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("permissions")

  // Fetch API from API
  const { data: apiData, isLoading, isError } = useApi(apiId || '')

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            Fetching API details
          </p>
        </div>
      </div>
    )
  }

  // Error or not found state
  if (isError || !apiData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">API Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The API you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/${tenantId}/apis`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to APIs
        </Button>
      </div>
    )
  }

  // Map API response to component data
  const api = {
    id: apiData.api_id,
    name: apiData.name,
    displayName: apiData.display_name,
    description: apiData.description,
    apiType: apiData.api_type,
    identifier: apiData.identifier,
    status: apiData.status,
    isDefault: apiData.is_default,
    isSystem: apiData.is_system,
    createdAt: apiData.created_at,
    updatedAt: apiData.updated_at,
    serviceName: apiData.service.display_name,
    serviceId: apiData.service.service_id,
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tenantId}/apis`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to APIs
          </Button>
        </div>

        {/* Header */}
        <ApiHeader
          api={api}
          tenantId={tenantId!}
          apiId={apiId!}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />

        {/* API Information */}
        <ApiInformation api={api} />

        {/* Tabs with Action Buttons */}
        <ApiTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          api={api}
          tenantId={tenantId!}
          apiId={apiId!}
        />
      </div>
    </DetailsContainer>
  )
}
