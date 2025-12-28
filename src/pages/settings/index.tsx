import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Save, Users, Settings as SettingsIcon } from "lucide-react"
import { useTenantById, useUpdateTenant, useDeleteTenant } from "@/hooks/useTenants"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { DetailsContainer } from "@/components/container"
import { useAppSelector } from "@/store/hooks"
import { useToast } from "@/hooks/useToast"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { tenantSettingsSchema, type TenantSettingsFormData } from "@/lib/validations"
import type { UpdateTenantRequest } from "@/services/api/tenant/types"
import { GeneralSettings, MembersSettings, AdvancedSettings } from "./components"

export default function TenantSettingsPage() {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const currentTenant = useAppSelector((state) => state.tenant.currentTenant)
  
  const { data: tenant, isLoading, isError } = useTenantById(currentTenant?.tenant_id)
  const updateTenantMutation = useUpdateTenant()
  const deleteTenantMutation = useDeleteTenant()

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<TenantSettingsFormData>({
    resolver: yupResolver(tenantSettingsSchema),
    defaultValues: {
      name: "",
      display_name: "",
      description: "",
      is_public: false,
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  // Watch all form values
  const formValues = watch()

  // Load saved settings when data is fetched
  useEffect(() => {
    if (tenant) {
      const formData = {
        name: tenant.name,
        display_name: tenant.display_name,
        description: tenant.description,
        is_public: tenant.is_public,
      }
      reset(formData)
    }
  }, [tenant, reset])

  const handleUpdate = (updates: Partial<TenantSettingsFormData>) => {
    Object.entries(updates).forEach(([key, value]) => {
      setValue(key as keyof TenantSettingsFormData, value, { 
        shouldValidate: false,
        shouldDirty: true 
      })
    })
  }

  const onSubmit = async (data: TenantSettingsFormData) => {
    if (!currentTenant?.tenant_id) return

    try {
      const payload: UpdateTenantRequest = {
        name: data.name,
        display_name: data.display_name,
        description: data.description,
        status: 'active',
        is_public: data.is_public,
      }
      await updateTenantMutation.mutateAsync({
        tenantId: currentTenant.tenant_id,
        data: payload
      })
      showSuccess('Tenant settings saved successfully')
    } catch (error) {
      showError(error)
    }
  }

  const handleDelete = async () => {
    if (!currentTenant?.tenant_id) return
    
    await deleteTenantMutation.mutateAsync(currentTenant.tenant_id)
    setDeleteDialogOpen(false)
    // Navigate to dashboard after deletion
    navigate(`/${currentTenant.tenant_id}/dashboard`)
  }

  // Loading state
  if (isLoading) {
    return (
      <DetailsContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Loading...</h2>
            <p className="text-muted-foreground mt-2">
              Fetching tenant settings
            </p>
          </div>
        </div>
      </DetailsContainer>
    )
  }

  // Error state
  if (isError || !tenant) {
    return (
      <DetailsContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Error Loading Settings</h2>
            <p className="text-muted-foreground mt-2">
              Failed to load tenant settings. Please try again.
            </p>
          </div>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Tenant Settings</h1>
          <p className="text-muted-foreground">
            Manage your tenant configuration and preferences
          </p>
        </div>

        <div className="grid gap-6">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList>
              <TabsTrigger value="general" className="gap-2">
                <SettingsIcon className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="members" className="gap-2">
                <Users className="h-4 w-4" />
                Members
              </TabsTrigger>
              <TabsTrigger value="advanced" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Advanced
              </TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-6">
              <GeneralSettings 
                tenant={tenant}
                settings={formValues}
                onUpdate={handleUpdate}
                errors={errors}
              />

              <div className="flex justify-end">
                <Button 
                  type="submit"
                  disabled={updateTenantMutation.isPending || isSubmitting} 
                  className="gap-2 min-w-[140px] px-6"
                >
                  <Save className="h-4 w-4" />
                  {updateTenantMutation.isPending || isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-6">
              <MembersSettings />
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-6">
              <AdvancedSettings 
                tenant={tenant}
                onDeleteClick={() => setDeleteDialogOpen(true)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Tenant"
        description={`This will permanently delete the tenant "${tenant.name}" and all associated data.`}
        confirmationText="This action cannot be undone. All data associated with this tenant will be permanently deleted."
        itemName={tenant.name}
        isDeleting={deleteTenantMutation.isPending}
      />
    </DetailsContainer>
  )
}
