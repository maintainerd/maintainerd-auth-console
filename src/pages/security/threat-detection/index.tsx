import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { DetailsContainer } from "@/components/container"
import { AlertTriangle, Shield, Eye, Bot, Globe, Activity, Save, TrendingUp, Clock, Users } from "lucide-react"

export default function ThreatDetectionPage() {
  const [settings, setSettings] = React.useState({
    // Brute Force Protection (includes account lockout)
    bruteForceEnabled: true,
    maxFailedAttempts: 5,
    bruteForceWindow: 15,
    accountLockoutDuration: 30,
    
    // Anomaly Detection
    anomalyDetectionEnabled: true,
    behaviorAnalysis: true,
    velocityChecking: true,
    geoAnomalyDetection: true,
    deviceAnomalyDetection: true,
    
    // Bot Protection
    botProtectionEnabled: true,
    captchaEnabled: true,
    userAgentFiltering: true,
    honeypotEnabled: false,
    
    // Real-time Monitoring
    realTimeAlertsEnabled: true,
    suspiciousActivityThreshold: "medium",
    autoBlockSuspiciousIPs: false,
    alertAdminsEnabled: true,
    logSuspiciousActivity: true,
    
    // Machine Learning
    mlThreatDetection: true,
    adaptiveLearning: true,
    riskScoring: true,
    behaviorBaselines: true,
    
    // Response Actions
    autoResponseEnabled: true,
    escalationEnabled: true,
    quarantineEnabled: false,
    notificationChannels: ["email", "webhook"]
  })

  const handleSave = () => {
    console.log("Saving threat detection settings:", settings)
    // TODO: Implement save functionality
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Threat Detection</h1>
          <p className="text-muted-foreground">
            Configure advanced threat detection, anomaly monitoring, and automated response systems to protect against security attacks.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Brute Force Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Brute Force Protection
              </CardTitle>
              <CardDescription>
                Detect and prevent brute force attacks on login endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Enable brute force protection</Label>
                  <div className="text-xs text-muted-foreground">Monitor and block repeated failed login attempts</div>
                </div>
                <Switch
                  checked={settings.bruteForceEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, bruteForceEnabled: checked }))}
                />
              </div>

              {settings.bruteForceEnabled && (
                <div className="grid gap-4 pl-4 border-l-2 border-muted sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="maxFailedAttempts" className="text-sm font-medium">
                      Max failed attempts
                    </Label>
                    <Select
                      value={settings.maxFailedAttempts.toString()}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, maxFailedAttempts: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                        <SelectItem value="10">10 attempts</SelectItem>
                        <SelectItem value="15">15 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bruteForceWindow" className="text-sm font-medium">
                      Detection window (minutes)
                    </Label>
                    <Select
                      value={settings.bruteForceWindow.toString()}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, bruteForceWindow: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bruteForceBlockDuration" className="text-sm font-medium">
                      Account lockout duration (minutes)
                    </Label>
                    <Select
                      value={settings.accountLockoutDuration.toString()}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, accountLockoutDuration: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="1440">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Anomaly Detection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Anomaly Detection
              </CardTitle>
              <CardDescription>
                Identify unusual user behavior and suspicious activity patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Enable anomaly detection</Label>
                  <div className="text-xs text-muted-foreground">Monitor for unusual behavior patterns</div>
                </div>
                <Switch
                  checked={settings.anomalyDetectionEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, anomalyDetectionEnabled: checked }))}
                />
              </div>

              {settings.anomalyDetectionEnabled && (
                <div className="grid gap-3 pl-4 border-l-2 border-muted sm:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Behavior analysis</Label>
                      <div className="text-xs text-muted-foreground">Analyze user behavior patterns</div>
                    </div>
                    <Switch
                      checked={settings.behaviorAnalysis}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, behaviorAnalysis: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Velocity checking</Label>
                      <div className="text-xs text-muted-foreground">Detect rapid successive actions</div>
                    </div>
                    <Switch
                      checked={settings.velocityChecking}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, velocityChecking: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Geo-location anomalies</Label>
                      <div className="text-xs text-muted-foreground">Detect impossible travel patterns</div>
                    </div>
                    <Switch
                      checked={settings.geoAnomalyDetection}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, geoAnomalyDetection: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Device anomalies</Label>
                      <div className="text-xs text-muted-foreground">Detect unusual device patterns</div>
                    </div>
                    <Switch
                      checked={settings.deviceAnomalyDetection}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, deviceAnomalyDetection: checked }))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bot Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Bot Protection
              </CardTitle>
              <CardDescription>
                Detect and block automated attacks and bot traffic
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Enable bot protection</Label>
                  <div className="text-xs text-muted-foreground">Protect against automated attacks</div>
                </div>
                <Switch
                  checked={settings.botProtectionEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, botProtectionEnabled: checked }))}
                />
              </div>

              {settings.botProtectionEnabled && (
                <div className="grid gap-3 pl-4 border-l-2 border-muted sm:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">CAPTCHA challenges</Label>
                      <div className="text-xs text-muted-foreground">Challenge suspicious requests</div>
                    </div>
                    <Switch
                      checked={settings.captchaEnabled}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, captchaEnabled: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">User agent filtering</Label>
                      <div className="text-xs text-muted-foreground">Block suspicious user agents</div>
                    </div>
                    <Switch
                      checked={settings.userAgentFiltering}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, userAgentFiltering: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Honeypot traps</Label>
                      <div className="text-xs text-muted-foreground">Deploy hidden form fields</div>
                    </div>
                    <Switch
                      checked={settings.honeypotEnabled}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, honeypotEnabled: checked }))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Real-time Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Real-time Monitoring
              </CardTitle>
              <CardDescription>
                Configure real-time threat monitoring and alert systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Real-time alerts</Label>
                    <div className="text-xs text-muted-foreground">Instant threat notifications</div>
                  </div>
                  <Switch
                    checked={settings.realTimeAlertsEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, realTimeAlertsEnabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Auto-block suspicious IPs</Label>
                    <div className="text-xs text-muted-foreground">Automatically block threat sources</div>
                  </div>
                  <Switch
                    checked={settings.autoBlockSuspiciousIPs}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoBlockSuspiciousIPs: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Alert administrators</Label>
                    <div className="text-xs text-muted-foreground">Notify admins of threats</div>
                  </div>
                  <Switch
                    checked={settings.alertAdminsEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, alertAdminsEnabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Log suspicious activity</Label>
                    <div className="text-xs text-muted-foreground">Record all threat events</div>
                  </div>
                  <Switch
                    checked={settings.logSuspiciousActivity}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, logSuspiciousActivity: checked }))}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="suspiciousActivityThreshold" className="text-sm font-medium">
                  Suspicious activity threshold
                </Label>
                <Select
                  value={settings.suspiciousActivityThreshold}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, suspiciousActivityThreshold: value }))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low sensitivity</SelectItem>
                    <SelectItem value="medium">Medium sensitivity</SelectItem>
                    <SelectItem value="high">High sensitivity</SelectItem>
                    <SelectItem value="critical">Critical only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Machine Learning */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Machine Learning
              </CardTitle>
              <CardDescription>
                Advanced AI-powered threat detection and behavioral analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">ML threat detection</Label>
                    <div className="text-xs text-muted-foreground">AI-powered threat identification</div>
                  </div>
                  <Switch
                    checked={settings.mlThreatDetection}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, mlThreatDetection: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Adaptive learning</Label>
                    <div className="text-xs text-muted-foreground">Learn from new threat patterns</div>
                  </div>
                  <Switch
                    checked={settings.adaptiveLearning}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, adaptiveLearning: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Risk scoring</Label>
                    <div className="text-xs text-muted-foreground">Calculate threat risk scores</div>
                  </div>
                  <Switch
                    checked={settings.riskScoring}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, riskScoring: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Behavior baselines</Label>
                    <div className="text-xs text-muted-foreground">Establish normal behavior patterns</div>
                  </div>
                  <Switch
                    checked={settings.behaviorBaselines}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, behaviorBaselines: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Response Actions
              </CardTitle>
              <CardDescription>
                Configure automated responses and escalation procedures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Auto-response</Label>
                    <div className="text-xs text-muted-foreground">Automatic threat responses</div>
                  </div>
                  <Switch
                    checked={settings.autoResponseEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoResponseEnabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Escalation procedures</Label>
                    <div className="text-xs text-muted-foreground">Escalate critical threats</div>
                  </div>
                  <Switch
                    checked={settings.escalationEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, escalationEnabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Quarantine mode</Label>
                    <div className="text-xs text-muted-foreground">Isolate suspicious accounts</div>
                  </div>
                  <Switch
                    checked={settings.quarantineEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, quarantineEnabled: checked }))}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-sm font-medium">Notification channels</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={settings.notificationChannels.includes("email") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const channels = settings.notificationChannels.includes("email")
                        ? settings.notificationChannels.filter(c => c !== "email")
                        : [...settings.notificationChannels, "email"]
                      setSettings(prev => ({ ...prev, notificationChannels: channels }))
                    }}
                  >
                    Email
                  </Badge>
                  <Badge
                    variant={settings.notificationChannels.includes("sms") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const channels = settings.notificationChannels.includes("sms")
                        ? settings.notificationChannels.filter(c => c !== "sms")
                        : [...settings.notificationChannels, "sms"]
                      setSettings(prev => ({ ...prev, notificationChannels: channels }))
                    }}
                  >
                    SMS
                  </Badge>
                  <Badge
                    variant={settings.notificationChannels.includes("webhook") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const channels = settings.notificationChannels.includes("webhook")
                        ? settings.notificationChannels.filter(c => c !== "webhook")
                        : [...settings.notificationChannels, "webhook"]
                      setSettings(prev => ({ ...prev, notificationChannels: channels }))
                    }}
                  >
                    Webhook
                  </Badge>
                  <Badge
                    variant={settings.notificationChannels.includes("slack") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const channels = settings.notificationChannels.includes("slack")
                        ? settings.notificationChannels.filter(c => c !== "slack")
                        : [...settings.notificationChannels, "slack"]
                      setSettings(prev => ({ ...prev, notificationChannels: channels }))
                    }}
                  >
                    Slack
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Threat Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Threat Statistics
              </CardTitle>
              <CardDescription>
                Current threat landscape and detection metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-red-600">47</div>
                  <div className="text-sm text-muted-foreground">Threats Blocked Today</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-600">12</div>
                  <div className="text-sm text-muted-foreground">Active Investigations</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-yellow-600">156</div>
                  <div className="text-sm text-muted-foreground">Suspicious IPs</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">99.2%</div>
                  <div className="text-sm text-muted-foreground">Detection Accuracy</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Critical: 3
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  High: 8
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Medium: 36
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="min-w-[140px] px-6">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </DetailsContainer>
  )
}
