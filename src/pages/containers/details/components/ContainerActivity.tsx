import React from "react"
import { Activity, Calendar, Filter, Download, TrendingUp, Users, LogIn, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, subDays, subHours } from "date-fns"
import type { Container } from "../../components/ContainerColumns"

interface ContainerActivityProps {
  container: Container
}

export function ContainerActivity({ container }: ContainerActivityProps) {
  const [timeRange, setTimeRange] = React.useState("7d")
  const [activityType, setActivityType] = React.useState("all")

  // Mock activity data
  const activityData = {
    totalEvents: 15420,
    todayEvents: 1250,
    loginEvents: 8900,
    failedLogins: 120,
    userCreations: 45,
    roleChanges: 23,
  }

  const recentActivities = [
    {
      id: 1,
      type: "user_login",
      title: "User Login",
      description: "john.doe@example.com logged in successfully",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      severity: "info",
      user: "john.doe@example.com",
      ip: "192.168.1.100"
    },
    {
      id: 2,
      type: "failed_login",
      title: "Failed Login Attempt",
      description: "Invalid credentials for admin@example.com",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      severity: "warning",
      user: "admin@example.com",
      ip: "10.0.0.50"
    },
    {
      id: 3,
      type: "user_created",
      title: "User Created",
      description: "New user alice.smith@example.com was created",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      severity: "success",
      user: "alice.smith@example.com",
      ip: "192.168.1.10"
    },
    {
      id: 4,
      type: "role_updated",
      title: "Role Updated",
      description: "User bob.johnson@example.com role changed to Manager",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      severity: "info",
      user: "bob.johnson@example.com",
      ip: "192.168.1.20"
    },
    {
      id: 5,
      type: "password_reset",
      title: "Password Reset",
      description: "Password reset requested for carol.williams@example.com",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      severity: "info",
      user: "carol.williams@example.com",
      ip: "192.168.1.30"
    },
    {
      id: 6,
      type: "user_suspended",
      title: "User Suspended",
      description: "User david.brown@example.com was suspended",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      severity: "warning",
      user: "david.brown@example.com",
      ip: "192.168.1.40"
    },
    {
      id: 7,
      type: "integration_sync",
      title: "Integration Sync",
      description: "LDAP synchronization completed successfully",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      severity: "success",
      user: "system",
      ip: "internal"
    },
    {
      id: 8,
      type: "security_alert",
      title: "Security Alert",
      description: "Multiple failed login attempts detected",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      severity: "error",
      user: "system",
      ip: "multiple"
    }
  ]

  const getActivityIcon = (type: string) => {
    const iconMap = {
      user_login: LogIn,
      failed_login: AlertTriangle,
      user_created: Users,
      role_updated: Users,
      password_reset: Users,
      user_suspended: AlertTriangle,
      integration_sync: Activity,
      security_alert: AlertTriangle,
    }
    
    const Icon = iconMap[type as keyof typeof iconMap] || Activity
    return <Icon className="h-4 w-4" />
  }

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      success: { label: "Success", className: "bg-green-100 text-green-800 border-green-200" },
      info: { label: "Info", className: "bg-blue-100 text-blue-800 border-blue-200" },
      warning: { label: "Warning", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      error: { label: "Error", className: "bg-red-100 text-red-800 border-red-200" },
    }
    
    const config = severityConfig[severity as keyof typeof severityConfig] || severityConfig.info
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getSeverityColor = (severity: string) => {
    const colorMap = {
      success: "text-green-600",
      info: "text-blue-600",
      warning: "text-yellow-600",
      error: "text-red-600",
    }
    return colorMap[severity as keyof typeof colorMap] || "text-gray-600"
  }

  const filteredActivities = recentActivities.filter(activity => {
    if (activityType === "all") return true
    return activity.type === activityType
  })

  return (
    <div className="space-y-6">
      {/* Activity Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityData.totalEvents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activityData.todayEvents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Logins</CardTitle>
            <LogIn className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activityData.loginEvents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              98.7% success rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{activityData.failedLogins}</div>
            <p className="text-xs text-muted-foreground">
              1.3% of total attempts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Log
              </CardTitle>
              <CardDescription>
                Recent events and user activities
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="user_login">User Logins</SelectItem>
                  <SelectItem value="failed_login">Failed Logins</SelectItem>
                  <SelectItem value="user_created">User Created</SelectItem>
                  <SelectItem value="role_updated">Role Updates</SelectItem>
                  <SelectItem value="security_alert">Security Alerts</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className={`p-2 rounded-full ${getSeverityColor(activity.severity)} bg-opacity-10`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{activity.title}</h4>
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(activity.severity)}
                      <span className="text-xs text-muted-foreground">
                        {format(activity.timestamp, "MMM dd, HH:mm")}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>User: {activity.user}</span>
                    <span>IP: {activity.ip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
