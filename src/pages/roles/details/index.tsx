import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DetailsContainer } from "@/components/container"
import { useRole } from "@/hooks/useRoles"
import { RoleHeader, RoleInformation, RoleTabs } from "./components"
import { getStatusColor, getStatusText } from "./utils"

export default function RoleDetailsPage() {
  const { tenantId, roleId } = useParams<{ tenantId: string; roleId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("permissions")

  // Fetch Role from API
  const { data: roleData, isLoading, isError } = useRole(roleId || '')

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            Fetching role details
          </p>
        </div>
      </div>
    )
  }

  // Error or not found state
  if (isError || !roleData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Role Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The role you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/${tenantId}/roles`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Roles
        </Button>
      </div>
    )
  }

  // Map Role response to component data
  const role = {
    id: roleData.role_id,
    name: roleData.name,
    description: roleData.description,
    status: roleData.status,
    is_default: roleData.is_default,
    is_system: roleData.is_system,
    createdAt: roleData.created_at,
    updatedAt: roleData.updated_at,
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tenantId}/roles`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Roles
          </Button>
        </div>

        {/* Header */}
        <RoleHeader
          role={role}
          tenantId={tenantId!}
          roleId={roleId!}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />

        {/* Role Information */}
        <RoleInformation role={role} />

        {/* Tabs */}
        <RoleTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          roleId={roleId!}
        />
      </div>
    </DetailsContainer>
  )
}
