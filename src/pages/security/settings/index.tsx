import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Shield,
  Lock,
  Smartphone,
  Mail,
  Clock,
  AlertTriangle,
  CheckCircle,
  Save,
  Database,
  FileText,
  Settings
} from "lucide-react"
import * as React from "react"

export default function SecuritySettingsPage() {
  const [settings, setSettings] = React.useState({
    mfaRequired: true,
    mfaMethods: ["authenticator", "sms"],
    passwordlessLogin: false,
    socialLoginEnabled: true,
    accountLockoutEnabled: true,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    sessionTimeout: 30,
    requireEmailVerification: true,
    allowPasswordReset: true,
    securityNotifications: true,
    suspiciousActivityAlerts: true,
    // Data Protection
    encryptionAtRest: true,
    encryptionInTransit: true,
    dataRetentionDays: 365,
    automaticBackups: true,
    backupEncryption: true,
    // Compliance
    complianceMode: "standard",
    // Advanced Security
    deviceTrustEnabled: false,
    geoLocationTracking: true,
    anonymousAnalytics: true
  })

  const handleSave = () => {
    console.log("Saving security settings:", settings)
    // Here you would typically make an API call to save the settings
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Security Settings</h1>
          <p className="text-muted-foreground">
            Configure global security settings and authentication requirements for your application.
          </p>
        </div>

        <div className="grid gap-6">
        {/* Multi-Factor Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Multi-Factor Authentication
            </CardTitle>
            <CardDescription>
              Require additional verification methods for enhanced security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Require MFA for all users</Label>
                <div className="text-sm text-muted-foreground">
                  Force all users to set up multi-factor authentication
                </div>
              </div>
              <Switch
                checked={settings.mfaRequired}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, mfaRequired: checked }))}
              />
            </div>

            {settings.mfaRequired && (
              <div className="space-y-3 pl-4 border-l-2 border-muted">
                <Label className="text-sm font-medium">Available MFA Methods</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="authenticator"
                      checked={settings.mfaMethods.includes("authenticator")}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...settings.mfaMethods, "authenticator"]
                          : settings.mfaMethods.filter(m => m !== "authenticator")
                        setSettings(prev => ({ ...prev, mfaMethods: methods }))
                      }}
                      className="rounded"
                    />
                    <Label htmlFor="authenticator" className="text-sm">Authenticator App (TOTP)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sms"
                      checked={settings.mfaMethods.includes("sms")}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...settings.mfaMethods, "sms"]
                          : settings.mfaMethods.filter(m => m !== "sms")
                        setSettings(prev => ({ ...prev, mfaMethods: methods }))
                      }}
                      className="rounded"
                    />
                    <Label htmlFor="sms" className="text-sm">SMS Text Message</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="email"
                      checked={settings.mfaMethods.includes("email")}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...settings.mfaMethods, "email"]
                          : settings.mfaMethods.filter(m => m !== "email")
                        setSettings(prev => ({ ...prev, mfaMethods: methods }))
                      }}
                      className="rounded"
                    />
                    <Label htmlFor="email" className="text-sm">Email Verification</Label>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Login Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Login Security
            </CardTitle>
            <CardDescription>
              Configure login methods and security measures
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Enable passwordless login</Label>
                  <div className="text-xs text-muted-foreground">Magic links or biometrics</div>
                </div>
                <Switch
                  checked={settings.passwordlessLogin}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, passwordlessLogin: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Enable social login</Label>
                  <div className="text-xs text-muted-foreground">Google, GitHub, etc.</div>
                </div>
                <Switch
                  checked={settings.socialLoginEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, socialLoginEnabled: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Require email verification</Label>
                  <div className="text-xs text-muted-foreground">Verify email before access</div>
                </div>
                <Switch
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireEmailVerification: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Allow password reset</Label>
                  <div className="text-xs text-muted-foreground">Reset passwords via email</div>
                </div>
                <Switch
                  checked={settings.allowPasswordReset}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowPasswordReset: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Protection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Protection
            </CardTitle>
            <CardDescription>
              Protect against brute force attacks and unauthorized access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Enable account lockout</Label>
                <div className="text-sm text-muted-foreground">
                  Temporarily lock accounts after failed login attempts
                </div>
              </div>
              <Switch
                checked={settings.accountLockoutEnabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, accountLockoutEnabled: checked }))}
              />
            </div>

            {settings.accountLockoutEnabled && (
              <div className="grid gap-4 pl-4 border-l-2 border-muted">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="maxAttempts" className="text-sm font-medium">
                      Maximum login attempts
                    </Label>
                    <Select
                      value={settings.maxLoginAttempts.toString()}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                        <SelectItem value="10">10 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="lockoutDuration" className="text-sm font-medium">
                      Lockout duration (minutes)
                    </Label>
                    <Select
                      value={settings.lockoutDuration.toString()}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, lockoutDuration: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="1440">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Session Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Session Management
            </CardTitle>
            <CardDescription>
              Control user session behavior and timeouts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="sessionTimeout" className="text-sm font-medium">
                Session timeout (minutes)
              </Label>
              <Select
                value={settings.sessionTimeout.toString()}
                onValueChange={(value) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(value) }))}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                Users will be automatically logged out after this period of inactivity
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Data Protection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Protection
            </CardTitle>
            <CardDescription>
              Configure encryption and data retention policies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Encryption at rest</Label>
                <div className="text-sm text-muted-foreground">
                  Encrypt stored data using AES-256 encryption
                </div>
              </div>
              <Switch
                checked={settings.encryptionAtRest}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, encryptionAtRest: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Encryption in transit</Label>
                <div className="text-sm text-muted-foreground">
                  Enforce TLS 1.3 for all data transmission
                </div>
              </div>
              <Switch
                checked={settings.encryptionInTransit}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, encryptionInTransit: checked }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dataRetention" className="text-sm font-medium">
                Data retention period (days)
              </Label>
              <Select
                value={settings.dataRetentionDays.toString()}
                onValueChange={(value) => setSettings(prev => ({ ...prev, dataRetentionDays: parseInt(value) }))}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="1095">3 years</SelectItem>
                  <SelectItem value="2555">7 years</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                Automatically delete user data and logs after this period
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Automatic backups</Label>
                <div className="text-sm text-muted-foreground">
                  Create encrypted backups of critical data daily
                </div>
              </div>
              <Switch
                checked={settings.automaticBackups}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, automaticBackups: checked }))}
              />
            </div>

            {settings.automaticBackups && (
              <div className="flex items-center justify-between pl-4 border-l-2 border-muted">
                <div className="space-y-0.5">
                  <Label className="text-base">Backup encryption</Label>
                  <div className="text-sm text-muted-foreground">
                    Encrypt backup files with separate encryption keys
                  </div>
                </div>
                <Switch
                  checked={settings.backupEncryption}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, backupEncryption: checked }))}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Compliance
            </CardTitle>
            <CardDescription>
              Configure compliance framework and global security standards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="complianceMode" className="text-sm font-medium">
                Compliance mode
              </Label>
              <Select
                value={settings.complianceMode}
                onValueChange={(value) => setSettings(prev => ({ ...prev, complianceMode: value }))}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="gdpr">GDPR Compliant</SelectItem>
                  <SelectItem value="hipaa">HIPAA Compliant</SelectItem>
                  <SelectItem value="sox">SOX Compliant</SelectItem>
                  <SelectItem value="pci">PCI DSS Compliant</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                Select the compliance framework that applies to your organization
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Advanced Security
            </CardTitle>
            <CardDescription>
              Additional security monitoring and tracking capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Device trust</Label>
                  <div className="text-xs text-muted-foreground">Track and manage trusted devices</div>
                </div>
                <Switch
                  checked={settings.deviceTrustEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, deviceTrustEnabled: checked }))}
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
                  <Label className="text-sm">Anonymous analytics</Label>
                  <div className="text-xs text-muted-foreground">Collect anonymized usage data</div>
                </div>
                <Switch
                  checked={settings.anonymousAnalytics}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, anonymousAnalytics: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Security Notifications
            </CardTitle>
            <CardDescription>
              Configure when to send security-related notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Security notifications</Label>
                  <div className="text-xs text-muted-foreground">Email notifications for security events</div>
                </div>
                <Switch
                  checked={settings.securityNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, securityNotifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Suspicious activity alerts</Label>
                  <div className="text-xs text-muted-foreground">Alert about unusual login patterns</div>
                </div>
                <Switch
                  checked={settings.suspiciousActivityAlerts}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, suspiciousActivityAlerts: checked }))}
                />
              </div>
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
