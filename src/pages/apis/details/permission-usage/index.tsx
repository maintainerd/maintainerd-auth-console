import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Users, Key, Bot, Shield, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MOCK_PERMISSIONS } from "../../../permissions/constants"
import { MOCK_APIS } from "../../constants"


// Mock data for roles, API keys, and clients using permissions
const MOCK_PERMISSION_USAGE = {
  roles: [
    {
      id: "role_admin",
      name: "Administrator",
      description: "Full system access",
      userCount: 3,
      isSystem: true,
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "role_manager",
      name: "Manager",
      description: "Management level access",
      userCount: 8,
      isSystem: false,
      createdAt: "2024-01-15T00:00:00Z"
    },
    {
      id: "role_operator",
      name: "System Operator",
      description: "System operations access",
      userCount: 5,
      isSystem: false,
      createdAt: "2024-01-20T00:00:00Z"
    }
  ],
  apiKeys: [
    {
      id: "key_monitoring_service",
      name: "Monitoring Service Key",
      description: "Key for monitoring service integration",
      lastUsed: "2024-01-30T10:30:00Z",
      expiresAt: "2024-12-31T23:59:59Z",
      isActive: true,
      createdBy: "admin"
    },
    {
      id: "key_backup_system",
      name: "Backup System Key",
      description: "Automated backup system access",
      lastUsed: "2024-01-29T02:15:00Z",
      expiresAt: "2024-06-30T23:59:59Z",
      isActive: true,
      createdBy: "system"
    }
  ],
  clients: [
    {
      id: "client_analytics_service",
      name: "Analytics Service",
      description: "Internal analytics processing service",
      lastUsed: "2024-01-30T14:22:00Z",
      isActive: true,
      clientType: "service",
      createdBy: "system"
    },
    {
      id: "client_notification_worker",
      name: "Notification Worker",
      description: "Background notification processing",
      lastUsed: "2024-01-30T09:45:00Z",
      isActive: true,
      clientType: "worker",
      createdBy: "admin"
    },
    {
      id: "client_data_sync",
      name: "Data Sync Client",
      description: "External data synchronization client",
      lastUsed: "2024-01-28T16:30:00Z",
      isActive: false,
      clientType: "external",
      createdBy: "admin"
    }
  ]
}

export default function PermissionUsagePage() {
  const { tenantId, apiId, permissionName } = useParams<{ 
    tenantId: string
    apiId: string
    permissionName: string
  }>()
  const navigate = useNavigate()

  const api = MOCK_APIS.find(a => a.id === apiId)
  const permission = MOCK_PERMISSIONS.find(p => 
    p.name === decodeURIComponent(permissionName || '') && p.apiId === apiId
  )

  const handleBackToApi = () => {
    navigate(`/${tenantId}/apis/${apiId}`)
  }

  if (!api || !permission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Permission Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The permission you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/${tenantId}/apis`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to APIs
        </Button>
      </div>
    )
  }

  const roles = MOCK_PERMISSION_USAGE.roles
  const apiKeys = MOCK_PERMISSION_USAGE.apiKeys
  const clients = MOCK_PERMISSION_USAGE.clients

  const totalUsage = roles.length + apiKeys.length + clients.length

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToApi}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {api.displayName}
          </Button>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Key className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-2xl font-semibold tracking-tight">Permission Usage</h1>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg">{permission.name}</span>
              {permission.isSystem && (
                <Badge variant="secondary" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  System
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{permission.description}</p>
            <p className="text-sm text-muted-foreground">
              Used by <span className="font-medium">{totalUsage}</span> entities across roles, API keys, and clients
            </p>
          </div>
        </div>



        {/* Usage Tabs */}
        <Tabs defaultValue="roles" className="space-y-6">
          <TabsList>
            <TabsTrigger value="roles" className="gap-2">
              <Users className="h-4 w-4" />
              Roles ({roles.length})
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="gap-2">
              <Key className="h-4 w-4" />
              API Keys ({apiKeys.length})
            </TabsTrigger>
            <TabsTrigger value="clients" className="gap-2">
              <Bot className="h-4 w-4" />
              Clients ({clients.length})
            </TabsTrigger>
          </TabsList>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Roles Using This Permission
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  User roles that have been granted this permission
                </p>
              </CardHeader>
              <CardContent>
                {roles.length > 0 ? (
                  <div className="space-y-4">
                    {roles.map((role) => (
                      <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{role.name}</span>
                            {role.isSystem && (
                              <Badge variant="secondary" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                System
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{role.userCount} users</span>
                            <span>Created {new Date(role.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          View Role
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Roles Found</h3>
                    <p className="text-muted-foreground">
                      This permission is not assigned to any roles.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api-keys" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys Using This Permission
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  API keys that have been granted this permission for programmatic access
                </p>
              </CardHeader>
              <CardContent>
                {apiKeys.length > 0 ? (
                  <div className="space-y-4">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{apiKey.name}</span>
                            <Badge variant={apiKey.isActive ? "default" : "secondary"}>
                              {apiKey.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{apiKey.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Last used {new Date(apiKey.lastUsed).toLocaleDateString()}</span>
                            <span>Expires {new Date(apiKey.expiresAt).toLocaleDateString()}</span>
                            <span>Created by {apiKey.createdBy}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          View Key
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No API Keys Found</h3>
                    <p className="text-muted-foreground">
                      This permission is not assigned to any API keys.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Clients Using This Permission
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Client applications that have been granted this permission
                </p>
              </CardHeader>
              <CardContent>
                {clients.length > 0 ? (
                  <div className="space-y-4">
                    {clients.map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{client.name}</span>
                            <Badge variant={client.isActive ? "default" : "secondary"}>
                              {client.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {client.clientType}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{client.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Last used {new Date(client.lastUsed).toLocaleDateString()}</span>
                            <span>Created by {client.createdBy}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          View Client
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Clients Found</h3>
                    <p className="text-muted-foreground">
                      This permission is not assigned to any clients.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
