import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SmsTemplate } from "@/services/api/sms-template/types"

interface SmsTemplateContentProps {
  template: SmsTemplate
}

export function SmsTemplateContent({ template }: SmsTemplateContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Content</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Message</h3>
            <div className="rounded-md border bg-muted/50 p-4">
              <p className="text-sm whitespace-pre-wrap">{template.message}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Character Count</h3>
            <p className="text-sm">{template.message.length} characters</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
