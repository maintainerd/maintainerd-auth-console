import { useState } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Edit, Shield, Cloud, Key, Settings, Users, Activity, CheckCircle, AlertTriangle, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { MOCK_SOCIAL_PROVIDERS } from "../constants"
import { MOCK_USERS } from "../../users/constants"
import type { SocialProvider } from "../components/SocialProviderColumns"

export default function SocialProviderDetailsPage() {
  const { tenantId, providerId } = useParams<{ tenantId: string; providerId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get("tab") || "overview"

  // Find the social provider
  const provider = MOCK_SOCIAL_PROVIDERS.find(p => p.id === providerId)

  // Get users for this provider (mock data)
  const providerUsers = MOCK_USERS.filter(user => 
    // Mock logic: assign users to providers based on some criteria
    Math.random() > 0.8 // Random assignment for demo
  ).slice(0, 10)

  if (!provider) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-semibold">Social Provider Not Found</h2>
        <p className="text-muted-foreground">The social provider you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(`/${tenantId}/providers/social`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Social Providers
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
      inactive: { label: "Inactive", className: "bg-gray-100 text-gray-800 border-gray-200", icon: AlertTriangle },
      configuring: { label: "Configuring", className: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Wrench }
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

  const getProviderTypeName = (type: string) => {
    const typeNames = {
      google: "Google OAuth",
      facebook: "Facebook Login",
      github: "GitHub OAuth",
      twitter: "Twitter OAuth",
      linkedin: "LinkedIn OAuth",
      apple: "Apple Sign In",
      microsoft: "Microsoft OAuth",
      discord: "Discord OAuth",
      custom: "Custom OAuth Provider"
    }
    return typeNames[type as keyof typeof typeNames] || "Custom OAuth Provider"
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(`/${tenantId}/providers/social`)}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Social Providers
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{provider.displayName}</h1>
            {getStatusBadge(provider.status)}
          </div>
          <p className="text-muted-foreground">{provider.description}</p>
        </div>
        <Button 
          variant="outline" 
          className="gap-2" 
          onClick={() => navigate(`/${tenantId}/providers/social/${providerId}/edit`)}
        >
          <Edit className="h-4 w-4" />
          Edit Provider
        </Button>
      </div>

      {/* Provider Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Provider Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">System Name</p>
              <p className="text-sm font-mono">{provider.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Identifier</p>
              <p className="text-sm font-mono">{provider.identifier}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p className="text-sm">{getProviderTypeName(provider.type)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p className="text-sm">{format(new Date(provider.createdAt), "MMM d, yyyy")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created By</p>
              <p className="text-sm">{provider.createdBy}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-sm">{format(new Date(provider.updatedAt), "MMM d, yyyy")}</p>
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
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Users & Authentication Card */}
            <Card>
              <CardHeader>
                <CardTitle>Users & Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Users</span>
                    <span className="font-medium">{provider.userCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Provider Status</span>
                    <span className="font-medium">{provider.status}</span>
                  </div>
                  {provider.lastSync && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Sync</span>
                      <span className="font-medium">{format(new Date(provider.lastSync), "MMM d, yyyy HH:mm")}</span>
                    </div>
                  )}
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
                    <span className="text-sm text-muted-foreground">Client ID</span>
                    <span className="font-mono text-sm truncate max-w-[200px]">{provider.clientId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Endpoint</span>
                    <span className="font-mono text-sm truncate max-w-[200px]">{provider.endpoint}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Scopes</span>
                    <span className="font-medium">{provider.scopes.length} configured</span>
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
                OAuth 2.0 configuration and connection settings for this social provider.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Client ID</p>
                    <p className="text-sm font-mono bg-muted p-2 rounded">{provider.clientId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Authorization Endpoint</p>
                    <p className="text-sm font-mono bg-muted p-2 rounded break-all">{provider.endpoint}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">OAuth Scopes</p>
                  <div className="flex flex-wrap gap-2">
                    {provider.scopes.map((scope) => (
                      <Badge key={scope} variant="outline" className="font-mono text-xs">
                        {scope}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Configuration Fields */}
          {provider.metadata && Object.keys(provider.metadata).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Custom Configuration Fields
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Provider-specific configuration fields and settings
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(provider.metadata).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm font-medium text-muted-foreground">{key}</p>
                      <p className="text-sm font-mono bg-muted p-2 rounded break-all">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Users</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Users authenticated through this social provider
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {providerUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No users found</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    No users are currently authenticated through this social provider.
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
                    {providerUsers.map((user) => (
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
