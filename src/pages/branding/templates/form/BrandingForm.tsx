import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { ArrowLeft, AlertCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { DetailsContainer } from "@/components/container"
import { FormPageHeader } from "@/components/header"
import { FormInputField, FormSelectField, FormSubmitButton } from "@/components/form"
import { brandingSchema, type BrandingFormData } from "@/lib/validations"
import { useBranding, useCreateBranding, useUpdateBranding } from "@/hooks/useBranding"
import { useToast } from "@/hooks/useToast"
import {
  THEME_TOKENS,
  DEFAULT_TOKENS,
  tokenId,
  isHex,
  tokensFromMetadata,
  metadataFromTokens,
  type ThemeToken,
} from "../themeTokens"

const LAYOUT_OPTIONS = [
  { value: "centered", label: "Centered card" },
  { value: "full_page", label: "Full page" },
  { value: "split", label: "Split screen" },
]

export default function BrandingForm() {
  const { brandingId } = useParams<{ brandingId?: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { showSuccess, showError } = useToast()

  const isEditing = Boolean(brandingId)
  const isCreating = !isEditing

  // Honour where the user came from so the back button and post-submit
  // navigation return there. Falls back to the listing.
  const listUrl = `/branding/templates`
  const navState = location.state as { from?: string; backLabel?: string } | null
  const backTo = navState?.from ?? listUrl
  const backLabel = navState?.backLabel ?? "Back to Themes"

  const { data: branding, isLoading: isFetching } = useBranding(brandingId)
  const createMutation = useCreateBranding()
  const updateMutation = useUpdateBranding()

  const [tokens, setTokens] = useState<Record<string, string>>({ ...DEFAULT_TOKENS })
  const [logoMode, setLogoMode] = useState<'url' | 'file'>('url')
  const [logoData, setLogoData] = useState<string | null>(null)
  const [logoContentType, setLogoContentType] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFileError, setLogoFileError] = useState<string | null>(null)
  const logoFileRef = useRef<HTMLInputElement | null>(null)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BrandingFormData>({
    resolver: yupResolver(brandingSchema),
    defaultValues: {
      name: "",
      layout: "centered",
      company_name: "",
      logo_url: "",
      favicon_url: "",
      support_url: "",
      privacy_policy_url: "",
      terms_of_service_url: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  useEffect(() => {
    if (isEditing && branding) {
      reset({
        name: branding.name ?? "",
        layout: branding.layout ?? "centered",
        company_name: branding.company_name ?? "",
        logo_url: branding.logo_url ?? "",
        favicon_url: branding.favicon_url ?? "",
        support_url: branding.support_url ?? "",
        privacy_policy_url: branding.privacy_policy_url ?? "",
        terms_of_service_url: branding.terms_of_service_url ?? "",
      })
      setTokens(tokensFromMetadata(branding.metadata))
      setLogoMode('url')
      setLogoData(null)
      setLogoPreview(null)
      setLogoContentType(null)
      setLogoFileError(null)
    }
  }, [isEditing, branding, reset])

  const setToken = (id: string, value: string) => setTokens((t) => ({ ...t, [id]: value }))

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFileError(null)
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setLogoFileError('Only PNG, JPEG, or WebP images are allowed.')
      return
    }
    if (file.size > 262144) {
      setLogoFileError('File must be 256 KB or smaller.')
      return
    }
    const base64 = await toBase64(file)
    setLogoData(base64)
    setLogoContentType(file.type)
    const reader = new FileReader()
    reader.onload = () => setLogoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const isLoading = createMutation.isPending || updateMutation.isPending || isSubmitting

  const onSubmit = async (data: BrandingFormData) => {
    const payload = {
      name: data.name.trim(),
      layout: data.layout,
      company_name: (data.company_name ?? "").trim(),
      logo_url: logoMode === 'url' ? (data.logo_url ?? "").trim() : "",
      favicon_url: (data.favicon_url ?? "").trim(),
      support_url: (data.support_url ?? "").trim(),
      privacy_policy_url: (data.privacy_policy_url ?? "").trim(),
      terms_of_service_url: (data.terms_of_service_url ?? "").trim(),
      metadata: metadataFromTokens(tokens),
      logo_data: logoMode === 'file' && logoData ? logoData : undefined,
      logo_content_type: logoMode === 'file' && logoContentType ? logoContentType : undefined,
    }

    try {
      if (isCreating) {
        await createMutation.mutateAsync(payload)
        showSuccess("Branding created successfully")
      } else {
        await updateMutation.mutateAsync({ brandingId: brandingId!, data: payload })
        showSuccess("Branding updated successfully")
      }
      navigate(backTo)
    } catch (error) {
      showError(error)
    }
  }

  const pageTitle = isCreating ? "Create Branding Template" : `Edit ${branding?.name || "Branding Template"}`
  const submitButtonText = isCreating ? "Create Template" : "Update Template"

  // Loading state while fetching the branding to edit
  if (isEditing && isFetching && !branding) {
    return (
      <DetailsContainer>
        <div className="flex flex-col gap-6">
          <FormPageHeader
            backUrl={backTo}
            backLabel={backLabel}
            title="Edit Branding Template"
            description="Update the branding theme and its values"
          />
          <Card className="shadow-xs">
            <CardContent className="space-y-4 pt-6">
              <Skeleton className="h-5 w-40" />
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </DetailsContainer>
    )
  }

  // Not-found state
  if (isEditing && !isFetching && !branding) {
    return (
      <DetailsContainer>
        <div className="flex flex-col gap-6">
          <FormPageHeader
            backUrl={backTo}
            backLabel={backLabel}
            title="Edit Branding Template"
            description="Update the branding theme and its values"
          />
          <Card className="shadow-xs">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <AlertCircle className="size-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Branding not found</h2>
                <p className="text-sm text-muted-foreground">
                  The branding template you're looking for doesn't exist or may have been removed.
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate(backTo)}>
                <ArrowLeft className="mr-2 size-4" />
                {backLabel}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          backUrl={backTo}
          backLabel={backLabel}
          title={pageTitle}
          description={
            isCreating
              ? "Create a new branding theme. It won't be active until you set it as the active template."
              : "Update this branding theme. Setting it as active is a separate action."
          }
          showSystemBadge={!!branding?.is_system}
          showWarning={!!branding?.is_system}
          warningMessage="This is a system template. You can edit its values, but it can't be deleted."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" key={brandingId || "create"}>
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
              <p className="text-sm text-muted-foreground">The template name and company.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormInputField
                  label="Name"
                  placeholder="e.g., acme-light"
                  disabled={isLoading}
                  required
                  error={errors.name?.message}
                  {...register("name")}
                />
                <FormInputField
                  label="Company name"
                  placeholder="Acme Inc."
                  disabled={isLoading}
                  error={errors.company_name?.message}
                  {...register("company_name")}
                />
                <Controller
                  name="layout"
                  control={control}
                  render={({ field }) => (
                    <FormSelectField
                      label="Login layout"
                      options={LAYOUT_OPTIONS}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                      error={errors.layout?.message}
                      description="Choose how every hosted authentication page is arranged."
                      required
                      containerClassName="md:col-span-2"
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base">Brand assets &amp; links</CardTitle>
              <p className="text-sm text-muted-foreground">
                Logo, favicon, and the URLs surfaced across the auth experience.
              </p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium leading-none">Logo</span>
                  <div className="flex rounded-md border text-xs overflow-hidden">
                    <button
                      type="button"
                      className={`px-3 py-1.5 transition-colors ${logoMode === 'url' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}`}
                      onClick={() => setLogoMode('url')}
                      disabled={isLoading}
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1.5 transition-colors ${logoMode === 'file' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}`}
                      onClick={() => setLogoMode('file')}
                      disabled={isLoading}
                    >
                      Upload
                    </button>
                  </div>
                </div>
                {logoMode === 'url' ? (
                  <FormInputField
                    label="Logo URL"
                    placeholder="https://…/logo.svg"
                    disabled={isLoading}
                    error={errors.logo_url?.message}
                    {...register("logo_url")}
                  />
                ) : (
                  <div className="flex flex-col gap-2">
                    <input
                      ref={logoFileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      disabled={isLoading}
                      onChange={handleLogoFileChange}
                      className="text-sm file:mr-3 file:rounded-md file:border file:border-border file:bg-muted file:px-3 file:py-1 file:text-xs file:font-medium file:cursor-pointer cursor-pointer"
                    />
                    {logoFileError && (
                      <p className="text-xs text-destructive">{logoFileError}</p>
                    )}
                    {logoPreview && (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="mt-1 h-12 w-auto rounded-md border object-contain"
                      />
                    )}
                    <p className="text-xs text-muted-foreground">PNG, JPEG, or WebP — max 256 KB.</p>
                  </div>
                )}
              </div>
              <FormInputField
                label="Favicon URL"
                placeholder="https://…/favicon.ico"
                disabled={isLoading}
                error={errors.favicon_url?.message}
                {...register("favicon_url")}
              />
              <FormInputField
                label="Support URL"
                placeholder="https://…/support"
                disabled={isLoading}
                error={errors.support_url?.message}
                {...register("support_url")}
              />
              <FormInputField
                label="Privacy policy URL"
                placeholder="https://…/privacy"
                disabled={isLoading}
                error={errors.privacy_policy_url?.message}
                {...register("privacy_policy_url")}
              />
              <FormInputField
                label="Terms of service URL"
                placeholder="https://…/terms"
                disabled={isLoading}
                error={errors.terms_of_service_url?.message}
                containerClassName="sm:col-span-2"
                {...register("terms_of_service_url")}
              />
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base">Theme tokens</CardTitle>
              <p className="text-sm text-muted-foreground">
                A fixed set of theme variables. Keys are defined by the system — set their values to
                style the auth experience.
              </p>
            </CardHeader>
            <CardContent className="divide-y">
              {THEME_TOKENS.map((t) => (
                <ThemeTokenRow
                  key={tokenId(t)}
                  token={t}
                  value={tokens[tokenId(t)] ?? ""}
                  disabled={isLoading}
                  onChange={(v) => setToken(tokenId(t), v)}
                />
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(backTo)} disabled={isLoading}>
              Cancel
            </Button>
            <FormSubmitButton isSubmitting={isLoading} submitText={submitButtonText} />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function ThemeTokenRow({
  token,
  value,
  disabled,
  onChange,
}: {
  token: ThemeToken
  value: string
  disabled?: boolean
  onChange: (v: string) => void
}) {
  const isColor = token.kind === "color"

  return (
    <div className="grid grid-cols-1 items-center gap-2 py-3 sm:grid-cols-[1fr_300px]">
      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
        <Lock className="size-3 shrink-0 text-muted-foreground/60" aria-hidden />
        <span className="text-sm font-medium">{token.label}</span>
        <code className="text-[11px] text-muted-foreground">
          {token.group}.{token.key}
        </code>
      </div>
      {isColor ? (
        <div className="flex items-center gap-2">
          <span
            className="size-8 shrink-0 rounded-md border"
            style={{ backgroundColor: isHex(value) ? value : "transparent" }}
            aria-hidden
          />
          <Input
            type="color"
            value={isHex(value) ? value : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="h-9 w-12 shrink-0 cursor-pointer p-1"
            aria-label={`${token.label} color picker`}
          />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="#000000"
            className="font-mono text-sm"
            aria-label={`${token.label} value`}
          />
        </div>
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Inter, system-ui, sans-serif"
          aria-label={`${token.label} value`}
        />
      )}
    </div>
  )
}
