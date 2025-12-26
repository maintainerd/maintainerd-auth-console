import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { LoginTemplateContentMetadata } from '@/services/api/login-template/types'

interface LoginTemplateContentProps {
  metadata?: LoginTemplateContentMetadata
}

function ContentField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="text-sm text-muted-foreground">
        {value || <span className="italic">Not set</span>}
      </div>
    </div>
  )
}

export function LoginTemplateContent({ metadata }: LoginTemplateContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Configuration</CardTitle>
        <CardDescription>Customize text content and labels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <ContentField label="Page Title" value={metadata?.title} />
          <ContentField label="Subtitle" value={metadata?.subtitle} />
        </div>

        {metadata?.welcomeMessage && (
          <ContentField label="Welcome Message" value={metadata.welcomeMessage} />
        )}

        <Separator />

        <div className="grid gap-6 sm:grid-cols-2">
          <ContentField label="Email Label" value={metadata?.emailLabel} />
          <ContentField label="Password Label" value={metadata?.passwordLabel} />
          <ContentField label="Login Button Text" value={metadata?.loginButtonText} />
          <ContentField label="Signup Button Text" value={metadata?.signupButtonText} />
          <ContentField label="Forgot Password Text" value={metadata?.forgotPasswordText} />
          <ContentField label="Remember Me Text" value={metadata?.rememberMeText} />
        </div>

        {metadata?.footerText && (
          <>
            <Separator />
            <ContentField label="Footer Text" value={metadata.footerText} />
          </>
        )}
      </CardContent>
    </Card>
  )
}
