"use client"

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
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Palette, 
  Layout, 
  Type, 
  Image, 
  Settings, 
  Eye,
  Save,
  X
} from "lucide-react"
import type { 
  LoginBranding, 
  LoginBrandingTemplate, 
  LoginBrandingLayout,
  LoginBrandingTheme,
  LoginBrandingForm as LoginBrandingFormType,
  LoginBrandingContent,
  LoginBrandingAssets
} from "../types"
import {
  loginBrandingTemplates,
  loginBrandingLayouts,
  templateDescriptions,
  layoutDescriptions
} from "../types"
import { defaultThemes } from "../constants"

interface LoginBrandingFormProps {
  branding?: LoginBranding
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (branding: Partial<LoginBranding>) => void
}

export function LoginBrandingForm({ 
  branding, 
  open, 
  onOpenChange, 
  onSave 
}: LoginBrandingFormProps) {
  const isEditing = !!branding
  
  const [formData, setFormData] = React.useState<Partial<LoginBranding>>(() => {
    if (branding) {
      return { ...branding }
    }
    
    return {
      name: "",
      description: "",
      status: "draft",
      template: "modern",
      layout: "centered",
      theme: defaultThemes.modern,
      assets: {
        logoWidth: 120,
        logoHeight: 40
      },
      form: {
        showEmailField: true,
        showPasswordField: true,
        showRememberMe: true,
        showForgotPassword: true,
        enableSocialLogin: false,
        socialProviders: [],
        socialButtonStyle: "buttons",
        enableSignup: true,
        enableClientValidation: true,
        showPasswordStrength: false
      },
      content: {
        title: "Welcome Back",
        subtitle: "Sign in to your account",
        emailLabel: "Email Address",
        passwordLabel: "Password",
        loginButtonText: "Sign In",
        signupButtonText: "Create Account",
        forgotPasswordText: "Forgot your password?",
        rememberMeText: "Remember me"
      },
      isDefault: false,
      isSystem: false,
      usageCount: 0
    }
  })

  const handleTemplateChange = (template: LoginBrandingTemplate) => {
    setFormData(prev => ({
      ...prev,
      template,
      theme: defaultThemes[template as keyof typeof defaultThemes] || defaultThemes.modern
    }))
  }

  const handleThemeChange = (field: keyof LoginBrandingTheme, value: any) => {
    setFormData(prev => ({
      ...prev,
      theme: {
        ...prev.theme!,
        [field]: value
      }
    }))
  }

  const handleFormChange = (field: keyof LoginBrandingFormType, value: any) => {
    setFormData(prev => ({
      ...prev,
      form: {
        ...prev.form!,
        [field]: value
      }
    }))
  }

  const handleContentChange = (field: keyof LoginBrandingContent, value: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content!,
        [field]: value
      }
    }))
  }

  const handleAssetsChange = (field: keyof LoginBrandingAssets, value: any) => {
    setFormData(prev => ({
      ...prev,
      assets: {
        ...prev.assets!,
        [field]: value
      }
    }))
  }

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
  }

  const handlePreview = () => {
    console.log("Preview branding:", formData)
    // TODO: Open preview in new window
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {isEditing ? "Edit Login Branding" : "Create Login Branding"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modify the login page design and configuration."
              : "Design a custom login page with themes, layouts, and content."
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Design
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Assets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Configure the basic settings for your login branding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter branding name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this login branding"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Template</Label>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {loginBrandingTemplates.map((template) => (
                      <div
                        key={template}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.template === template
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => handleTemplateChange(template)}
                      >
                        <div className="font-medium capitalize">{template}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {templateDescriptions[template]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Theme Colors</CardTitle>
                <CardDescription>
                  Customize the color scheme for your login page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={formData.theme?.primaryColor || "#3b82f6"}
                        onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={formData.theme?.primaryColor || "#3b82f6"}
                        onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="backgroundColor"
                        type="color"
                        value={formData.theme?.backgroundColor || "#f8fafc"}
                        onChange={(e) => handleThemeChange("backgroundColor", e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={formData.theme?.backgroundColor || "#f8fafc"}
                        onChange={(e) => handleThemeChange("backgroundColor", e.target.value)}
                        placeholder="#f8fafc"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select
                      value={formData.theme?.fontSize}
                      onValueChange={(value: any) => handleThemeChange("fontSize", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Border Radius</Label>
                    <Select
                      value={formData.theme?.borderRadius}
                      onValueChange={(value: any) => handleThemeChange("borderRadius", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Spacing</Label>
                    <Select
                      value={formData.theme?.spacing}
                      onValueChange={(value: any) => handleThemeChange("spacing", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="spacious">Spacious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Layout Configuration</CardTitle>
                <CardDescription>
                  Choose the layout style and form behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Layout Style</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {loginBrandingLayouts.map((layout) => (
                      <div
                        key={layout}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.layout === layout
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, layout }))}
                      >
                        <div className="font-medium capitalize">{layout}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {layoutDescriptions[layout]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Form Fields</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Email Field</Label>
                        <div className="text-sm text-muted-foreground">Display email input field</div>
                      </div>
                      <Switch
                        checked={formData.form?.showEmailField}
                        onCheckedChange={(checked) => handleFormChange("showEmailField", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Password Field</Label>
                        <div className="text-sm text-muted-foreground">Display password input field</div>
                      </div>
                      <Switch
                        checked={formData.form?.showPasswordField}
                        onCheckedChange={(checked) => handleFormChange("showPasswordField", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Remember Me</Label>
                        <div className="text-sm text-muted-foreground">Display remember me checkbox</div>
                      </div>
                      <Switch
                        checked={formData.form?.showRememberMe}
                        onCheckedChange={(checked) => handleFormChange("showRememberMe", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Forgot Password</Label>
                        <div className="text-sm text-muted-foreground">Display forgot password link</div>
                      </div>
                      <Switch
                        checked={formData.form?.showForgotPassword}
                        onCheckedChange={(checked) => handleFormChange("showForgotPassword", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Social Login</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Social Login</Label>
                      <div className="text-sm text-muted-foreground">Allow login with social providers</div>
                    </div>
                    <Switch
                      checked={formData.form?.enableSocialLogin}
                      onCheckedChange={(checked) => handleFormChange("enableSocialLogin", checked)}
                    />
                  </div>

                  {formData.form?.enableSocialLogin && (
                    <div className="space-y-2">
                      <Label>Social Button Style</Label>
                      <Select
                        value={formData.form?.socialButtonStyle}
                        onValueChange={(value: any) => handleFormChange("socialButtonStyle", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="icons">Icons Only</SelectItem>
                          <SelectItem value="buttons">Full Buttons</SelectItem>
                          <SelectItem value="compact">Compact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content & Text</CardTitle>
                <CardDescription>
                  Customize the text content and labels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Page Title</Label>
                    <Input
                      id="title"
                      value={formData.content?.title || ""}
                      onChange={(e) => handleContentChange("title", e.target.value)}
                      placeholder="Welcome Back"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={formData.content?.subtitle || ""}
                      onChange={(e) => handleContentChange("subtitle", e.target.value)}
                      placeholder="Sign in to your account"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={formData.content?.welcomeMessage || ""}
                    onChange={(e) => handleContentChange("welcomeMessage", e.target.value)}
                    placeholder="Optional welcome message"
                    rows={2}
                  />
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emailLabel">Email Label</Label>
                    <Input
                      id="emailLabel"
                      value={formData.content?.emailLabel || ""}
                      onChange={(e) => handleContentChange("emailLabel", e.target.value)}
                      placeholder="Email Address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordLabel">Password Label</Label>
                    <Input
                      id="passwordLabel"
                      value={formData.content?.passwordLabel || ""}
                      onChange={(e) => handleContentChange("passwordLabel", e.target.value)}
                      placeholder="Password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loginButtonText">Login Button Text</Label>
                    <Input
                      id="loginButtonText"
                      value={formData.content?.loginButtonText || ""}
                      onChange={(e) => handleContentChange("loginButtonText", e.target.value)}
                      placeholder="Sign In"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupButtonText">Signup Button Text</Label>
                    <Input
                      id="signupButtonText"
                      value={formData.content?.signupButtonText || ""}
                      onChange={(e) => handleContentChange("signupButtonText", e.target.value)}
                      placeholder="Create Account"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="forgotPasswordText">Forgot Password Text</Label>
                    <Input
                      id="forgotPasswordText"
                      value={formData.content?.forgotPasswordText || ""}
                      onChange={(e) => handleContentChange("forgotPasswordText", e.target.value)}
                      placeholder="Forgot your password?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rememberMeText">Remember Me Text</Label>
                    <Input
                      id="rememberMeText"
                      value={formData.content?.rememberMeText || ""}
                      onChange={(e) => handleContentChange("rememberMeText", e.target.value)}
                      placeholder="Remember me"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="footerText">Footer Text</Label>
                  <Input
                    id="footerText"
                    value={formData.content?.footerText || ""}
                    onChange={(e) => handleContentChange("footerText", e.target.value)}
                    placeholder="© 2024 Your Company. All rights reserved."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assets & Media</CardTitle>
                <CardDescription>
                  Upload and configure logos, images, and other assets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Logo Configuration</h4>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo URL</Label>
                      <Input
                        id="logo"
                        value={formData.assets?.logo || ""}
                        onChange={(e) => handleAssetsChange("logo", e.target.value)}
                        placeholder="/assets/logo.svg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logoWidth">Logo Width (px)</Label>
                      <Input
                        id="logoWidth"
                        type="number"
                        value={formData.assets?.logoWidth || ""}
                        onChange={(e) => handleAssetsChange("logoWidth", parseInt(e.target.value))}
                        placeholder="120"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logoHeight">Logo Height (px)</Label>
                      <Input
                        id="logoHeight"
                        type="number"
                        value={formData.assets?.logoHeight || ""}
                        onChange={(e) => handleAssetsChange("logoHeight", parseInt(e.target.value))}
                        placeholder="40"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Background & Additional Assets</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="backgroundImage">Background Image URL</Label>
                      <Input
                        id="backgroundImage"
                        value={formData.assets?.backgroundImage || ""}
                        onChange={(e) => handleAssetsChange("backgroundImage", e.target.value)}
                        placeholder="/assets/background.jpg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="favicon">Favicon URL</Label>
                      <Input
                        id="favicon"
                        value={formData.assets?.favicon || ""}
                        onChange={(e) => handleAssetsChange("favicon", e.target.value)}
                        placeholder="/assets/favicon.ico"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Image className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h5 className="font-medium">Asset Upload</h5>
                      <p className="text-sm text-muted-foreground mt-1">
                        For production use, implement file upload functionality to allow users to upload
                        logos and background images directly. Currently, you can specify URLs to existing assets.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
