import React from "react"
import { Shield, Lock, Key, AlertTriangle, CheckCircle, Eye, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { Container } from "../../components/ContainerColumns"

interface ContainerSecurityProps {
  container: Container
}

export function ContainerSecurity({ container }: ContainerSecurityProps) {
  const [securitySettings, setSecuritySettings] = React.useState({
    twoFactorRequired: true,
    passwordComplexity: true,
    sessionTimeout: true,
    ipWhitelisting: false,
    auditLogging: true,
    bruteForceProtection: true,
  })

  // Mock security data
  const securityMetrics = {
    securityScore: 85,
    lastSecurityScan: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    vulnerabilities: {
      critical: 0,
      high: 1,
      medium: 3,
      low: 5
    },
    recentThreats: [
      {
        id: 1,
        type: "Brute Force Attack",
        severity: "high",
        blocked: true,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        source: "192.168.1.100"
      },
      {
        id: 2,
        type: "Suspicious Login",
        severity: "medium",
        blocked: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        source: "10.0.0.50"
      },
      {
        id: 3,
        type: "Password Spray",
        severity: "high",
        blocked: true,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        source: "203.0.113.0"
      }
    ]
  }

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      critical: { label: "Critical", className: "bg-red-100 text-red-800 border-red-200" },
      high: { label: "High", className: "bg-orange-100 text-orange-800 border-orange-200" },
      medium: { label: "Medium", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      low: { label: "Low", className: "bg-blue-100 text-blue-800 border-blue-200" },
    }
    
    const config = severityConfig[severity as keyof typeof severityConfig] || severityConfig.low
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Score
            </CardTitle>
            <CardDescription>
              Overall security posture assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getSecurityScoreColor(securityMetrics.securityScore)}`}>
                {securityMetrics.securityScore}
              </div>
              <p className="text-sm text-muted-foreground">Security Score</p>
            </div>
            <Progress value={securityMetrics.securityScore} className="h-3" />
            <div className="text-xs text-muted-foreground text-center">
              Last scan: {securityMetrics.lastSecurityScan.toLocaleDateString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Vulnerabilities
            </CardTitle>
            <CardDescription>
              Security issues requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{securityMetrics.vulnerabilities.critical}</div>
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{securityMetrics.vulnerabilities.high}</div>
                <p className="text-xs text-muted-foreground">High</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{securityMetrics.vulnerabilities.medium}</div>
                <p className="text-xs text-muted-foreground">Medium</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{securityMetrics.vulnerabilities.low}</div>
                <p className="text-xs text-muted-foreground">Low</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Security Configuration
          </CardTitle>
          <CardDescription>
            Configure security policies and requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                <div className="text-xs text-muted-foreground">Require 2FA for all users</div>
              </div>
              <Switch
                checked={securitySettings.twoFactorRequired}
                onCheckedChange={(checked) => 
                  setSecuritySettings(prev => ({ ...prev, twoFactorRequired: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Password Complexity</Label>
                <div className="text-xs text-muted-foreground">Enforce strong password rules</div>
              </div>
              <Switch
                checked={securitySettings.passwordComplexity}
                onCheckedChange={(checked) => 
                  setSecuritySettings(prev => ({ ...prev, passwordComplexity: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Session Timeout</Label>
                <div className="text-xs text-muted-foreground">Auto-logout inactive sessions</div>
              </div>
              <Switch
                checked={securitySettings.sessionTimeout}
                onCheckedChange={(checked) => 
                  setSecuritySettings(prev => ({ ...prev, sessionTimeout: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">IP Whitelisting</Label>
                <div className="text-xs text-muted-foreground">Restrict access by IP address</div>
              </div>
              <Switch
                checked={securitySettings.ipWhitelisting}
                onCheckedChange={(checked) => 
                  setSecuritySettings(prev => ({ ...prev, ipWhitelisting: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Audit Logging</Label>
                <div className="text-xs text-muted-foreground">Log all security events</div>
              </div>
              <Switch
                checked={securitySettings.auditLogging}
                onCheckedChange={(checked) => 
                  setSecuritySettings(prev => ({ ...prev, auditLogging: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Brute Force Protection</Label>
                <div className="text-xs text-muted-foreground">Block repeated failed attempts</div>
              </div>
              <Switch
                checked={securitySettings.bruteForceProtection}
                onCheckedChange={(checked) => 
                  setSecuritySettings(prev => ({ ...prev, bruteForceProtection: checked }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Recent Security Events
              </CardTitle>
              <CardDescription>
                Latest security threats and incidents
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityMetrics.recentThreats.map((threat) => (
              <div key={threat.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {threat.blocked ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  )}
                  <div>
                    <div className="font-medium">{threat.type}</div>
                    <div className="text-sm text-muted-foreground">
                      From {threat.source} • {threat.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getSeverityBadge(threat.severity)}
                  <Badge variant={threat.blocked ? "default" : "destructive"}>
                    {threat.blocked ? "Blocked" : "Allowed"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enabled Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security Features
          </CardTitle>
          <CardDescription>
            Active security capabilities for this container
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {container.features
              .filter(feature => ['SSO', '2FA', 'RBAC', 'Audit Logs'].includes(feature))
              .map((feature) => (
                <Badge key={feature} variant="secondary" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {feature}
                </Badge>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
