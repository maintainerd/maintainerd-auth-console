import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Key, Settings, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailsContainer } from "@/components/container"
import { useClient } from "@/hooks/useClients"
import { ClientHeader, ClientInformation, ClientCredentials, ClientConfig, ClientApis } from "./components"
import { getStatusColor, getStatusText } from "./utils"

export default function ClientDetailsPage() {
  const { tenantId, clientId } = useParams<{ tenantId: string; clientId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Get active tab from URL or default to 'credentials'
  const activeTab = searchParams.get('tab') || 'credentials'

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab })
  }

  // Fetch client from API
  const { data: clientData, isLoading, isError } = useClient(clientId || '')

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            Fetching client details
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (isError || !clientData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-semibold">Client Not Found</h2>
        <p className="text-muted-foreground">The client you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(`/${tenantId}/clients`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clients
        </Button>
      </div>
    )
  }

  const client = clientData

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tenantId}/clients`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </Button>
        </div>

        {/* Header */}
        <ClientHeader
          client={client}
          tenantId={tenantId!}
          clientId={clientId!}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />

        {/* Client Information */}
        <ClientInformation client={client} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="credentials" className="gap-2">
              <Key className="h-4 w-4" />
              Credentials
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Settings className="h-4 w-4" />
              Config
            </TabsTrigger>
            <TabsTrigger value="apis" className="gap-2">
              <Server className="h-4 w-4" />
              APIs
            </TabsTrigger>
          </TabsList>

          {/* Credentials Tab */}
          <TabsContent value="credentials" className="mt-6">
            <ClientCredentials clientId={client.client_id} clientType={client.client_type} />
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config" className="mt-6">
            <ClientConfig clientId={clientId!} />
          </TabsContent>

          {/* APIs Tab */}
          <TabsContent value="apis" className="mt-6">
            <ClientApis clientId={clientId!} />
          </TabsContent>
        </Tabs>
      </div>
    </DetailsContainer>
  )
}