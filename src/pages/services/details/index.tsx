import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Edit, Server, Shield, FileText, Database, Settings, BarChart3, Activity, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { MOCK_SERVICES } from "../constants"

export default function ServiceDetailsPage() {
  const { tenantId, serviceId } = useParams<{ tenantId: string; serviceId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")
  
  const service = MOCK_SERVICES.find(s => s.id === serviceId)

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Service Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The service you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/${tenantId}/services`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200"
      case "maintenance": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "deprecated": return "bg-orange-100 text-orange-800 border-orange-200"
      case "inactive": return "bg-gray-100 text-gray-800 border-gray-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Active"
      case "maintenance": return "Maintenance"
      case "deprecated": return "Deprecated"
      case "inactive": return "Inactive"
      default: return status
    }
  }

  // Overview sections for service-level monitoring and security
  const overviewSections = [
    {
      title: "Usage & Performance",
      description: "Service-level usage metrics and performance data across all APIs",
      icon: BarChart3,
      stats: [
        { label: "Requests/min", value: "5.8k", route: "monitoring" },
        { label: "Avg Response Time", value: "28ms", route: "monitoring" },
        { label: "Success Rate", value: "99.7%", route: "monitoring" },
        { label: "Error Rate", value: "0.3%", route: "monitoring" },
      ]
    },
    {
      title: "Security & Access",
      description: "Service-level security settings and access control",
      icon: Shield,
      stats: [
        { label: "Total APIs", value: `${service.apiCount} configured`, route: "apis" },
        { label: "Active Policies", value: `${service.policyCount} applied`, route: "policies" },
        { label: "Authentication", value: "Required", route: "security" },
        { label: "Rate Limiting", value: "Enabled", route: "security" },
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
            onClick={() => navigate(`/${tenantId}/services`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{service.displayName}</h1>
              <Badge className={getStatusColor(service.status)}>
                {getStatusText(service.status)}
              </Badge>
              {service.isSystem && (
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  System
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{service.description}</p>
          </div>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={() => navigate(`/${tenantId}/services/${serviceId}/edit`)}
          >
            <Edit className="h-4 w-4" />
            Edit Service
          </Button>
        </div>

        {/* Service Information */}
        <Card>
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Service Name</p>
                <p className="text-sm font-mono">{service.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Identifier</p>
                <p className="text-sm font-mono">{service.identifier}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm">{format(new Date(service.createdAt), "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created By</p>
                <p className="text-sm">{service.createdBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <p className="text-sm">{service.isSystem ? "System Service" : "Custom Service"}</p>
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
              <TabsTrigger value="apis" className="gap-2">
                <Server className="h-4 w-4" />
                APIs ({service.apiCount})
              </TabsTrigger>
              <TabsTrigger value="policies" className="gap-2">
                <FileText className="h-4 w-4" />
                Policies ({service.policyCount})
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => navigate(`/${tenantId}/apis/create?serviceId=${serviceId}`)}
              >
                <Plus className="h-4 w-4" />
                Add API
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => navigate(`/${tenantId}/policies/create?serviceId=${serviceId}`)}
              >
                <Plus className="h-4 w-4" />
                Add Policy
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

          {/* APIs Tab */}
          <TabsContent value="apis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Service APIs
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage APIs and their permissions for this service
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">User Management API</h4>
                      <p className="text-sm text-muted-foreground">CRUD operations for user management</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">12 endpoints</Badge>
                      <Badge variant="outline">8 permissions</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Authentication API</h4>
                      <p className="text-sm text-muted-foreground">Login, logout, and token management</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">8 endpoints</Badge>
                      <Badge variant="outline">5 permissions</Badge>
                    </div>
                  </div>
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/${tenantId}/apis`)}
                    >
                      View All APIs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Applied Policies
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Policies applied to this service (not owned by this service)
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Rate Limiting Policy</h4>
                      <p className="text-sm text-muted-foreground">Limits requests per minute per user</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Active</Badge>
                      <Badge variant="outline">Global</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Security Headers Policy</h4>
                      <p className="text-sm text-muted-foreground">Enforces security headers on all responses</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Active</Badge>
                      <Badge variant="outline">Security</Badge>
                    </div>
                  </div>
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/${tenantId}/policies`)}
                    >
                      View All Policies
                    </Button>
                  </div>
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
