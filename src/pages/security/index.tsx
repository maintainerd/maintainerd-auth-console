import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Lock, 
  Key, 
  AlertTriangle, 
  Eye, 
  Clock, 
  Ban,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

export default function SecurityPage() {
  const navigate = useNavigate()
  const { containerId } = useParams()

  const securityModules = [
    {
      title: "Security Settings",
      description: "Configure global security settings and authentication requirements",
      icon: Shield,
      route: "/security/settings",
      status: "configured",
      items: ["Multi-factor authentication", "Login requirements", "Account lockout policies"]
    },
    {
      title: "Password Policies",
      description: "Manage password complexity, expiration, and history requirements",
      icon: Lock,
      route: "/security/password-policies",
      status: "configured",
      items: ["Minimum length: 8 characters", "Complexity requirements", "90-day expiration"]
    },
    {
      title: "Session Management",
      description: "Control user session timeouts, concurrent sessions, and device management",
      icon: Clock,
      route: "/security/sessions",
      status: "attention",
      items: ["Session timeout: 30 minutes", "Max concurrent sessions: 3", "Device tracking enabled"]
    },
    {
      title: "Threat Detection",
      description: "Monitor and respond to suspicious activities and security threats",
      icon: AlertTriangle,
      route: "/security/threats",
      status: "active",
      items: ["Brute force protection", "Anomaly detection", "Real-time alerts"]
    },

    {
      title: "IP Restrictions",
      description: "Configure IP allowlists, blocklists, and geographic restrictions",
      icon: Ban,
      route: "/security/ip-restrictions",
      status: "not-configured",
      items: ["IP allowlist", "Geographic restrictions", "VPN detection"]
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "configured":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Configured
          </Badge>
        )
      case "attention":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertCircle className="mr-1 h-3 w-3" />
            Needs Attention
          </Badge>
        )
      case "active":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            <Shield className="mr-1 h-3 w-3" />
            Active
          </Badge>
        )
      case "not-configured":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">
            <XCircle className="mr-1 h-3 w-3" />
            Not Configured
          </Badge>
        )
      default:
        return null
    }
  }

  const handleNavigate = (route: string) => {
    navigate(`/c/${containerId}${route}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Security Center</h1>
        <p className="text-muted-foreground">
          Manage security settings, policies, and monitoring to protect your authentication system and user data.
        </p>
      </div>

      {/* Security Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {securityModules.map((module) => {
          const IconComponent = module.icon
          return (
            <Card key={module.route} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      {getStatusBadge(module.status)}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription className="text-sm">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {module.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1 w-1 bg-muted-foreground rounded-full" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => handleNavigate(module.route)}
                >
                  Configure
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Quick Security Actions
          </CardTitle>
          <CardDescription>
            Common security tasks and emergency actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" size="sm" onClick={() => handleNavigate("/security/settings")}>
              <Eye className="mr-2 h-4 w-4" />
              Security Settings
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleNavigate("/security/sessions")}>
              <Clock className="mr-2 h-4 w-4" />
              Active Sessions
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleNavigate("/security/threats")}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Threat Alerts
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleNavigate("/security/ip-restrictions")}>
              <Ban className="mr-2 h-4 w-4" />
              IP Management
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
