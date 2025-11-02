import { useState } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Edit, Shield, Cloud, Key, Settings, Users, Activity, CheckCircle, AlertTriangle, Wrench, Copy, RotateCcw, Monitor, Smartphone, Globe, Cog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { MOCK_CLIENTS } from "../constants"
import { MOCK_USERS } from "../../users/constants"
import type { Client } from "../constants"

export default function ClientDetailsPage() {
  const { containerId, clientId } = useParams<{ containerId: string; clientId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get("tab") || "overview"

  // Find the client
  const client = MOCK_CLIENTS.find(c => c.id === clientId)

  // Get users for this client (mock data)
  const clientUsers = MOCK_USERS.filter(user => 
    // Mock logic: assign users to clients based on some criteria
    Math.random() > 0.7 // Random assignment for demo
  ).slice(0, 15)

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-semibold">Client Not Found</h2>
        <p className="text-muted-foreground">The client you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(`/c/${containerId}/clients`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clients
        </Button>
      </div>
    )
  }

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Active", className: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      inactive: { label: "Inactive", className: "bg-gray-100 text-gray-800 border-gray-200", icon: AlertTriangle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive
    const Icon = config.icon
    
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getSystemBadge = (isDefault: boolean) => {
    if (!isDefault) return null
    
    return (
      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
        <Shield className="h-3 w-3 mr-1" />
        System
      </Badge>
    )
  }

  const getClientTypeName = (type: string) => {
    const typeNames = {
      regular: "Regular Web Application",
      native: "Native Mobile Application", 
      spa: "Single Page Application",
      m2m: "Machine to Machine"
    }
    return typeNames[type as keyof typeof typeNames] || "Unknown"
  }

  const getClientTypeIcon = (type: string) => {
    const icons = {
      regular: Globe,
      native: Smartphone,
      spa: Monitor,
      m2m: Cog
    }
    return icons[type as keyof typeof icons] || Globe
  }

  const handleCopyClientId = () => {
    navigator.clipboard.writeText(client.clientId)
    // You could add a toast notification here
  }

  const ClientTypeIcon = getClientTypeIcon(client.type)

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(`/c/${containerId}/clients`)}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Clients
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{client.name}</h1>
            {getStatusBadge(client.status)}
            {getSystemBadge(client.isDefault)}
          </div>
          <p className="text-muted-foreground">{client.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleCopyClientId}
          >
            <Copy className="h-4 w-4" />
            Copy Client ID
          </Button>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={() => navigate(`/c/${containerId}/clients/${clientId}/edit`)}
            disabled={client.isDefault}
          >
            <Edit className="h-4 w-4" />
            Edit Client
          </Button>
        </div>
      </div>

      {/* Client Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Client ID</p>
              <p className="text-sm font-mono">{client.clientId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">System ID</p>
              <p className="text-sm font-mono">{client.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <div className="flex items-center gap-2">
                <ClientTypeIcon className="h-4 w-4" />
                <p className="text-sm">{getClientTypeName(client.type)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Identity Provider</p>
              <p className="text-sm">{client.identityProviderName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p className="text-sm">{format(new Date(client.createdAt), "MMM d, yyyy")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created By</p>
              <p className="text-sm">{client.createdBy}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="configuration" className="gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="attributes" className="gap-2">
            <Key className="h-4 w-4" />
            Attributes
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Usage & Authentication Card */}
            <Card>
              <CardHeader>
                <CardTitle>Usage & Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Users</span>
                    <span className="font-medium">{client.userCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Client Status</span>
                    <span className="font-medium">{client.status}</span>
                  </div>
                  {client.lastUsed && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Used</span>
                      <span className="font-medium">{format(new Date(client.lastUsed), "MMM d, yyyy HH:mm")}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Token Lifetime</span>
                    <span className="font-medium">{client.tokenLifetime / 3600}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* OAuth Configuration Card */}
            <Card>
              <CardHeader>
                <CardTitle>OAuth Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Grant Types</span>
                    <span className="font-medium">{client.grantTypes.length} configured</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Scopes</span>
                    <span className="font-medium">{client.scopes.length} configured</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Redirect URIs</span>
                    <span className="font-medium">{client.redirectUris.length} configured</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Allowed Origins</span>
                    <span className="font-medium">{client.allowedOrigins.length} configured</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>OAuth Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                OAuth 2.0 and OpenID Connect configuration settings for this client.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Client ID</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono bg-muted p-2 rounded flex-1">{client.clientId}</p>
                      <Button variant="outline" size="sm" onClick={handleCopyClientId}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Client Type</p>
                    <div className="flex items-center gap-2 bg-muted p-2 rounded">
                      <ClientTypeIcon className="h-4 w-4" />
                      <p className="text-sm">{getClientTypeName(client.type)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Grant Types</p>
                  <div className="flex flex-wrap gap-2">
                    {client.grantTypes.map((grantType) => (
                      <Badge key={grantType} variant="outline" className="font-mono text-xs">
                        {grantType}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Scopes</p>
                  <div className="flex flex-wrap gap-2">
                    {client.scopes.map((scope) => (
                      <Badge key={scope} variant="outline" className="font-mono text-xs">
                        {scope}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Redirect URIs</p>
                  <div className="space-y-2">
                    {client.redirectUris.map((uri, index) => (
                      <p key={index} className="text-sm font-mono bg-muted p-2 rounded break-all">{uri}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Allowed Origins</p>
                  <div className="space-y-2">
                    {client.allowedOrigins.map((origin, index) => (
                      <p key={index} className="text-sm font-mono bg-muted p-2 rounded break-all">{origin}</p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Token Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Token Configuration
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Token lifetime and refresh token settings
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Access Token Lifetime</p>
                  <p className="text-sm bg-muted p-2 rounded">{client.tokenLifetime / 3600} hours ({client.tokenLifetime} seconds)</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Refresh Token Lifetime</p>
                  <p className="text-sm bg-muted p-2 rounded">{client.refreshTokenLifetime / 86400} days ({client.refreshTokenLifetime} seconds)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attributes Tab */}
        <TabsContent value="attributes" className="space-y-6">
          <div className="grid gap-6">
            {/* Attribute Mappings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Attribute Mappings</CardTitle>
                <p className="text-sm text-muted-foreground">
                  External provider attribute mappings for user authentication and profile data.
                </p>
              </CardHeader>
              <CardContent>
                {client.fieldMappings && client.fieldMappings.length > 0 ? (
                  <div className="space-y-4">
                    {client.fieldMappings.map((mapping, index) => (
                      <div key={mapping.id || `mapping-${index}`} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="text-sm">
                              <span className="font-medium">
                                {mapping.fieldType === "standard"
                                  ? mapping.localField
                                  : mapping.customFieldName
                                }
                              </span>
                              <span className="text-muted-foreground"> ({mapping.externalField})</span>
                            </div>
                            <Badge variant={mapping.fieldType === "standard" ? "default" : "secondary"} className="text-xs">
                              {mapping.fieldType === "standard" ? "Standard" : "Custom"}
                            </Badge>
                            {mapping.required && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                            {mapping.transform && mapping.transform !== "none" && (
                              <Badge variant="outline" className="text-xs">
                                Transform: {mapping.transform}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <span>Local: </span>
                            <span className="font-medium">
                              {mapping.fieldType === "standard"
                                ? mapping.localField
                                : mapping.customFieldName
                              }
                            </span>
                            <span className="mx-2">•</span>
                            <span>External: </span>
                            <span className="font-medium">{mapping.externalField}</span>
                            <span className="mx-2">•</span>
                            <span>Category: </span>
                            <span className="font-medium capitalize">{mapping.category}</span>
                            {mapping.transform && mapping.transform !== "none" && (
                              <>
                                <span className="mx-2">•</span>
                                <span>Transform: </span>
                                <span className="font-medium">{mapping.transform}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No attribute mappings configured</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Attribute mappings are only required for external identity providers.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Custom Fields Card */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Fields</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Provider-specific custom fields and configuration options.
                </p>
              </CardHeader>
              <CardContent>
                {client.customFields && Object.keys(client.customFields).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(client.customFields).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{key}</div>
                          <div className="text-xs text-muted-foreground">{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No custom fields configured</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Custom fields can be used for provider-specific configuration.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Users</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Users who have authenticated through this client
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {clientUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No users found</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    No users have authenticated through this client yet.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {user.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.status === 'active'
                                ? "bg-green-100 text-green-800 border-green-200"
                                : user.status === 'inactive'
                                ? "bg-gray-100 text-gray-800 border-gray-200"
                                : user.status === 'pending'
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {user.lastLogin ? format(new Date(user.lastLogin), "MMM d, yyyy") : "Never"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
