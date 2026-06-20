import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Save, Users, Settings as SettingsIcon } from "lucide-react"
import { useUpdateTenant, useDeleteTenant } from "@/hooks/useTenants"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { DetailsContainer } from "@/components/container"
import { useAppSelector } from "@/store/hooks"
import { useToast } from "@/hooks/useToast"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { tenantSettingsSchema, type TenantSettingsFormData } from "@/lib/validations"
import type { UpdateTenantRequest } from "@/services/api/tenants/types"
import { GeneralSettings, MembersSettings, AdvancedSettings } from "./components"

export default function TenantSettingsPage() {
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()
  const { showSuccess, showError } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const currentTenant = useAppSelector((state) => state.tenant.currentTenant)

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
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  // Watch all form values
  const formValues = watch()

  // Load saved settings when data is fetched
  useEffect(() => {
    if (currentTenant) {
      const formData = {
        name: currentTenant.name,
        display_name: currentTenant.display_name,
        description: currentTenant.description,
      }
      reset(formData)
    }
  }, [currentTenant, reset])

  const handleUpdate = (updates: Partial<TenantSettingsFormData>) => {
    Object.entries(updates).forEach(([key, value]) => {
      setValue(key as keyof TenantSettingsFormData, value, { 
        shouldValidate: false,
        shouldDirty: true 
      })
    })
  }

  const onSubmit = async (data: TenantSettingsFormData) => {
    if (!tenantId) return

    try {
      const payload: UpdateTenantRequest = {
        name: data.name,
        display_name: data.display_name,
        description: data.description,
        status: 'active',
      }
      await updateTenantMutation.mutateAsync({
        tenantId,
        data: payload
      })
      showSuccess('Tenant settings saved successfully')
    } catch (error) {
      showError(error)
    }
  }

  const handleDelete = async () => {
    if (!tenantId) return
    
    await deleteTenantMutation.mutateAsync(tenantId)
    setDeleteDialogOpen(false)
    // Navigate to dashboard after deletion
    navigate(`/${tenantId}/dashboard`)
  }

  if (!tenantId || !currentTenant) {
    return (
      <DetailsContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Tenant Not Found</h2>
            <p className="text-muted-foreground mt-2">
              No tenant selected. Please select a tenant from the dashboard.
            </p>
          </div>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <GeneralSettings 
                  tenant={currentTenant}
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
              </form>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-6">
              <MembersSettings />
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-6">
              <AdvancedSettings 
                tenant={currentTenant}
                onDeleteClick={() => setDeleteDialogOpen(true)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Tenant"
        description={`This will permanently delete the tenant "${currentTenant.name}" and all associated data.`}
        confirmationText="This action cannot be undone. All data associated with this tenant will be permanently deleted."
        itemName={currentTenant.name}
        isDeleting={deleteTenantMutation.isPending}
      />
    </DetailsContainer>
  )
}
