import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/badges"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import type { SmsTemplate } from "@/services/api/sms-template/types"

interface SmsTemplateInformationProps {
  template: SmsTemplate
}

export function SmsTemplateInformation({ template }: SmsTemplateInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Status</span>
            <StatusBadge status={template.status} />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Sender ID</span>
            <span className="text-sm font-mono">{template.senderId}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Type</span>
            <div className="flex gap-1">
              {template.isSystem && (
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                  System
                </Badge>
              )}
              {template.isDefault && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  Default
                </Badge>
              )}
              {!template.isSystem && !template.isDefault && (
                <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                  Custom
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Created</span>
            <span className="text-sm">
              {formatDistanceToNow(new Date(template.createdAt), { addSuffix: true })}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Last Updated</span>
            <span className="text-sm">
              {formatDistanceToNow(new Date(template.updatedAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
