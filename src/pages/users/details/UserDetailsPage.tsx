import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Shield, User, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailsContainer } from "@/components/container"
import { useUser } from "@/hooks/useUsers"
import { UserHeader, UserInformation, UserOverview, UserRoles, UserIdentities, UserProfiles } from "./components"

export default function UserDetailsPage() {
  const { tenantId, userId } = useParams<{ tenantId: string; userId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Get active tab from URL or default to 'overview'
  const activeTab = searchParams.get('tab') || 'overview'

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab })
  }

  // Fetch user from API
  const { data: userData, isLoading, isError } = useUser(userId || '')

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            Fetching user details
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (isError || !userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-semibold">User Not Found</h2>
        <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(`/${tenantId}/users`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </div>
    )
  }

  const user = userData

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tenantId}/users`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
        </div>

        {/* Header */}
        <UserHeader
          user={user}
          tenantId={tenantId!}
          userId={userId!}
        />

        {/* User Information */}
        <UserInformation user={user} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="profiles" className="gap-2">
              <User className="h-4 w-4" />
              Profiles
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-2">
              <Shield className="h-4 w-4" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="identities" className="gap-2">
              <Key className="h-4 w-4" />
              Identities
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <UserOverview user={user} />
          </TabsContent>

          {/* Profiles Tab */}
          <TabsContent value="profiles" className="mt-6">
            <UserProfiles userId={userId!} />
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles" className="mt-6">
            <UserRoles userId={userId!} />
          </TabsContent>

          {/* Identities Tab */}
          <TabsContent value="identities" className="mt-6">
            <UserIdentities userId={userId!} />
          </TabsContent>
        </Tabs>
      </div>
    </DetailsContainer>
  )
}
