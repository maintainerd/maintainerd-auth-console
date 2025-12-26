import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { DetailsContainer } from '@/components/container'
import { FormPageHeader } from '@/components/header'
import { FormInputField, FormSelectField, FormTextareaField, FormSubmitButton, type SelectOption } from '@/components/form'
import { loginTemplateSchema, type LoginTemplateFormData } from '@/lib/validations'
import { useLoginTemplate, useCreateLoginTemplate, useUpdateLoginTemplate } from '@/hooks/useLoginTemplates'
import { useToast } from '@/hooks/useToast'
import type { LoginTemplateStatusType, TemplateType, LoginTemplateMetadata } from '@/services/api/login-template/types'

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const TEMPLATE_OPTIONS: SelectOption[] = [
  { value: 'classic', label: 'Classic' },
  { value: 'modern', label: 'Modern' },
  { value: 'minimal', label: 'Minimal' },
]

const LAYOUT_OPTIONS: SelectOption[] = [
  { value: 'centered', label: 'Centered' },
  { value: 'split', label: 'Split' },
  { value: 'fullscreen', label: 'Fullscreen' },
  { value: 'card', label: 'Card' },
]

const FONT_SIZE_OPTIONS: SelectOption[] = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
]

const BORDER_RADIUS_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'None' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
]

const SPACING_OPTIONS: SelectOption[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'normal', label: 'Normal' },
  { value: 'spacious', label: 'Spacious' },
]

const SOCIAL_BUTTON_STYLE_OPTIONS: SelectOption[] = [
  { value: 'icons', label: 'Icons Only' },
  { value: 'buttons', label: 'Full Buttons' },
  { value: 'compact', label: 'Compact' },
]

