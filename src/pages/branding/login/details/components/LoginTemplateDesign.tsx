import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { LoginTemplateDesignMetadata } from '@/services/api/login-template/types'

interface LoginTemplateDesignProps {
  metadata?: LoginTemplateDesignMetadata
}

export function LoginTemplateDesign({ metadata }: LoginTemplateDesignProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Configuration</CardTitle>
        <CardDescription>Visual design and styling settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex items-center gap-3">
              <div 
                className="h-10 w-16 rounded border" 
                style={{ backgroundColor: metadata?.primaryColor || '#3b82f6' }}
              />
              <div className="text-sm text-muted-foreground font-mono">
                {metadata?.primaryColor || '#3b82f6'}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex items-center gap-3">
              <div 
                className="h-10 w-16 rounded border" 
                style={{ backgroundColor: metadata?.backgroundColor || '#f8fafc' }}
              />
              <div className="text-sm text-muted-foreground font-mono">
                {metadata?.backgroundColor || '#f8fafc'}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Font Size</Label>
            <div className="text-sm text-muted-foreground capitalize">
              {metadata?.fontSize || 'medium'}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Border Radius</Label>
            <div className="text-sm text-muted-foreground capitalize">
              {metadata?.borderRadius || 'medium'}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Spacing</Label>
            <div className="text-sm text-muted-foreground capitalize">
              {metadata?.spacing || 'normal'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
