import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DetailsContainer } from "@/components/container"
import { useService } from "@/hooks/useServices"
import { ServiceHeader, ServiceInformation, ServiceTabs } from "./components"
import { getStatusColor, getStatusText } from "./utils"

export default function ServiceDetailsPage() {
  const { tenantId, serviceId } = useParams<{ tenantId: string; serviceId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("apis")

  // Fetch service from API
  const { data: serviceData, isLoading, isError } = useService(serviceId || '')

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            Fetching service details
          </p>
        </div>
      </div>
    )
  }

  // Error or not found state
  if (isError || !serviceData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Service Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The service you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/c/${tenantId}/services`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Button>
      </div>
    )
  }

  // Map API response to component data (using dummy data for fields not yet available)
  const service = {
    id: serviceData.service_id,
    name: serviceData.name,
    displayName: serviceData.display_name,
    description: serviceData.description,
    version: serviceData.version,
    status: serviceData.status,
    isPublic: serviceData.is_public,
    isDefault: serviceData.is_default,
    isSystem: serviceData.is_system,
    apiCount: serviceData.api_count,
    policyCount: serviceData.policy_count,
    createdAt: serviceData.created_at,
    updatedAt: serviceData.updated_at,
    // Dummy data for fields not yet available from API
    identifier: 'SVC' + serviceData.service_id.substring(0, 6).toUpperCase(),
    createdBy: 'System Admin',
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/c/${tenantId}/services`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Button>
        </div>

        {/* Header */}
        <ServiceHeader
          service={service}
          tenantId={tenantId!}
          serviceId={serviceId!}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />

        {/* Service Information */}
        <ServiceInformation service={service} />

        {/* Tabs with Action Buttons */}
        <ServiceTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          service={service}
          tenantId={tenantId!}
          serviceId={serviceId!}
        />
      </div>
    </DetailsContainer>
  )
}
