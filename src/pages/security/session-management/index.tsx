import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Clock, Shield, Monitor, Smartphone, Save, AlertTriangle, Users, Globe } from "lucide-react"

export default function SessionManagementPage() {
  const [settings, setSettings] = React.useState({
    // Session Timeouts
    sessionTimeout: 30,
    idleTimeout: 15,
    absoluteTimeout: 480,
    rememberMeEnabled: true,
    rememberMeDuration: 30,
    
    // Session Security
    concurrentSessionsEnabled: true,
    maxConcurrentSessions: 3,
    sessionBindingEnabled: true,
    ipBindingEnabled: false,
    deviceBindingEnabled: true,
    
    // Session Monitoring
    sessionLoggingEnabled: true,
    suspiciousSessionDetection: true,
    geoLocationTracking: true,
    deviceFingerprintingEnabled: true,
    
    // Session Termination
    forceLogoutOnPasswordChange: true,
    forceLogoutOnRoleChange: true,
    adminCanTerminateSessions: true,
    userCanViewActiveSessions: true,
    
    // Advanced Settings
    sessionTokenRotation: true,
    tokenRotationInterval: 60,
    secureSessionCookies: true,
    sameSiteCookies: "strict"
  })

  const handleSave = () => {
    console.log("Saving session management settings:", settings)
    // TODO: Implement save functionality
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Session Management</h1>
          <p className="text-muted-foreground">
            Configure user session timeouts, security policies, and monitoring to protect against unauthorized access.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Session Timeouts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Session Timeouts
              </CardTitle>
              <CardDescription>
                Configure automatic session expiration and timeout policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="sessionTimeout" className="text-sm font-medium">
                    Session timeout (minutes)
                  </Label>
                  <Select
                    value={settings.sessionTimeout.toString()}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="idleTimeout" className="text-sm font-medium">
                    Idle timeout (minutes)
                  </Label>
                  <Select
                    value={settings.idleTimeout.toString()}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, idleTimeout: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="absoluteTimeout" className="text-sm font-medium">
                    Absolute timeout (minutes)
                  </Label>
                  <Select
                    value={settings.absoluteTimeout.toString()}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, absoluteTimeout: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="240">4 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                      <SelectItem value="720">12 hours</SelectItem>
                      <SelectItem value="1440">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="rememberMeDuration" className="text-sm font-medium">
                    Remember me duration (days)
                  </Label>
                  <Select
                    value={settings.rememberMeDuration.toString()}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, rememberMeDuration: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Enable "Remember Me" option</Label>
                  <div className="text-xs text-muted-foreground">Allow users to stay logged in longer</div>
                </div>
                <Switch
                  checked={settings.rememberMeEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, rememberMeEnabled: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Session Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Session Security
              </CardTitle>
              <CardDescription>
                Configure session binding and concurrent session policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Limit concurrent sessions</Label>
                    <div className="text-xs text-muted-foreground">Restrict multiple logins</div>
                  </div>
                  <Switch
                    checked={settings.concurrentSessionsEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, concurrentSessionsEnabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Session binding</Label>
                    <div className="text-xs text-muted-foreground">Bind sessions to browser</div>
                  </div>
                  <Switch
                    checked={settings.sessionBindingEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sessionBindingEnabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">IP address binding</Label>
                    <div className="text-xs text-muted-foreground">Bind sessions to IP</div>
                  </div>
                  <Switch
                    checked={settings.ipBindingEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, ipBindingEnabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Device binding</Label>
                    <div className="text-xs text-muted-foreground">Bind sessions to device</div>
                  </div>
                  <Switch
                    checked={settings.deviceBindingEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, deviceBindingEnabled: checked }))}
                  />
                </div>
              </div>

              {settings.concurrentSessionsEnabled && (
                <div className="grid gap-2 pl-4 border-l-2 border-muted">
                  <Label htmlFor="maxConcurrentSessions" className="text-sm font-medium">
                    Maximum concurrent sessions
                  </Label>
                  <Select
                    value={settings.maxConcurrentSessions.toString()}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, maxConcurrentSessions: parseInt(value) }))}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 session</SelectItem>
                      <SelectItem value="2">2 sessions</SelectItem>
                      <SelectItem value="3">3 sessions</SelectItem>
                      <SelectItem value="5">5 sessions</SelectItem>
                      <SelectItem value="10">10 sessions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Session Monitoring
              </CardTitle>
              <CardDescription>
                Configure session tracking and suspicious activity detection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Session logging</Label>
                    <div className="text-xs text-muted-foreground">Log session events</div>
                  </div>
                  <Switch
                    checked={settings.sessionLoggingEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sessionLoggingEnabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Suspicious session detection</Label>
                    <div className="text-xs text-muted-foreground">Detect unusual patterns</div>
                  </div>
                  <Switch
                    checked={settings.suspiciousSessionDetection}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, suspiciousSessionDetection: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Geo-location tracking</Label>
                    <div className="text-xs text-muted-foreground">Track login locations</div>
                  </div>
                  <Switch
                    checked={settings.geoLocationTracking}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, geoLocationTracking: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Device fingerprinting</Label>
                    <div className="text-xs text-muted-foreground">Track device characteristics</div>
                  </div>
                  <Switch
                    checked={settings.deviceFingerprintingEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, deviceFingerprintingEnabled: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Termination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Session Termination
              </CardTitle>
              <CardDescription>
                Configure automatic session termination and user session management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Force logout on password change</Label>
                    <div className="text-xs text-muted-foreground">End all sessions when password changes</div>
                  </div>
                  <Switch
                    checked={settings.forceLogoutOnPasswordChange}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, forceLogoutOnPasswordChange: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Force logout on role change</Label>
                    <div className="text-xs text-muted-foreground">End sessions when permissions change</div>
                  </div>
                  <Switch
                    checked={settings.forceLogoutOnRoleChange}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, forceLogoutOnRoleChange: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Admin can terminate sessions</Label>
                    <div className="text-xs text-muted-foreground">Allow admins to end user sessions</div>
                  </div>
                  <Switch
                    checked={settings.adminCanTerminateSessions}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, adminCanTerminateSessions: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Users can view active sessions</Label>
                    <div className="text-xs text-muted-foreground">Show users their active sessions</div>
                  </div>
                  <Switch
                    checked={settings.userCanViewActiveSessions}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, userCanViewActiveSessions: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Advanced Settings
              </CardTitle>
              <CardDescription>
                Configure session token rotation and cookie security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Session token rotation</Label>
                    <div className="text-xs text-muted-foreground">Rotate tokens periodically</div>
                  </div>
                  <Switch
                    checked={settings.sessionTokenRotation}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sessionTokenRotation: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Secure session cookies</Label>
                    <div className="text-xs text-muted-foreground">Use secure cookie flags</div>
                  </div>
                  <Switch
                    checked={settings.secureSessionCookies}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, secureSessionCookies: checked }))}
                  />
                </div>
              </div>

              {settings.sessionTokenRotation && (
                <div className="grid gap-4 pl-4 border-l-2 border-muted sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="tokenRotationInterval" className="text-sm font-medium">
                      Token rotation interval (minutes)
                    </Label>
                    <Select
                      value={settings.tokenRotationInterval.toString()}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, tokenRotationInterval: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="sameSiteCookies" className="text-sm font-medium">
                      SameSite cookie policy
                    </Label>
                    <Select
                      value={settings.sameSiteCookies}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, sameSiteCookies: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strict">Strict</SelectItem>
                        <SelectItem value="lax">Lax</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Session Statistics
              </CardTitle>
              <CardDescription>
                Current session activity and security metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold">1,247</div>
                  <div className="text-sm text-muted-foreground">Active Sessions</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">23</div>
                  <div className="text-sm text-muted-foreground">Suspicious Sessions</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-sm text-muted-foreground">Sessions Today</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">4.2m</div>
                  <div className="text-sm text-muted-foreground">Avg Session Duration</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Monitor className="h-3 w-3" />
                  Desktop: 892
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  Mobile: 355
                </Badge>
                <Badge variant="secondary">
                  Peak: 1,456 sessions
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
    </div>
  )
}
