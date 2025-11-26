import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Edit, Server, FileText, BarChart3, Activity, Plus, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SystemBadge } from "@/components/badges"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { MOCK_APIS } from "../constants"
import { MOCK_PERMISSIONS } from "../../permissions/constants"

export default function ApiDetailsPage() {
  const { tenantId, apiId } = useParams<{ tenantId: string; apiId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")

  const api = MOCK_APIS.find(a => a.id === apiId)

  // Get permissions for this API
  const apiPermissions = MOCK_PERMISSIONS.filter(p => p.apiId === apiId)
  
  if (!api) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">API Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The API you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/${tenantId}/apis`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to APIs
        </Button>
      </div>
    )
  }

  // Status color helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "deprecated":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "maintenance":
        return "Maintenance"
      case "deprecated":
        return "Deprecated"
      case "inactive":
        return "Inactive"
      default:
        return "Unknown"
    }
  }

  // Overview sections for monitoring and system
  const overviewSections = [
    {
      title: "Usage & Performance",
      description: "API usage metrics and performance data",
      icon: BarChart3,
      stats: [
        { label: "Requests/min", value: "2.4k", route: "monitoring" },
        { label: "Response Time", value: "32ms", route: "monitoring" },
        { label: "Success Rate", value: "99.8%", route: "monitoring" },
        { label: "Error Rate", value: "0.2%", route: "monitoring" },
      ]
    },
    {
      title: "Security & Access",
      description: "Security settings and access control",
      icon: Shield,
      stats: [
        { label: "Permissions", value: `${api.permissionCount} configured`, route: "permissions" },
        { label: "Access Level", value: api.isPublic ? "Public" : "Private", route: "security" },
        { label: "Rate Limiting", value: "Enabled", route: "security" },
        { label: "Authentication", value: "Required", route: "security" },
      ]
    }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tenantId}/apis`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to APIs
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{api.displayName}</h1>
              {api.isSystem && (
                <Badge variant="secondary" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  System
                </Badge>
              )}
              <Badge className={getStatusColor(api.status)}>
                {getStatusText(api.status)}
              </Badge>
              {api.isPublic && (
                <Badge variant="secondary" className="gap-1">
                  <Server className="h-3 w-3" />
                  Public
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{api.description}</p>
          </div>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={() => navigate(`/${tenantId}/apis/${apiId}/edit`)}
          >
            <Edit className="h-4 w-4" />
            Edit API
          </Button>
        </div>

        {/* API Information */}
        <Card>
          <CardHeader>
            <CardTitle>API Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-sm font-mono">{api.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Identifier</p>
                <p className="text-sm font-mono">{api.identifier}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Version</p>
                <p className="text-sm font-mono">{api.version}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Service</p>
                <p className="text-sm">{api.serviceName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Access Level</p>
                <p className="text-sm">{api.isPublic ? "Public API" : "Private API"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm">{format(new Date(api.createdAt), "MMM d, yyyy")} by {api.createdBy}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs with Action Buttons */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview" className="gap-2">
                <Activity className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="permissions" className="gap-2">
                <Key className="h-4 w-4" />
                Permissions ({api.permissionCount})
              </TabsTrigger>
              <TabsTrigger value="documentation" className="gap-2">
                <FileText className="h-4 w-4" />
                Documentation
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                View Documentation
              </Button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {overviewSections.map((section) => {
                  const Icon = section.icon
                  return (
                    <Card key={section.title}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          {section.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3">
                          {section.stats.map((stat) => (
                            <div key={stat.label} className="flex justify-between items-center">
                              <span className="text-sm font-medium">{stat.label}</span>
                              <span className="text-sm text-muted-foreground">
                                {stat.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>API Permissions</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Manage permissions and access control for this API
                      </p>
                    </div>
                    <Button
                      className="gap-2"
                      onClick={() => navigate(`/${tenantId}/apis/${apiId}/permissions/create`)}
                    >
                      <Plus className="h-4 w-4" />
                      Add Permission
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {apiPermissions.length > 0 ? (
                    <div className="space-y-4">
                      {apiPermissions.map((permission) => (
                        <div key={permission.name} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Key className="h-4 w-4 text-muted-foreground" />
                              <span className="font-mono font-medium">{permission.name}</span>
                              <SystemBadge isSystem={permission.isSystem} />
                            </div>
                            <p className="text-sm text-muted-foreground">{permission.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Used by {permission.roleCount} roles</span>
                              <span>Created {format(new Date(permission.createdAt), "MMM d, yyyy")}</span>
                              <span>by {permission.createdBy}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/${tenantId}/apis/${apiId}/permissions/${encodeURIComponent(permission.name)}/edit`)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/${tenantId}/apis/${apiId}/permissions/${encodeURIComponent(permission.name)}/usage`)}
                            >
                              View Usage
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Permissions Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        This API doesn't have any permissions configured yet. Add permissions to control access to this API's endpoints.
                      </p>
                      <Button
                        className="gap-2"
                        onClick={() => navigate(`/${tenantId}/apis/${apiId}/permissions/create`)}
                      >
                        <Plus className="h-4 w-4" />
                        Add First Permission
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documentation Tab */}
            <TabsContent value="documentation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Documentation</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    View and manage API documentation and specifications
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Documentation</h3>
                    <p className="text-muted-foreground mb-4">
                      API documentation and specifications will be displayed here
                    </p>
                    <Button className="gap-2">
                      <FileText className="h-4 w-4" />
                      View Full Documentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
