import { useParams, useNavigate } from "react-router-dom"
import { Users } from "lucide-react"
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailTabs } from "@/components/details/DetailTabs"
import { DetailLayout } from "@/components/details"
import { useTenantById } from "@/hooks/useTenants"
import { TenantHeader, TenantMembers } from "./components"

export default function TenantDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: tenant, isLoading, isError } = useTenantById(id)

  return (
    <DetailLayout
      backLabel="Back to Tenants"
      onBack={() => navigate(`/tenants`)}
      isLoading={isLoading}
      isError={isError || !tenant}
      notFoundTitle="Tenant not found"
      notFoundDescription="The tenant you're looking for doesn't exist or may have been removed."
    >
      {tenant && (
        <>
          <TenantHeader tenant={tenant} />

          <DetailTabs defaultValue="members">
            <TabsList className="h-auto w-full flex-wrap justify-start gap-1 p-1 md:w-fit">
              <TabsTrigger value="members" className="h-8 flex-none gap-2 px-3">
                <Users className="size-4" />
                Members
              </TabsTrigger>
            </TabsList>

            <TabsContent value="members">
              <TenantMembers isSystemTenant={tenant.is_system} />
            </TabsContent>
          </DetailTabs>
        </>
      )}
    </DetailLayout>
  )
}
