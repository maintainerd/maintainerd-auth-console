import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Shield, User, Key } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailLayout } from "@/components/details"
import { useUser } from "@/hooks/useUsers"
import { UserHeader, UserOverview, UserRoles, UserIdentities, UserProfiles } from "./components"

const TABS = [
  { value: "overview", label: "Overview", icon: User },
  { value: "profiles", label: "Profiles", icon: User },
  { value: "roles", label: "Roles", icon: Shield },
  { value: "identities", label: "Identities", icon: Key },
] as const

export default function UserDetailsPage() {
  const { tenantId, userId } = useParams<{ tenantId: string; userId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = searchParams.get("tab") || "overview"
  const handleTabChange = (tab: string) => setSearchParams({ tab })

  const { data: user, isLoading, isError } = useUser(userId || "")

  return (
    <DetailLayout
      backLabel="Back to Users"
      onBack={() => navigate(`/${tenantId}/users`)}
      isLoading={isLoading}
      isError={isError || !user}
      notFoundTitle="User not found"
      notFoundDescription="The user you're looking for doesn't exist or may have been removed."
    >
      <UserHeader user={user!} tenantId={tenantId!} userId={userId!} />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          {TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="gap-2">
              <Icon className="size-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <UserOverview user={user!} />
        </TabsContent>
        <TabsContent value="profiles" className="mt-4">
          <UserProfiles userId={userId!} />
        </TabsContent>
        <TabsContent value="roles" className="mt-4">
          <UserRoles userId={userId!} />
        </TabsContent>
        <TabsContent value="identities" className="mt-4">
          <UserIdentities userId={userId!} />
        </TabsContent>
      </Tabs>
    </DetailLayout>
  )
}
