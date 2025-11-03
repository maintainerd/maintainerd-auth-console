import React, { useState } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Edit, Key, Shield, Activity, CheckCircle, AlertTriangle, Clock, Copy, RotateCcw, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { MOCK_API_KEYS } from "../constants"
import { MOCK_PERMISSIONS } from "../../permissions/constants"

export default function ApiKeyDetailsPage() {
  const { containerId, id } = useParams<{ containerId: string; id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview")
  const [showFullKey, setShowFullKey] = useState(false)

  const apiKey = MOCK_API_KEYS.find(key => key.id === id)

  if (!apiKey) {
    return (
      <div className="container mx-auto max-w-7xl p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">API Key Not Found</h1>
          <p className="text-muted-foreground mt-2">The requested API key could not be found.</p>
          <Button onClick={() => navigate(`/c/${containerId}/api-keys`)} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to API Keys
          </Button>
        </div>
      </div>
    )
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set("tab", value)
    navigate(`/c/${containerId}/api-keys/${id}?${newSearchParams.toString()}`, { replace: true })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3 mr-1" />
      case "inactive":
        return <AlertTriangle className="h-3 w-3 mr-1" />
      case "expired":
        return <Clock className="h-3 w-3 mr-1" />
      default:
        return <AlertTriangle className="h-3 w-3 mr-1" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "inactive":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "expired":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "admin":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "read-write":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "read-only":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const fullApiKey = `${apiKey.keyPrefix}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

  // Get permission details for this API key
  const apiKeyPermissions = MOCK_PERMISSIONS.filter(permission => 
    apiKey.permissions.includes(permission.name)
  )

  // Group permissions by API
  const permissionsByApi = apiKeyPermissions.reduce((acc, permission) => {
    if (!acc[permission.apiName]) {
      acc[permission.apiName] = []
    }
    acc[permission.apiName].push(permission)
    return acc
  }, {} as Record<string, typeof apiKeyPermissions>)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/c/${containerId}/api-keys`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to API Keys
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{apiKey.displayName}</h1>
              <Badge className={getStatusColor(apiKey.status)}>
                {getStatusIcon(apiKey.status)}
                {apiKey.status.charAt(0).toUpperCase() + apiKey.status.slice(1)}
              </Badge>
              <Badge className={getTypeColor(apiKey.type)}>
                {apiKey.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl">{apiKey.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => navigate(`/c/${containerId}/api-keys/${apiKey.id}/edit`)}
            >
              <Edit className="h-4 w-4" />
              Edit API Key
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="permissions" className="gap-2">
              <Shield className="h-4 w-4" />
              Permissions ({apiKey.permissions.length})
            </TabsTrigger>
          </TabsList>

          <div className="space-y-6">

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* API Key Details Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      API Key Details
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Key information and configuration</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Key Prefix</span>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-muted px-2 py-1 rounded">{apiKey.keyPrefix}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.keyPrefix)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium">Full API Key</span>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {showFullKey ? fullApiKey : `${apiKey.keyPrefix}${'*'.repeat(16)}`}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowFullKey(!showFullKey)}
                            >
                              {showFullKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(fullApiKey)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground text-right">
                            Keep secure and never share publicly
                          </p>
                        </div>
                      </div>
                      {apiKey.expiresAt && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Expires</span>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(apiKey.expiresAt), "PPP")}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Created</span>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(apiKey.createdAt), "PPP")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Created By</span>
                        <span className="text-sm text-muted-foreground">{apiKey.createdBy}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Usage Statistics Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Usage Statistics
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">API key usage and activity metrics</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Requests</span>
                        <span className="text-sm text-muted-foreground">
                          {apiKey.usageCount.toLocaleString()}
                        </span>
                      </div>
                      {apiKey.lastUsed && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Last Used</span>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(apiKey.lastUsed), "PPP")}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Last Updated</span>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(apiKey.updatedAt), "PPP")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Permissions</span>
                        <span className="text-sm text-muted-foreground">
                          {apiKey.permissions.length} assigned
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Permissions
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    This API key has access to {apiKey.permissions.length} permission{apiKey.permissions.length !== 1 ? 's' : ''} across {Object.keys(permissionsByApi).length} API{Object.keys(permissionsByApi).length !== 1 ? 's' : ''}
                  </p>
                </CardHeader>
                <CardContent>
                  {Object.keys(permissionsByApi).length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(permissionsByApi).map(([apiName, permissions]) => (
                        <div key={apiName} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{apiName}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {permissions.length} permission{permissions.length !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {permissions.map((permission) => (
                              <div key={permission.name} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                      {permission.name}
                                    </code>
                                    {permission.isSystem && (
                                      <Badge variant="outline" className="text-xs">System</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {permission.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No permissions assigned</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        This API key doesn't have any permissions assigned yet.
                      </p>
                      <Button onClick={() => navigate(`/c/${containerId}/api-keys/${apiKey.id}/edit`)}>
                        Configure Permissions
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