export default function LoginTemplateForm() {
  const { tenantId, templateId } = useParams<{ tenantId: string; templateId?: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()

  const isEditing = Boolean(templateId)
  const isCreating = !isEditing

  const { data: templateData, isLoading: isFetchingTemplate } = useLoginTemplate(templateId || '')
  const createMutation = useCreateLoginTemplate()
  const updateMutation = useUpdateLoginTemplate()

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<LoginTemplateFormData>({
    resolver: yupResolver(loginTemplateSchema),
    defaultValues: {
      name: '',
      description: '',
      template: 'classic',
      status: 'active',
      // Design
      primaryColor: '#3b82f6',
      backgroundColor: '#f8fafc',
      fontSize: 'medium',
      borderRadius: 'medium',
      spacing: 'normal',
      // Layout
      layout: 'centered',
      showEmailField: true,
      showPasswordField: true,
      showRememberMe: true,
      showForgotPassword: true,
      enableSocialLogin: false,
      socialButtonStyle: 'buttons',
      enableSignup: true,
      enableClientValidation: true,
      showPasswordStrength: false,
      // Content
      title: 'Welcome Back',
      subtitle: 'Sign in to your account',
      welcomeMessage: '',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      loginButtonText: 'Sign In',
      signupButtonText: 'Create Account',
      forgotPasswordText: 'Forgot your password?',
      rememberMeText: 'Remember me',
      footerText: '',
      // Assets
      logo: '',
      logoWidth: 120,
      logoHeight: 40,
      backgroundImage: '',
      favicon: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const enableSocialLogin = watch('enableSocialLogin')

  useEffect(() => {
    if (isEditing && templateData) {
      const metadata = templateData.metadata || {}
      const design = metadata.design || {}
      const layout = metadata.layout || {}
      const content = metadata.content || {}
      const assets = metadata.assets || {}

      reset({
        name: templateData.name,
        description: templateData.description,
        template: templateData.template,
        status: templateData.status,
        // Design
        primaryColor: design.primaryColor || '#3b82f6',
        backgroundColor: design.backgroundColor || '#f8fafc',
        fontSize: design.fontSize || 'medium',
        borderRadius: design.borderRadius || 'medium',
        spacing: design.spacing || 'normal',
        // Layout
        layout: layout.layout || 'centered',
        showEmailField: layout.showEmailField ?? true,
        showPasswordField: layout.showPasswordField ?? true,
        showRememberMe: layout.showRememberMe ?? true,
        showForgotPassword: layout.showForgotPassword ?? true,
        enableSocialLogin: layout.enableSocialLogin ?? false,
        socialButtonStyle: layout.socialButtonStyle || 'buttons',
        enableSignup: layout.enableSignup ?? true,
        enableClientValidation: layout.enableClientValidation ?? true,
        showPasswordStrength: layout.showPasswordStrength ?? false,
        // Content
        title: content.title || 'Welcome Back',
        subtitle: content.subtitle || 'Sign in to your account',
        welcomeMessage: content.welcomeMessage || '',
        emailLabel: content.emailLabel || 'Email Address',
        passwordLabel: content.passwordLabel || 'Password',
        loginButtonText: content.loginButtonText || 'Sign In',
        signupButtonText: content.signupButtonText || 'Create Account',
        forgotPasswordText: content.forgotPasswordText || 'Forgot your password?',
        rememberMeText: content.rememberMeText || 'Remember me',
        footerText: content.footerText || '',
        // Assets
        logo: assets.logo || '',
        logoWidth: assets.logoWidth || 120,
        logoHeight: assets.logoHeight || 40,
        backgroundImage: assets.backgroundImage || '',
        favicon: assets.favicon || '',
      })
    }
  }, [isEditing, templateData, reset])

  const isLoading = createMutation.isPending || updateMutation.isPending || isSubmitting

  const onSubmit = async (data: LoginTemplateFormData) => {
    try {
      // Combine individual fields into metadata structure
      const metadata: LoginTemplateMetadata = {
        design: {
          primaryColor: data.primaryColor,
          backgroundColor: data.backgroundColor,
          fontSize: data.fontSize,
          borderRadius: data.borderRadius,
          spacing: data.spacing,
        },
        layout: {
          layout: data.layout,
          showEmailField: data.showEmailField,
          showPasswordField: data.showPasswordField,
          showRememberMe: data.showRememberMe,
          showForgotPassword: data.showForgotPassword,
          enableSocialLogin: data.enableSocialLogin,
          socialButtonStyle: data.socialButtonStyle,
          enableSignup: data.enableSignup,
          enableClientValidation: data.enableClientValidation,
          showPasswordStrength: data.showPasswordStrength,
        },
        content: {
          title: data.title,
          subtitle: data.subtitle,
          welcomeMessage: data.welcomeMessage,
          emailLabel: data.emailLabel,
          passwordLabel: data.passwordLabel,
          loginButtonText: data.loginButtonText,
          signupButtonText: data.signupButtonText,
          forgotPasswordText: data.forgotPasswordText,
          rememberMeText: data.rememberMeText,
          footerText: data.footerText,
        },
        assets: {
          logo: data.logo,
          logoWidth: data.logoWidth,
          logoHeight: data.logoHeight,
          backgroundImage: data.backgroundImage,
          favicon: data.favicon,
        },
      }

      const payload = {
        name: data.name,
        description: data.description,
        template: data.template as TemplateType,
        status: data.status as LoginTemplateStatusType,
        metadata,
      }

      if (isCreating) {
        const result = await createMutation.mutateAsync(payload)
        showSuccess('Login template created successfully')
        navigate(`/${tenantId}/branding/login/${result.loginTemplateId}`)
      } else {
        await updateMutation.mutateAsync({
          id: templateId!,
          data: payload,
        })
        showSuccess('Login template updated successfully')
        navigate(`/${tenantId}/branding/login/${templateId}`)
      }
    } catch (error) {
      if (error instanceof Error && error.message?.includes('JSON')) {
        showError('Invalid JSON format in metadata sections')
      } else {
        showError(error)
      }
    }
  }

  const pageTitle = isCreating ? 'Create Login Template' : `Edit ${templateData?.name || 'Login Template'}`
  const submitButtonText = isCreating ? 'Create Template' : 'Update Template'

  if (isEditing && isFetchingTemplate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">Fetching login template details</p>
        </div>
      </div>
    )
  }

  if (isEditing && !isFetchingTemplate && !templateData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-semibold">Login Template Not Found</h2>
        <p className="text-muted-foreground">
          The login template you're trying to edit doesn't exist.
        </p>
        <Button onClick={() => navigate(`/${tenantId}/branding/login`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login Templates
        </Button>
      </div>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          title={pageTitle}
          description={isCreating
            ? 'Configure a new login template for your application'
            : 'Update your login template configuration'}
          backUrl={`/${tenantId}/branding/login`}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>General template details and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                label="Name"
                placeholder="e.g., Corporate Login"
                error={errors.name?.message}
                {...register('name')}
              />

              <FormTextareaField
                label="Description"
                placeholder="Enter template description"
                rows={3}
                error={errors.description?.message}
                {...register('description')}
              />

              <Controller
                name="template"
                control={control}
                render={({ field }) => (
                  <FormSelectField
                    label="Template Type"
                    placeholder="Select template type"
                    options={TEMPLATE_OPTIONS}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.template?.message}
                  />
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormSelectField
                    label="Status"
                    placeholder="Select status"
                    options={STATUS_OPTIONS}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.status?.message}
                  />
                )}
              />
            </CardContent>
          </Card>

          {/* Design Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Design Configuration</CardTitle>
              <CardDescription>Visual design and styling settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      {...register('primaryColor')}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      {...register('primaryColor')}
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
                      {...register('backgroundColor')}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      {...register('backgroundColor')}
                      placeholder="#f8fafc"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-3">
                <Controller
                  name="fontSize"
                  control={control}
                  render={({ field }) => (
                    <FormSelectField
                      label="Font Size"
                      options={FONT_SIZE_OPTIONS}
                      value={field.value}
                      onValueChange={field.onChange}
                      error={errors.fontSize?.message}
                    />
                  )}
                />

                <Controller
                  name="borderRadius"
                  control={control}
                  render={({ field }) => (
                    <FormSelectField
                      label="Border Radius"
                      options={BORDER_RADIUS_OPTIONS}
                      value={field.value}
                      onValueChange={field.onChange}
                      error={errors.borderRadius?.message}
                    />
                  )}
                />

                <Controller
                  name="spacing"
                  control={control}
                  render={({ field }) => (
                    <FormSelectField
                      label="Spacing"
                      options={SPACING_OPTIONS}
                      value={field.value}
                      onValueChange={field.onChange}
                      error={errors.spacing?.message}
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Layout Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Layout Configuration</CardTitle>
              <CardDescription>Page structure and form behavior settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Controller
                name="layout"
                control={control}
                render={({ field }) => (
                  <FormSelectField
                    label="Layout Style"
                    options={LAYOUT_OPTIONS}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.layout?.message}
                  />
                )}
              />

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Form Fields</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    name="showEmailField"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Email Field</Label>
                          <div className="text-sm text-muted-foreground">Display email input field</div>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="showPasswordField"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Password Field</Label>
                          <div className="text-sm text-muted-foreground">Display password input field</div>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="showRememberMe"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Remember Me</Label>
                          <div className="text-sm text-muted-foreground">Display remember me checkbox</div>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="showForgotPassword"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Forgot Password</Label>
                          <div className="text-sm text-muted-foreground">Display forgot password link</div>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="enableSignup"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Signup</Label>
                          <div className="text-sm text-muted-foreground">Allow new user registration</div>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="enableClientValidation"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Client Validation</Label>
                          <div className="text-sm text-muted-foreground">Enable client-side validation</div>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="showPasswordStrength"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Password Strength</Label>
                          <div className="text-sm text-muted-foreground">Show password strength indicator</div>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Controller
                  name="enableSocialLogin"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Social Login</Label>
                        <div className="text-sm text-muted-foreground">Allow login with social providers</div>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />

                {enableSocialLogin && (
                  <Controller
                    name="socialButtonStyle"
                    control={control}
                    render={({ field }) => (
                      <FormSelectField
                        label="Social Button Style"
                        options={SOCIAL_BUTTON_STYLE_OPTIONS}
                        value={field.value}
                        onValueChange={field.onChange}
                        error={errors.socialButtonStyle?.message}
                      />
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Content Configuration</CardTitle>
              <CardDescription>Customize text content and labels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInputField
                  label="Page Title"
                  placeholder="Welcome Back"
                  error={errors.title?.message}
                  {...register('title')}
                />

                <FormInputField
                  label="Subtitle"
                  placeholder="Sign in to your account"
                  error={errors.subtitle?.message}
                  {...register('subtitle')}
                />
              </div>

              <FormTextareaField
                label="Welcome Message"
                placeholder="Optional welcome message"
                rows={2}
                error={errors.welcomeMessage?.message}
                {...register('welcomeMessage')}
              />

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormInputField
                  label="Email Label"
                  placeholder="Email Address"
                  error={errors.emailLabel?.message}
                  {...register('emailLabel')}
                />

                <FormInputField
                  label="Password Label"
                  placeholder="Password"
                  error={errors.passwordLabel?.message}
                  {...register('passwordLabel')}
                />

                <FormInputField
                  label="Login Button Text"
                  placeholder="Sign In"
                  error={errors.loginButtonText?.message}
                  {...register('loginButtonText')}
                />

                <FormInputField
                  label="Signup Button Text"
                  placeholder="Create Account"
                  error={errors.signupButtonText?.message}
                  {...register('signupButtonText')}
                />

                <FormInputField
                  label="Forgot Password Text"
                  placeholder="Forgot your password?"
                  error={errors.forgotPasswordText?.message}
                  {...register('forgotPasswordText')}
                />

                <FormInputField
                  label="Remember Me Text"
                  placeholder="Remember me"
                  error={errors.rememberMeText?.message}
                  {...register('rememberMeText')}
                />
              </div>

              <Separator />

              <FormInputField
                label="Footer Text"
                placeholder="© 2024 Your Company. All rights reserved."
                error={errors.footerText?.message}
                {...register('footerText')}
              />
            </CardContent>
          </Card>

          {/* Assets Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Assets Configuration</CardTitle>
              <CardDescription>Configure logos, images, and media assets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Logo Configuration</h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <FormInputField
                    label="Logo URL"
                    placeholder="/assets/logo.svg"
                    error={errors.logo?.message}
                    {...register('logo')}
                  />

                  <FormInputField
                    label="Logo Width (px)"
                    type="number"
                    placeholder="120"
                    error={errors.logoWidth?.message}
                    {...register('logoWidth', { valueAsNumber: true })}
                  />

                  <FormInputField
                    label="Logo Height (px)"
                    type="number"
                    placeholder="40"
                    error={errors.logoHeight?.message}
                    {...register('logoHeight', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Background & Additional Assets</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormInputField
                    label="Background Image URL"
                    placeholder="/assets/background.jpg"
                    error={errors.backgroundImage?.message}
                    {...register('backgroundImage')}
                  />

                  <FormInputField
                    label="Favicon URL"
                    placeholder="/assets/favicon.ico"
                    error={errors.favicon?.message}
                    {...register('favicon')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/${tenantId}/branding/login`)}
            >
              Cancel
            </Button>
            <FormSubmitButton 
              isSubmitting={isLoading} 
              submitText={submitButtonText}
            />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}
