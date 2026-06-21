import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { EmailTemplate } from "@/services/api/email-templates/types"

interface EmailTemplateContentProps {
  template: EmailTemplate
}

export function EmailTemplateContent({ template }: EmailTemplateContentProps) {
  return (
    <div className="space-y-6">
      {template.parametersDoc && (
        <Card>
          <CardHeader>
            <CardTitle>Template Parameters</CardTitle>
            <CardDescription>Variables available in the HTML and plain text content. They are replaced with actual values when the email is sent.</CardDescription>
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
          <CardTitle>Email Content</CardTitle>
          <CardDescription>Subject line, HTML body, and plain text fallback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <p className="text-sm font-medium">Subject</p>
            <p className="text-sm text-muted-foreground">{template.subject}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">HTML Content</p>
            <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs">
              <code>{template.bodyHtml}</code>
            </pre>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Plain Text Content</p>
            <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs whitespace-pre-wrap">
              <code>{template.bodyPlain}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
