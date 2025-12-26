import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { EmailTemplate } from "@/services/api/email-template/types"

interface EmailTemplateContentProps {
  template: EmailTemplate
}

export function EmailTemplateContent({ template }: EmailTemplateContentProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subject</CardTitle>
          <CardDescription>Email subject line</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{template.subject}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>HTML Content</CardTitle>
          <CardDescription>Email body in HTML format</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs">
              <code>{template.bodyHtml}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plain Text Content</CardTitle>
          <CardDescription>Email body in plain text format (fallback)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs whitespace-pre-wrap">
              <code>{template.bodyPlain}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
