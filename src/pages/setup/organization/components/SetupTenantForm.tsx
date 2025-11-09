
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import { FormInputField, FormTextareaField } from "@/components/form"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { setupService } from "@/services"
import { setupTenantSchema, type SetupTenantFormData } from "@/lib/validations"
import { useToast } from "@/hooks/useToast"

const SetupTenantForm = () => {
	const navigate = useNavigate()
	const { showError, showSuccess } = useToast()

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<SetupTenantFormData>({
		resolver: yupResolver(setupTenantSchema),
		defaultValues: {
			name: "",
			description: ""
		}
	})

	const onSubmit = async (data: SetupTenantFormData) => {
		try {
			await setupService.createTenantWithDefaults(
				data.name,
				data.description
			)

			showSuccess("Tenant created successfully!")
			navigate(`/setup/admin`)
		} catch (err) {
			showError(err, "Failed to create tenant")
		}
	}

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Setup Tenant</CardTitle>
          <CardDescription>
            Enter your tenant details below to create your tenant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FormInputField
                label="Tenant Name"
                placeholder="Enter tenant name"
                disabled={isSubmitting}
                error={errors.name?.message}
                required
                {...register("name")}
              />

              <FormTextareaField
                label="Description"
                placeholder="Brief description of your tenant"
                rows={2}
                disabled={isSubmitting}
                error={errors.description?.message}
                required
                {...register("description")}
              />
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="animate-spin" />}
                  {isSubmitting ? "Creating Tenant..." : "Create Tenant"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SetupTenantForm;
