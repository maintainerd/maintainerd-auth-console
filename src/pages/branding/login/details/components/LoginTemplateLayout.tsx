import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Check, X } from 'lucide-react'
import type { LoginTemplateLayoutMetadata } from '@/services/api/login-template/types'

interface LoginTemplateLayoutProps {
  metadata?: LoginTemplateLayoutMetadata
}

function BooleanField({ label, value }: { label: string; value?: boolean }) {
  const isEnabled = value ?? false
  return (
    <div className="flex items-center justify-between py-2">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center gap-2">
        {isEnabled ? (
          <Badge variant="default" className="gap-1">
            <Check className="h-3 w-3" />
            Enabled
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1">
            <X className="h-3 w-3" />
            Disabled
          </Badge>
        )}
      </div>
    </div>
  )
}

export function LoginTemplateLayout({ metadata }: LoginTemplateLayoutProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Layout Configuration</CardTitle>
        <CardDescription>Page structure and form behavior settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Layout Style</Label>
          <div className="text-sm text-muted-foreground capitalize">
            {metadata?.layout || 'centered'}
          </div>
        </div>

        <Separator />

        <div className="space-y-1">
          <h4 className="text-sm font-medium mb-3">Form Fields</h4>
          <div className="grid gap-1 sm:grid-cols-2">
            <BooleanField label="Show Email Field" value={metadata?.showEmailField} />
            <BooleanField label="Show Password Field" value={metadata?.showPasswordField} />
            <BooleanField label="Show Remember Me" value={metadata?.showRememberMe} />
            <BooleanField label="Show Forgot Password" value={metadata?.showForgotPassword} />
            <BooleanField label="Enable Signup" value={metadata?.enableSignup} />
            <BooleanField label="Client Validation" value={metadata?.enableClientValidation} />
            <BooleanField label="Password Strength" value={metadata?.showPasswordStrength} />
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Social Login</h4>
          <BooleanField label="Enable Social Login" value={metadata?.enableSocialLogin} />
          {metadata?.enableSocialLogin && (
            <div className="space-y-2 ml-4">
              <Label className="text-sm">Social Button Style</Label>
              <div className="text-sm text-muted-foreground capitalize">
                {metadata?.socialButtonStyle || 'buttons'}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
