import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { 
  Mail, 
  Palette, 
  Code, 
  Eye,
  Save,
  X
} from "lucide-react"
import type { 
  EmailTemplate, 
  EmailTemplateType, 
  EmailTemplateCategory,
  EmailTemplateContent,
  EmailTemplateDesign
} from "../types"
import {
  emailTemplateTypes,
  emailTemplateCategories,
  typeDescriptions,
  categoryDescriptions
} from "../types"
import { defaultDesigns } from "../constants"

interface EmailTemplateFormProps {
  template?: EmailTemplate
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (template: Partial<EmailTemplate>) => void
}

export function EmailTemplateForm({ template, open, onOpenChange, onSave }: EmailTemplateFormProps) {
  const isEditing = !!template
  
  const [formData, setFormData] = React.useState({
    name: template?.name || "",
    description: template?.description || "",
    type: template?.type || "custom" as EmailTemplateType,
    category: template?.category || "notifications" as EmailTemplateCategory,
    content: template?.content || {
      subject: "",
      htmlBody: "",
      textBody: "",
      preheader: ""
    } as EmailTemplateContent,
    design: template?.design || defaultDesigns.modern
  })

  React.useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description,
        type: template.type,
        category: template.category,
        content: template.content,
        design: template.design
      })
    }
  }, [template])

  const handleSave = () => {
    const templateData: Partial<EmailTemplate> = {
      ...formData,
      id: template?.id,
      status: template?.status || "draft",
      variables: template?.variables || [],
      isSystem: template?.isSystem || false,
      isDefault: template?.isDefault || false,
      usageCount: template?.usageCount || 0,
      createdAt: template?.createdAt || new Date().toISOString(),
      createdBy: template?.createdBy || "current_user",
      updatedAt: new Date().toISOString(),
      updatedBy: "current_user"
    }
    
    onSave(templateData)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const updateContent = (updates: Partial<EmailTemplateContent>) => {
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, ...updates }
    }))
  }

  const updateDesign = (updates: Partial<EmailTemplateDesign>) => {
    setFormData(prev => ({
      ...prev,
      design: { ...prev.design, ...updates }
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {isEditing ? "Edit Email Template" : "Create Email Template"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modify the email template content and design."
              : "Create a new email template with custom content and styling."
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Template Information
                </CardTitle>
                <CardDescription>
                  Basic information about your email template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateFormData({ name: e.target.value })}
                      placeholder="Welcome Email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: EmailTemplateType) => updateFormData({ type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {emailTemplateTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            <div className="flex flex-col">
                              <span className="capitalize">{type.replace('_', ' ')}</span>
                              <span className="text-xs text-muted-foreground">
                                {typeDescriptions[type]}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: EmailTemplateCategory) => updateFormData({ category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {emailTemplateCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            <div className="flex flex-col">
                              <span className="capitalize">{category.replace('_', ' ')}</span>
                              <span className="text-xs text-muted-foreground">
                                {categoryDescriptions[category]}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    placeholder="Describe what this email template is used for..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Content</CardTitle>
                <CardDescription>
                  Configure the email subject and body content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={formData.content.subject}
                    onChange={(e) => updateContent({ subject: e.target.value })}
                    placeholder="Welcome to {{company.name}}!"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preheader">Preheader (Optional)</Label>
                  <Input
                    id="preheader"
                    value={formData.content.preheader || ""}
                    onChange={(e) => updateContent({ preheader: e.target.value })}
                    placeholder="Preview text that appears in email clients"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="htmlBody">HTML Body</Label>
                  <Textarea
                    id="htmlBody"
                    value={formData.content.htmlBody}
                    onChange={(e) => updateContent({ htmlBody: e.target.value })}
                    placeholder="<h1>Welcome {{user.firstName}}!</h1>..."
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textBody">Plain Text Body</Label>
                  <Textarea
                    id="textBody"
                    value={formData.content.textBody}
                    onChange={(e) => updateContent({ textBody: e.target.value })}
                    placeholder="Welcome {{user.firstName}}!..."
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Design Settings
                </CardTitle>
                <CardDescription>
                  Customize the visual appearance of your email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Design customization coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Email Preview
                </CardTitle>
                <CardDescription>
                  Preview how your email will look to recipients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Email preview coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Update Template" : "Create Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
