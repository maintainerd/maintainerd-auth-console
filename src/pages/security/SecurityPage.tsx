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
  const { tenantId } = useParams()

  const securityModules = [
    {
      title: "Password Policy",
      description: "Configure password length, complexity, breach checks, history, expiry, and hashing algorithm",
      icon: Lock,
      route: "/security/password",
      status: "configured",
      items: ["Min length: 12 chars", "HIBP breach screening", "Argon2id hashing"]
    },
    {
      title: "Multi-Factor Auth",
      description: "Configure MFA enforcement mode, allowed methods, TOTP parameters, and trusted devices",
      icon: Shield,
      route: "/security/mfa",
      status: "configured",
      items: ["TOTP, WebAuthn, recovery codes", "Trusted device period", "Sensitive action step-up"]
    },
    {
      title: "Sessions",
      description: "Configure token lifetimes, idle/absolute timeouts, concurrency, refresh rotation, and cookie flags",
      icon: Clock,
      route: "/security/session",
      status: "attention",
      items: ["Access token TTL: 15 min", "Refresh token TTL: 30 days", "Max concurrent: 5"]
    },
    {
      title: "Token Configuration",
      description: "Configure JWT signing algorithm, clock skew, additional claims, and PKCE requirement",
      icon: Key,
      route: "/security/token",
      status: "configured",
      items: ["RS256 signing", "30s clock skew", "PKCE required"]
    },
    {
      title: "Account Lockout",
      description: "Configure failed-login lockout, progressive escalation, auto-unlock, and notifications",
      icon: Ban,
      route: "/security/lockout",
      status: "configured",
      items: ["5 max attempts", "30-min lockout", "Progressive escalation"]
    },
    {
      title: "Registration",
      description: "Configure self-registration, email/phone verification, domain allow/block, captcha, and default role",
      icon: CheckCircle,
      route: "/security/registration",
      status: "configured",
      items: ["Self-registration enabled", "Email verification required", "CAPTCHA on signup"]
    },
    {
      title: "Threat Detection",
      description: "Configure brute-force detection, velocity checks, risk-based step-up, and compromised credential monitoring",
      icon: AlertTriangle,
      route: "/security/threat",
      status: "active",
      items: ["Brute force protection", "Velocity checking", "Compromised credential monitoring"]
    },
    {
      title: "IP Restrictions",
      description: "Configure IP allow/deny rules, rate limiting, and geographic blocking",
      icon: Ban,
      route: "/security/ip-restrictions",
      status: "not-configured",
      items: ["IP allow/deny rules", "Rate limiting", "Geo-blocking"]
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
    navigate(`/${tenantId}${route}`)
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
            <Button variant="outline" size="sm" onClick={() => handleNavigate("/security/mfa")}>
              <Eye className="mr-2 h-4 w-4" />
              MFA Settings
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleNavigate("/security/session")}>
              <Clock className="mr-2 h-4 w-4" />
              Active Sessions
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleNavigate("/security/threat")}>
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
