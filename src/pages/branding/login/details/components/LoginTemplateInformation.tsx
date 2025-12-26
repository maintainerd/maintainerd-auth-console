import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/badges'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import type { LoginTemplate } from '@/services/api/login-template/types'

interface LoginTemplateInformationProps {
  template: LoginTemplate
}

export function LoginTemplateInformation({ template }: LoginTemplateInformationProps) {
  const getTemplateBadge = (templateType: string) => {
    const config: Record<string, { className: string }> = {
      classic: { className: 'bg-blue-100 text-blue-800 border-blue-200' },
      modern: { className: 'bg-purple-100 text-purple-800 border-purple-200' },
      minimal: { className: 'bg-gray-100 text-gray-800 border-gray-200' },
    }
    const badgeConfig = config[templateType] || config.classic
    return (
      <Badge variant="outline" className={badgeConfig.className}>
        {templateType.charAt(0).toUpperCase() + templateType.slice(1)}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <div className="mt-1">
              <StatusBadge status={template.status} />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Template Type</p>
            <div className="mt-1">{getTemplateBadge(template.template)}</div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Type</p>
            <div className="mt-1 flex gap-1">
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

          <div>
            <p className="text-sm font-medium text-muted-foreground">Created</p>
            <p className="mt-1 text-sm">
              {formatDistanceToNow(new Date(template.createdAt), { addSuffix: true })}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
            <p className="mt-1 text-sm">
              {formatDistanceToNow(new Date(template.updatedAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
