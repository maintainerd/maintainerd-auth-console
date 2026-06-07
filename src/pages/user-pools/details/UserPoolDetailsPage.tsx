import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DetailsContainer } from "@/components/container"
import { useUserPool } from "@/hooks/useUserPools"
import { UserPoolHeader, UserPoolInformation } from "./components"

export default function UserPoolDetailsPage() {
  const { tenantId, userPoolId } = useParams<{ tenantId: string; userPoolId: string }>()
  const navigate = useNavigate()

  const { data: userPoolData, isLoading, isError } = useUserPool(userPoolId || "")

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">Fetching user pool details</p>
        </div>
      </div>
    )
  }

  if (isError || !userPoolData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">User Pool Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The user pool you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/${tenantId}/user-pools`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to User Pools
        </Button>
      </div>
    )
  }

  const userPool = {
    name: userPoolData.name,
    display_name: userPoolData.display_name,
    identifier: userPoolData.identifier,
    status: userPoolData.status,
    is_system: userPoolData.is_system,
    createdAt: userPoolData.created_at,
    updatedAt: userPoolData.updated_at,
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tenantId}/user-pools`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to User Pools
          </Button>
        </div>

        <UserPoolHeader
          userPool={userPool}
          tenantId={tenantId!}
          userPoolId={userPoolId!}
        />

        <UserPoolInformation userPool={userPool} />
      </div>
    </DetailsContainer>
  )
}
