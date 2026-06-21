import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SmsTemplate } from "@/services/api/sms-templates/types"

interface SmsTemplateContentProps {
  template: SmsTemplate
}

export function SmsTemplateContent({ template }: SmsTemplateContentProps) {
  return (
    <div className="space-y-6">
      {template.parametersDoc && (
        <Card>
          <CardHeader>
            <CardTitle>Template Parameters</CardTitle>
            <CardDescription>Variables available in the message content. They are replaced with actual values when the SMS is sent.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium">Parameter</th>
                    <th className="px-4 py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {template.parametersDoc
                    .split('\n')
                    .filter((line) => line.startsWith('|') && !line.includes('---'))
                    .slice(1)
                    .map((line, i) => {
                      const cells = line.split('|').map((c) => c.trim()).filter(Boolean)
                      return (
                        <tr key={i} className="border-b last:border-0">
                          <td className="px-4 py-2 font-mono text-xs">{cells[0]?.replace(/`/g, '')}</td>
                          <td className="px-4 py-2 text-muted-foreground">{cells[1]}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

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
    </div>
  )
}
