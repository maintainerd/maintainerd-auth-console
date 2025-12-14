import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Settings, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailsContainer } from "@/components/container"
import { useApiKey } from "@/hooks/useApiKeys"
import { ApiKeyHeader, ApiKeyInformation, ApiKeyConfig, ApiKeyApis } from "./components"
import { getStatusColor, getStatusText } from "./utils"

export default function ApiKeyDetailsPage() {
  const { tenantId, id } = useParams<{ tenantId: string; id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Get active tab from URL or default to 'apis'
  const activeTab = searchParams.get('tab') || 'apis'

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab })
  }

  // Fetch API key from API
  const { data: apiKeyData, isLoading, isError } = useApiKey(id || '')

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            Fetching API key details
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (isError || !apiKeyData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-semibold">API Key Not Found</h2>
        <p className="text-muted-foreground">The API key you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(`/${tenantId}/api-keys`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to API Keys
        </Button>
      </div>
    )
  }

  const apiKey = apiKeyData


  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tenantId}/api-keys`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to API Keys
          </Button>
        </div>

        {/* Header */}
        <ApiKeyHeader
          apiKey={apiKey}
          tenantId={tenantId!}
          apiKeyId={id!}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />

        {/* API Key Information */}
        <ApiKeyInformation apiKey={apiKey} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="apis" className="gap-2">
              <Server className="h-4 w-4" />
              APIs
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Settings className="h-4 w-4" />
              Config
            </TabsTrigger>
          </TabsList>

          {/* APIs Tab */}
          <TabsContent value="apis" className="mt-6">
            <ApiKeyApis apiKeyId={id!} />
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config" className="mt-6">
            <ApiKeyConfig apiKeyId={id!} />
          </TabsContent>
        </Tabs>
      </div>
    </DetailsContainer>
  )
}
