import { useEffect, useRef, useMemo } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { FieldGroup } from "@/components/ui/field"
import { FormInputField, FormTextareaField, FormSelectField, FormDateField, FormLoginCard } from "@/components/form"
import { setupProfilePersonalSchema } from "@/lib/validations"
import { genderOptions } from "@/lib/constants"
import type { CreateProfileRequest } from "@/services/api/types/setup"

interface PersonalInfoStepProps {
  data: Partial<CreateProfileRequest>
  onDataChange: (data: Partial<CreateProfileRequest>) => void
  onValidationChange: (isValid: boolean) => void
}

const PersonalInfoStep = ({ data, onDataChange, onValidationChange }: PersonalInfoStepProps) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger
  } = useForm({
    resolver: yupResolver(setupProfilePersonalSchema),
    mode: "onChange",
    defaultValues: {
      first_name: data.first_name || "",
      middle_name: data.middle_name || "",
      last_name: data.last_name || "",
      suffix: data.suffix || "",
      display_name: data.display_name || "",
      bio: data.bio || "",
      birthdate: data.birthdate || "",
      gender: data.gender || ""
    }
  })

  // Watch all form values
  const watchedValues = watch()

  // Memoize form data to prevent unnecessary updates
  const formData = useMemo(() => ({
    first_name: watchedValues.first_name || undefined,
    last_name: watchedValues.last_name || undefined,
    middle_name: watchedValues.middle_name || undefined,
    suffix: watchedValues.suffix || undefined,
    display_name: watchedValues.display_name || undefined,
    bio: watchedValues.bio || undefined,
    birthdate: watchedValues.birthdate || undefined,
    gender: watchedValues.gender || undefined
  }), [
    watchedValues.first_name,
    watchedValues.last_name,
    watchedValues.middle_name,
    watchedValues.suffix,
    watchedValues.display_name,
    watchedValues.bio,
    watchedValues.birthdate,
    watchedValues.gender
  ])

  // Update parent component when form data changes
  useEffect(() => {
    onDataChange(formData)
  }, [formData, onDataChange])

  // Track previous validation state to prevent unnecessary calls
  const prevIsValidRef = useRef(isValid)

  // Update validation state when form validity changes
  useEffect(() => {
    if (prevIsValidRef.current !== isValid) {
      prevIsValidRef.current = isValid
      onValidationChange(isValid)
    }
  }, [isValid, onValidationChange])

  // Auto-generate display name from first and last name
  useEffect(() => {
    const firstName = watchedValues.first_name?.trim()
    const lastName = watchedValues.last_name?.trim()
    
    if (firstName && lastName && !watchedValues.display_name) {
      const displayName = `${firstName} ${lastName}`
      onDataChange({ ...watchedValues, display_name: displayName } as Partial<CreateProfileRequest>)
      // Trigger validation for display_name field
      trigger('display_name')
    }
  }, [watchedValues.first_name, watchedValues.last_name, watchedValues.display_name, onDataChange, trigger])

  const handleGenderChange = (value: string) => {
    setValue("gender", value, { shouldValidate: true })
  }

  return (
    <FormLoginCard
        title="Personal Information"
        description="Tell us about yourself to personalize your experience"
      >
        <div className="space-y-6">
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInputField
              label="First Name"
              placeholder="John"
              error={errors.first_name?.message}
              required
              {...register("first_name")}
            />
            <FormInputField
              label="Last Name"
              placeholder="Doe"
              error={errors.last_name?.message}
              required
              {...register("last_name")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInputField
              label="Middle Name"
              placeholder="Michael (optional)"
              error={errors.middle_name?.message}
              {...register("middle_name")}
            />
            <FormInputField
              label="Suffix"
              placeholder="Jr., Sr., III (optional)"
              error={errors.suffix?.message}
              {...register("suffix")}
            />
          </div>

          <FormInputField
            label="Display Name"
            placeholder="How you'd like to be addressed"
            description="This is how your name will appear to others"
            error={errors.display_name?.message}
            required
            {...register("display_name")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormDateField
              label="Date of Birth"
              error={errors.birthdate?.message}
              {...register("birthdate")}
            />

            <FormSelectField
              label="Gender"
              placeholder="Select gender (optional)"
              options={genderOptions}
              value={watchedValues.gender || ""}
              onValueChange={handleGenderChange}
              error={errors.gender?.message}
            />
          </div>

          <FormTextareaField
            label="Bio"
            placeholder="Tell us a bit about yourself (optional)"
            description="A brief description about yourself, your role, or interests"
            rows={3}
            error={errors.bio?.message}
            {...register("bio")}
          />
        </FieldGroup>
      </div>
    </FormLoginCard>
  )
}

export default PersonalInfoStep
