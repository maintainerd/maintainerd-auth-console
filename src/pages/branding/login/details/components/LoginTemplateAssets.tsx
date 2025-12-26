import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { LoginTemplateAssetsMetadata } from '@/services/api/login-template/types'

interface LoginTemplateAssetsProps {
  metadata?: LoginTemplateAssetsMetadata
}

function AssetField({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="text-sm text-muted-foreground break-all">
        {value || <span className="italic">Not set</span>}
      </div>
    </div>
  )
}

export function LoginTemplateAssets({ metadata }: LoginTemplateAssetsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assets Configuration</CardTitle>
        <CardDescription>Configure logos, images, and media assets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Logo Configuration</h4>
          <div className="grid gap-6 sm:grid-cols-3">
            <AssetField label="Logo URL" value={metadata?.logo} />
            <AssetField label="Logo Width (px)" value={metadata?.logoWidth} />
            <AssetField label="Logo Height (px)" value={metadata?.logoHeight} />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Background & Additional Assets</h4>
          <div className="grid gap-6 sm:grid-cols-2">
            <AssetField label="Background Image URL" value={metadata?.backgroundImage} />
            <AssetField label="Favicon URL" value={metadata?.favicon} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
