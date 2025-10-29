import React from "react"
import { Globe, Plus, Settings, CheckCircle, AlertCircle, Clock, Database, Key, Webhook } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import type { Container } from "../../components/ContainerColumns"

interface ContainerIntegrationsProps {
  container: Container
}

export function ContainerIntegrations({ container }: ContainerIntegrationsProps) {
  // Mock integration data
  const integrations = [
    {
      id: "ldap_1",
      name: "Corporate LDAP",
      type: "LDAP",
      status: "active",
      description: "Active Directory integration for employee authentication",
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      syncedUsers: 1250,
      enabled: true,
      icon: Database
    },
    {
      id: "saml_1",
      name: "Google Workspace",
      type: "SAML",
      status: "active",
      description: "Single Sign-On with Google Workspace",
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
      syncedUsers: 450,
      enabled: true,
      icon: Globe
    },
    {
      id: "oauth_1",
      name: "GitHub OAuth",
      type: "OAuth",
      status: "inactive",
      description: "OAuth integration with GitHub for developer access",
      lastSync: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      syncedUsers: 25,
      enabled: false,
      icon: Key
    },
    {
      id: "webhook_1",
      name: "Slack Notifications",
      type: "Webhook",
      status: "active",
      description: "Send security alerts and notifications to Slack",
      lastSync: new Date(Date.now() - 5 * 60 * 1000),
      syncedUsers: 0,
      enabled: true,
      icon: Webhook
    },
    {
      id: "api_1",
      name: "Custom API",
      type: "API",
      status: "error",
      description: "Custom user provisioning API integration",
      lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
      syncedUsers: 0,
      enabled: true,
      icon: Globe
    }
  ]

  const [integrationStates, setIntegrationStates] = React.useState(
    integrations.reduce((acc, integration) => ({
      ...acc,
      [integration.id]: integration.enabled
    }), {} as Record<string, boolean>)
  )

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { 
        label: "Active", 
        className: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle
      },
      inactive: { 
        label: "Inactive", 
        className: "bg-gray-100 text-gray-800 border-gray-200",
        icon: Clock
      },
      error: { 
        label: "Error", 
        className: "bg-red-100 text-red-800 border-red-200",
        icon: AlertCircle
      },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive
    const Icon = config.icon
    
    return (
      <Badge className={`${config.className} gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      LDAP: { className: "bg-blue-100 text-blue-800 border-blue-200" },
      SAML: { className: "bg-purple-100 text-purple-800 border-purple-200" },
      OAuth: { className: "bg-green-100 text-green-800 border-green-200" },
      Webhook: { className: "bg-orange-100 text-orange-800 border-orange-200" },
      API: { className: "bg-gray-100 text-gray-800 border-gray-200" },
    }
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.API
    return (
      <Badge variant="outline" className={config.className}>
        {type}
      </Badge>
    )
  }

  const handleToggleIntegration = (integrationId: string, enabled: boolean) => {
    setIntegrationStates(prev => ({
      ...prev,
      [integrationId]: enabled
    }))
    // Here you would typically make an API call to update the integration status
    console.log(`Integration ${integrationId} ${enabled ? 'enabled' : 'disabled'}`)
  }

  const activeIntegrations = integrations.filter(i => i.status === 'active').length
  const totalSyncedUsers = integrations.reduce((sum, i) => sum + i.syncedUsers, 0)

  return (
    <div className="space-y-6">
      {/* Integration Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.length}</div>
            <p className="text-xs text-muted-foreground">
              Configured integrations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeIntegrations}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Synced Users</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalSyncedUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From external sources
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {format(Math.max(...integrations.map(i => i.lastSync.getTime())), "MMM dd, HH:mm")}
            </div>
            <p className="text-xs text-muted-foreground">
              Most recent sync
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Integrations List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Integrations
              </CardTitle>
              <CardDescription>
                Manage external system integrations
              </CardDescription>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Integration
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration) => {
              const Icon = integration.icon
              return (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{integration.name}</h4>
                        {getTypeBadge(integration.type)}
                        {getStatusBadge(integration.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {integration.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Last sync: {format(integration.lastSync, "MMM dd, HH:mm")}</span>
                        {integration.syncedUsers > 0 && (
                          <span>Users: {integration.syncedUsers.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`integration-${integration.id}`}
                        checked={integrationStates[integration.id]}
                        onCheckedChange={(checked) => handleToggleIntegration(integration.id, checked)}
                      />
                      <Label htmlFor={`integration-${integration.id}`} className="text-sm">
                        Enabled
                      </Label>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Settings className="h-4 w-4" />
                      Configure
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Integration Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Integration Health
          </CardTitle>
          <CardDescription>
            Status and performance of active integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations
              .filter(i => integrationStates[i.id])
              .map((integration) => (
                <div key={integration.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      integration.status === 'active' ? 'bg-green-500' :
                      integration.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                    }`} />
                    <span className="font-medium">{integration.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {integration.status === 'active' ? 'Healthy' : 
                       integration.status === 'error' ? 'Needs attention' : 'Inactive'}
                    </span>
                    {getStatusBadge(integration.status)}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
