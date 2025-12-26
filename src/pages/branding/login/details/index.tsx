import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Palette, Layout, Type, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DetailsContainer } from '@/components/container'
import { useLoginTemplate } from '@/hooks/useLoginTemplates'
import { LoginTemplateHeader } from './components/LoginTemplateHeader'
import { LoginTemplateInformation } from './components/LoginTemplateInformation'
import { LoginTemplateDesign } from './components/LoginTemplateDesign'
import { LoginTemplateLayout } from './components/LoginTemplateLayout'
import { LoginTemplateContent } from './components/LoginTemplateContent'
import { LoginTemplateAssets } from './components/LoginTemplateAssets'

export default function LoginTemplateDetailsPage() {
  const { tenantId, templateId } = useParams<{ tenantId: string; templateId: string }>()
  const navigate = useNavigate()

  const { data: template, isLoading, isError } = useLoginTemplate(templateId!)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            Fetching login template details
          </p>
        </div>
      </div>
    )
  }

  if (isError || !template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-semibold">Login Template Not Found</h2>
        <p className="text-muted-foreground">The login template you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(`/${tenantId}/branding/login`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login Templates
        </Button>
      </div>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tenantId}/branding/login`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login Templates
          </Button>
        </div>

        {/* Header */}
        <LoginTemplateHeader
          template={template}
          tenantId={tenantId!}
          templateId={templateId!}
        />

        {/* Template Information */}
        <LoginTemplateInformation template={template} />

        {/* Tabs */}
        <Tabs defaultValue="design">
          <TabsList>
            <TabsTrigger value="design" className="gap-2">
              <Palette className="h-4 w-4" />
              Design
            </TabsTrigger>
            <TabsTrigger value="layout" className="gap-2">
              <Layout className="h-4 w-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <Type className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="assets" className="gap-2">
              <Image className="h-4 w-4" />
              Assets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="mt-6">
            <LoginTemplateDesign metadata={template.metadata?.design} />
          </TabsContent>

          <TabsContent value="layout" className="mt-6">
            <LoginTemplateLayout metadata={template.metadata?.layout} />
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <LoginTemplateContent metadata={template.metadata?.content} />
          </TabsContent>

          <TabsContent value="assets" className="mt-6">
            <LoginTemplateAssets metadata={template.metadata?.assets} />
          </TabsContent>
        </Tabs>
      </div>
    </DetailsContainer>
  )
}
