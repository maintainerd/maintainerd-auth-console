import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Lock,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Save,
  History,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react"
import * as React from "react"

export default function PasswordPoliciesPage() {
  const [policies, setPolicies] = React.useState({
    // Basic Requirements
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    allowedSpecialChars: "!@#$%^&*()_+-=[]{}|;:,.<>?",

    // Advanced Requirements
    preventCommonPasswords: true,
    preventUserInfoInPassword: true,
    preventSequentialChars: true,
    preventRepeatingChars: true,
    maxRepeatingChars: 3,

    // Expiration & History
    passwordExpiration: true,
    expirationDays: 90,
    expirationWarningDays: 14,
    passwordHistory: true,
    historyCount: 12,

    // Reset & Recovery
    allowSelfReset: true,
    resetTokenExpiry: 24,
    maxResetAttempts: 3,
    resetCooldown: 15,

    // Strength Requirements
    minimumStrengthScore: 3,
    showStrengthMeter: true,
    blockWeakPasswords: true
  })

  const [showPreview, setShowPreview] = React.useState(false)

  const handleSave = () => {
    console.log("Saving password policies:", policies)
    // Here you would typically make an API call to save the policies
  }

  const getStrengthLabel = (score: number) => {
    switch (score) {
      case 1: return { label: "Very Weak", color: "destructive" }
      case 2: return { label: "Weak", color: "destructive" }
      case 3: return { label: "Fair", color: "secondary" }
      case 4: return { label: "Good", color: "default" }
      case 5: return { label: "Strong", color: "default" }
      default: return { label: "Unknown", color: "secondary" }
    }
  }

  const generatePasswordExample = () => {
    // Simple example generator based on current policies
    let example = ""
    if (policies.requireUppercase) example += "A"
    if (policies.requireLowercase) example += "b"
    if (policies.requireNumbers) example += "1"
    if (policies.requireSpecialChars) example += "!"

    const remaining = policies.minLength - example.length
    for (let i = 0; i < remaining; i++) {
      example += "x"
    }

    return example + "2024"
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Password Policies</h1>
          <p className="text-muted-foreground">
            Configure password complexity, expiration, and history requirements to ensure strong user authentication security.
          </p>
        </div>

        <div className="grid gap-6">
        {/* Basic Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Basic Requirements
            </CardTitle>
            <CardDescription>
              Set minimum password complexity and character requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="minLength" className="text-sm font-medium">
                  Minimum length
                </Label>
                <Select
                  value={policies.minLength.toString()}
                  onValueChange={(value) => setPolicies(prev => ({ ...prev, minLength: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 characters</SelectItem>
                    <SelectItem value="8">8 characters</SelectItem>
                    <SelectItem value="10">10 characters</SelectItem>
                    <SelectItem value="12">12 characters</SelectItem>
                    <SelectItem value="16">16 characters</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="maxLength" className="text-sm font-medium">
                  Maximum length
                </Label>
                <Select
                  value={policies.maxLength.toString()}
                  onValueChange={(value) => setPolicies(prev => ({ ...prev, maxLength: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="64">64 characters</SelectItem>
                    <SelectItem value="128">128 characters</SelectItem>
                    <SelectItem value="256">256 characters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Require uppercase letters</Label>
                  <div className="text-xs text-muted-foreground">At least one A-Z</div>
                </div>
                <Switch
                  checked={policies.requireUppercase}
                  onCheckedChange={(checked) => setPolicies(prev => ({ ...prev, requireUppercase: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Require lowercase letters</Label>
                  <div className="text-xs text-muted-foreground">At least one a-z</div>
                </div>
                <Switch
                  checked={policies.requireLowercase}
                  onCheckedChange={(checked) => setPolicies(prev => ({ ...prev, requireLowercase: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Require numbers</Label>
                  <div className="text-xs text-muted-foreground">At least one 0-9</div>
                </div>
                <Switch
                  checked={policies.requireNumbers}
                  onCheckedChange={(checked) => setPolicies(prev => ({ ...prev, requireNumbers: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Require special characters</Label>
                  <div className="text-xs text-muted-foreground">At least one symbol</div>
                </div>
                <Switch
                  checked={policies.requireSpecialChars}
                  onCheckedChange={(checked) => setPolicies(prev => ({ ...prev, requireSpecialChars: checked }))}
                />
              </div>
            </div>

            {policies.requireSpecialChars && (
              <div className="grid gap-2 pl-4 border-l-2 border-muted">
                <Label htmlFor="allowedSpecialChars" className="text-sm font-medium">
                  Allowed special characters
                </Label>
                <Input
                  id="allowedSpecialChars"
                  value={policies.allowedSpecialChars}
                  onChange={(e) => setPolicies(prev => ({ ...prev, allowedSpecialChars: e.target.value }))}
                  placeholder="!@#$%^&*()_+-=[]{}|;:,.<>?"
                />
                <div className="text-xs text-muted-foreground">
                  Specify which special characters are allowed in passwords
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Advanced Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Advanced Requirements
            </CardTitle>
            <CardDescription>
              Additional security measures to prevent weak passwords
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Prevent common passwords</Label>
                  <div className="text-xs text-muted-foreground">Block dictionary words</div>
                </div>
                <Switch
                  checked={policies.preventCommonPasswords}
                  onCheckedChange={(checked) => setPolicies(prev => ({ ...prev, preventCommonPasswords: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Prevent user info in password</Label>
                  <div className="text-xs text-muted-foreground">Block name, email parts</div>
                </div>
                <Switch
                  checked={policies.preventUserInfoInPassword}
                  onCheckedChange={(checked) => setPolicies(prev => ({ ...prev, preventUserInfoInPassword: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Prevent sequential characters</Label>
                  <div className="text-xs text-muted-foreground">Block abc, 123, qwerty</div>
                </div>
                <Switch
                  checked={policies.preventSequentialChars}
                  onCheckedChange={(checked) => setPolicies(prev => ({ ...prev, preventSequentialChars: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Prevent repeating characters</Label>
                  <div className="text-xs text-muted-foreground">Limit aaa, 111</div>
                </div>
                <Switch
                  checked={policies.preventRepeatingChars}
                  onCheckedChange={(checked) => setPolicies(prev => ({ ...prev, preventRepeatingChars: checked }))}
                />
              </div>
            </div>

            {policies.preventRepeatingChars && (
              <div className="grid gap-2 pl-4 border-l-2 border-muted">
                <Label htmlFor="maxRepeatingChars" className="text-sm font-medium">
                  Maximum repeating characters
                </Label>
                <Select
                  value={policies.maxRepeatingChars.toString()}
                  onValueChange={(value) => setPolicies(prev => ({ ...prev, maxRepeatingChars: parseInt(value) }))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 characters</SelectItem>
                    <SelectItem value="3">3 characters</SelectItem>
                    <SelectItem value="4">4 characters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expiration & History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Expiration & History
            </CardTitle>
            <CardDescription>
              Configure password expiration and history tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Enable password expiration</Label>
                <div className="text-sm text-muted-foreground">
                  Force users to change passwords periodically
                </div>
              </div>
              <Switch
                checked={policies.passwordExpiration}
                onCheckedChange={(checked) => setPolicies(prev => ({ ...prev, passwordExpiration: checked }))}
              />
            </div>

            {policies.passwordExpiration && (
              <div className="grid gap-4 pl-4 border-l-2 border-muted">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="expirationDays" className="text-sm font-medium">
                      Password expires after (days)
                    </Label>
                    <Select
                      value={policies.expirationDays.toString()}
                      onValueChange={(value) => setPolicies(prev => ({ ...prev, expirationDays: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="expirationWarningDays" className="text-sm font-medium">
                      Warning before expiration (days)
                    </Label>
                    <Select
                      value={policies.expirationWarningDays.toString()}
                      onValueChange={(value) => setPolicies(prev => ({ ...prev, expirationWarningDays: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="21">21 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Enable password history</Label>
                <div className="text-sm text-muted-foreground">
                  Prevent reuse of recent passwords
                </div>
              </div>
              <Switch
                checked={policies.passwordHistory}
                onCheckedChange={(checked) => setPolicies(prev => ({ ...prev, passwordHistory: checked }))}
              />
            </div>

            {policies.passwordHistory && (
              <div className="grid gap-2 pl-4 border-l-2 border-muted">
                <Label htmlFor="historyCount" className="text-sm font-medium">
                  Remember last passwords
                </Label>
                <Select
                  value={policies.historyCount.toString()}
                  onValueChange={(value) => setPolicies(prev => ({ ...prev, historyCount: parseInt(value) }))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 passwords</SelectItem>
                    <SelectItem value="10">10 passwords</SelectItem>
                    <SelectItem value="12">12 passwords</SelectItem>
                    <SelectItem value="24">24 passwords</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground">
                  Users cannot reuse any of their last {policies.historyCount} passwords
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reset & Recovery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Reset & Recovery
            </CardTitle>
            <CardDescription>
              Configure password reset and recovery options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Allow self-service password reset</Label>
                <div className="text-sm text-muted-foreground">
                  Users can reset their own passwords via email
                </div>
              </div>
              <Switch
                checked={policies.allowSelfReset}
                onCheckedChange={(checked) => setPolicies(prev => ({ ...prev, allowSelfReset: checked }))}
              />
            </div>

            {policies.allowSelfReset && (
              <div className="grid gap-4 pl-4 border-l-2 border-muted">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="resetTokenExpiry" className="text-sm font-medium">
                      Reset token expires after (hours)
                    </Label>
                    <Select
                      value={policies.resetTokenExpiry.toString()}
                      onValueChange={(value) => setPolicies(prev => ({ ...prev, resetTokenExpiry: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="6">6 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="72">72 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="maxResetAttempts" className="text-sm font-medium">
                      Maximum reset attempts per day
                    </Label>
                    <Select
                      value={policies.maxResetAttempts.toString()}
                      onValueChange={(value) => setPolicies(prev => ({ ...prev, maxResetAttempts: parseInt(value) }))}
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
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="resetCooldown" className="text-sm font-medium">
                    Cooldown between reset requests (minutes)
                  </Label>
                  <Select
                    value={policies.resetCooldown.toString()}
                    onValueChange={(value) => setPolicies(prev => ({ ...prev, resetCooldown: parseInt(value) }))}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Strength Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Strength Requirements
            </CardTitle>
            <CardDescription>
              Configure password strength validation and user feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="minimumStrengthScore" className="text-sm font-medium">
                Minimum strength score
              </Label>
              <Select
                value={policies.minimumStrengthScore.toString()}
                onValueChange={(value) => setPolicies(prev => ({ ...prev, minimumStrengthScore: parseInt(value) }))}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Very Weak</SelectItem>
                  <SelectItem value="2">2 - Weak</SelectItem>
                  <SelectItem value="3">3 - Fair</SelectItem>
                  <SelectItem value="4">4 - Good</SelectItem>
                  <SelectItem value="5">5 - Strong</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground">
                Current requirement: <Badge variant={getStrengthLabel(policies.minimumStrengthScore).color as any}>
                  {getStrengthLabel(policies.minimumStrengthScore).label}
                </Badge> or higher
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Show strength meter</Label>
                  <div className="text-xs text-muted-foreground">Display visual strength indicator</div>
                </div>
                <Switch
                  checked={policies.showStrengthMeter}
                  onCheckedChange={(checked) => setPolicies(prev => ({ ...prev, showStrengthMeter: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Block weak passwords</Label>
                  <div className="text-xs text-muted-foreground">Prevent submission of weak passwords</div>
                </div>
                <Switch
                  checked={policies.blockWeakPasswords}
                  onCheckedChange={(checked) => setPolicies(prev => ({ ...prev, blockWeakPasswords: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Policy Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {showPreview ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              Policy Preview
            </CardTitle>
            <CardDescription>
              Preview how these policies will appear to users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="w-full sm:w-auto"
            >
              {showPreview ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Show Preview
                </>
              )}
            </Button>

            {showPreview && (
              <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                <h4 className="font-medium">Password Requirements:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Must be between {policies.minLength} and {policies.maxLength} characters
                  </li>
                  {policies.requireUppercase && (
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Must contain at least one uppercase letter (A-Z)
                    </li>
                  )}
                  {policies.requireLowercase && (
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Must contain at least one lowercase letter (a-z)
                    </li>
                  )}
                  {policies.requireNumbers && (
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Must contain at least one number (0-9)
                    </li>
                  )}
                  {policies.requireSpecialChars && (
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Must contain at least one special character ({policies.allowedSpecialChars.slice(0, 10)}...)
                    </li>
                  )}
                  {policies.preventCommonPasswords && (
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      Cannot use common passwords or dictionary words
                    </li>
                  )}
                  {policies.passwordHistory && (
                    <li className="flex items-center gap-2">
                      <History className="h-4 w-4 text-blue-600" />
                      Cannot reuse any of your last {policies.historyCount} passwords
                    </li>
                  )}
                  {policies.passwordExpiration && (
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      Password expires every {policies.expirationDays} days
                    </li>
                  )}
                </ul>

                <div className="mt-4 p-3 bg-background rounded border">
                  <Label className="text-xs font-medium text-muted-foreground">Example valid password:</Label>
                  <div className="font-mono text-sm mt-1">{generatePasswordExample()}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              <div className="space-y-1">
                <div className="text-sm font-medium">Ready to apply changes?</div>
                <div className="text-xs text-muted-foreground">
                  These policies will apply to all new password changes and user registrations.
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Reset Changes
                </Button>
                <Button onClick={handleSave} className="min-w-[140px] px-6">
                  <Save className="mr-2 h-4 w-4" />
                  Save Policies
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  )
}
