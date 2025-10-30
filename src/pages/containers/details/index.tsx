import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Settings, Users, Shield, Key, Globe, Palette, Server, Database, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MOCK_CONTAINERS } from "../constants"
import type { Container } from "../components/ContainerColumns"

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

  // Mock data for stats
  const stats = {
    users: container.userCount,
    roles: 8,
    identityProviders: 2,
    socialProviders: 3,
    clients: 12,
    apiKeys: 5
  }

  const managementSections = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      stats: [
        { label: "Users", value: stats.users, route: "users" },
        { label: "Roles", value: stats.roles, route: "roles" },
      ]
    },
    {
      title: "Authentication",
      description: "Configure identity and social providers",
      icon: Key,
      stats: [
        { label: "Identity Providers", value: stats.identityProviders, route: "providers/identity" },
        { label: "Social Providers", value: stats.socialProviders, route: "providers/social" },
      ]
    },
    {
      title: "Applications",
      description: "Manage clients and API keys",
      icon: Server,
      stats: [
        { label: "Clients", value: stats.clients, route: "clients" },
        { label: "API Keys", value: stats.apiKeys, route: "api-keys" },
      ]
    },
    {
      title: "Security",
      description: "Security settings, policies, and monitoring",
      icon: Shield,
      stats: [
        { label: "Settings", value: "Configure", route: "security/settings" },
        { label: "Policies", value: "Manage", route: "policies" },
        { label: "Sessions", value: "Monitor", route: "security/sessions" },
        { label: "Threats", value: "Detect", route: "security/threats" },
      ]
    },
    {
      title: "Branding & Templates",
      description: "Customize login pages and email templates",
      icon: Palette,
      stats: [
        { label: "Login Branding", value: "Customize", route: "branding/login" },
        { label: "Email Templates", value: "Manage", route: "branding/email-templates" },
        { label: "SMS Templates", value: "Manage", route: "branding/sms-templates" },
      ]
    },
    {
      title: "System",
      description: "Logs, analytics, and system configuration",
      icon: Database,
      stats: [
        { label: "Logs", value: "View", route: "logs" },
        { label: "Analytics", value: "Monitor", route: "analytics" },
        { label: "Notifications", value: "Configure", route: "notifications" },
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
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate(`/c/${containerId}/containers/${targetContainerId}/edit`)}
            >
              <Edit className="h-4 w-4" />
              Edit Container
            </Button>
            <Button className="gap-2" onClick={() => navigate(`/c/${containerId}/settings`)}>
              <Settings className="h-4 w-4" />
              Container Settings
            </Button>
          </div>
        </div>

        {/* Container Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Container Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Identifier</div>
                <div className="text-sm font-mono">{container.id}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Created</div>
                <div className="text-sm">{new Date(container.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Created By</div>
                <div className="text-sm">{container.createdBy}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Management Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {managementSections.map((section) => {
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
                  <div className="grid gap-3 sm:grid-cols-2">
                    {section.stats.map((stat) => (
                      <Button
                        key={stat.label}
                        variant="outline"
                        className="justify-between h-auto p-3"
                        onClick={() => navigate(`/c/${containerId}/${stat.route}`)}
                      >
                        <span className="text-sm font-medium">{stat.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                        </span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
