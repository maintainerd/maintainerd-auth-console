
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Settings, Users, Shield, Activity, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MOCK_CONTAINERS } from "../constants"
import type { Container } from "../components/ContainerColumns"
import { ContainerOverview } from "./components/ContainerOverview"
import { ContainerUsers } from "./components/ContainerUsers"
import { ContainerSecurity } from "./components/ContainerSecurity"
import { ContainerActivity } from "./components/ContainerActivity"
import { ContainerSettings } from "./components/ContainerSettings"
import { ContainerIntegrations } from "./components/ContainerIntegrations"

export default function ContainerDetailsPage() {
  const { containerId, targetContainerId } = useParams<{ containerId: string; targetContainerId: string }>()
  const navigate = useNavigate()

  const container = MOCK_CONTAINERS.find(c => c.id === targetContainerId)
  
  if (!container) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Container Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The container you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/c/${containerId}/containers`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Containers
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status: Container["status"]) => {
    const statusConfig = {
      active: { label: "Active", className: "bg-green-100 text-green-800 border-green-200" },
      suspended: { label: "Suspended", className: "bg-red-100 text-red-800 border-red-200" },
      inactive: { label: "Inactive", className: "bg-gray-100 text-gray-800 border-gray-200" },
    }
    
    const config = statusConfig[status]
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/c/${containerId}/containers`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Containers
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{container.name}</h1>
              {container.isSystem && (
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  System
                </Badge>
              )}
              {getStatusBadge(container.status)}
            </div>
            <p className="text-muted-foreground">{container.description}</p>
          </div>
          <Button className="gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{container.userCount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Active user accounts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Features</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{container.features.length}</div>
              <p className="text-xs text-muted-foreground">
                Enabled features
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Domain</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-mono truncate">{container.domain}</div>
              <p className="text-xs text-muted-foreground">
                Authentication domain
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {getStatusBadge(container.status)}
              </div>
              <p className="text-xs text-muted-foreground">
                Current state
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <ContainerOverview container={container} />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <ContainerUsers container={container} />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <ContainerSecurity container={container} />
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <ContainerActivity container={container} />
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-4">
            <ContainerIntegrations container={container} />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <ContainerSettings container={container} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
