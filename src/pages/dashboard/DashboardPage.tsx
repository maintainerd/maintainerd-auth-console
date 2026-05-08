import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Shield,
  Container,
  Server,
  Key,
  Settings,
  ArrowRight,
  CheckCircle,
  Globe,
  BarChart3,
  BookOpen,
  ExternalLink
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

const DashboardPage = () => {
  const navigate = useNavigate()
  const { tenantId } = useParams()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Get Started</h1>
          <p className="text-muted-foreground">
            Welcome to your M9d-Auth dashboard. Manage your authentication services, users, and security settings.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Overview
              </CardTitle>
              <CardDescription>
                Current system statistics and activity overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">1,234</div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">4</div>
                  <div className="text-sm text-muted-foreground">Containers</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-sm text-muted-foreground">Services</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-600">89</div>
                  <div className="text-sm text-muted-foreground">New Users This Month</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Essential setup tasks to get your authentication system ready
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => navigate(`/${tenantId}/users`)}
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Manage Users</div>
                    <div className="text-sm text-muted-foreground">Add users and assign roles</div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => navigate(`/${tenantId}/security/settings`)}
              >
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Security Settings</div>
                    <div className="text-sm text-muted-foreground">Configure security policies</div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => navigate(`/${tenantId}/services`)}
              >
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Manage Services</div>
                    <div className="text-sm text-muted-foreground">Register application services</div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => navigate(`/${tenantId}/providers/identity`)}
              >
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Identity Providers</div>
                    <div className="text-sm text-muted-foreground">Connect external providers</div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Integration Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Application Integration
            </CardTitle>
            <CardDescription>
              Connect your applications to M9d-Auth using standard protocols
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">OAuth 2.0 / OpenID Connect</div>
                  <div className="text-sm text-muted-foreground">Standard authentication flows</div>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">REST APIs</div>
                  <div className="text-sm text-muted-foreground">Direct API integration</div>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={() => navigate(`/${tenantId}/clients`)}>
                Create OAuth Client
              </Button>
              <Button variant="outline" onClick={() => navigate(`/${tenantId}/api-keys`)}>
                Generate API Key
              </Button>
              <Button variant="ghost">
                <ExternalLink className="mr-2 h-4 w-4" />
                Documentation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Status
            </CardTitle>
            <CardDescription>
              Review and configure essential security features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Password Policies</div>
                  <div className="text-sm text-muted-foreground">Password requirements configured</div>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Multi-Factor Authentication</div>
                  <div className="text-sm text-muted-foreground">Additional security layer</div>
                </div>
                <Badge variant="secondary">Enabled</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Session Management</div>
                  <div className="text-sm text-muted-foreground">Session timeouts and security</div>
                </div>
                <Badge variant="secondary">Configured</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Threat Detection</div>
                  <div className="text-sm text-muted-foreground">Monitor suspicious activity</div>
                </div>
                <Badge variant="outline">Setup Required</Badge>
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={() => navigate(`/${tenantId}/security/settings`)}>
                Review Security Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage;
