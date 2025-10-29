import React from "react"
import { Calendar, User, Shield, CheckCircle, AlertTriangle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import type { Container } from "../../components/ContainerColumns"

interface ContainerOverviewProps {
  container: Container
}

export function ContainerOverview({ container }: ContainerOverviewProps) {
  // Mock data for overview metrics
  const metrics = {
    activeUsers: Math.floor(container.userCount * 0.85),
    loginSuccess: 98.5,
    uptime: 99.9,
    lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    monthlyLogins: Math.floor(container.userCount * 15),
    failedLogins: Math.floor(container.userCount * 0.02),
  }

  const recentActivity = [
    {
      id: 1,
      type: "user_login",
      message: "User john.doe@example.com logged in",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: "success"
    },
    {
      id: 2,
      type: "user_created",
      message: "New user alice.smith@example.com created",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: "success"
    },
    {
      id: 3,
      type: "failed_login",
      message: "Failed login attempt for admin@example.com",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: "warning"
    },
    {
      id: 4,
      type: "role_updated",
      message: "Role permissions updated for 'Manager' role",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: "success"
    },
    {
      id: 5,
      type: "integration_sync",
      message: "LDAP synchronization completed",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      status: "success"
    }
  ]

  const getActivityIcon = (type: string, status: string) => {
    if (status === "warning") return <AlertTriangle className="h-4 w-4 text-amber-500" />
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  return (
    <div className="grid gap-6">
      {/* Container Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Container Information
            </CardTitle>
            <CardDescription>
              Basic details and configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Name</span>
                <span className="text-sm text-muted-foreground">{container.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Domain</span>
                <span className="text-sm text-muted-foreground font-mono">{container.domain}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Created</span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(container.createdAt), "MMM dd, yyyy 'at' HH:mm")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Created by</span>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="text-sm text-muted-foreground">{container.createdBy}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Type</span>
                <Badge variant={container.isSystem ? "secondary" : "default"}>
                  {container.isSystem ? "System" : "Tenant"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Health & Performance
            </CardTitle>
            <CardDescription>
              Current system metrics and status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Uptime</span>
                <span className="text-sm font-semibold text-green-600">{metrics.uptime}%</span>
              </div>
              <Progress value={metrics.uptime} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Login Success Rate</span>
                <span className="text-sm font-semibold text-green-600">{metrics.loginSuccess}%</span>
              </div>
              <Progress value={metrics.loginSuccess} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Active Users</span>
                <span className="text-sm text-muted-foreground">
                  {metrics.activeUsers.toLocaleString()} / {container.userCount.toLocaleString()}
                </span>
              </div>
              <Progress value={(metrics.activeUsers / container.userCount) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Last Activity</span>
                <span className="text-sm text-muted-foreground">
                  {format(metrics.lastActivity, "MMM dd, HH:mm")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features and Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Enabled Features
            </CardTitle>
            <CardDescription>
              Active features and capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {container.features.map((feature) => (
                <Badge key={feature} variant="secondary" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest events and actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  {getActivityIcon(activity.type, activity.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground truncate">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(activity.timestamp, "MMM dd, HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Statistics</CardTitle>
          <CardDescription>
            Monthly authentication and user activity metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.monthlyLogins.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Monthly Logins</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.activeUsers.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{metrics.failedLogins}</div>
              <p className="text-sm text-muted-foreground">Failed Logins</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.loginSuccess}%</div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
