import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { EmailTemplate } from "@/services/api/email-template/types"

interface EmailTemplatePreviewProps {
  template: EmailTemplate
}

export function EmailTemplatePreview({ template }: EmailTemplatePreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>HTML Preview</CardTitle>
        <CardDescription>Preview of the email template as it will appear to recipients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md p-4 bg-white">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: template.bodyHtml }} 
          />
        </div>
      </CardContent>
    </Card>
  )
}
