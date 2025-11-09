import { useEffect, useRef, useMemo } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { FieldGroup } from "@/components/ui/field"
import { FormInputField, FormTextareaField, FormSelectField, FormDateField, FormSetupCard } from "@/components/form"
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
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(setupProfilePersonalSchema),
    mode: "onChange",
    defaultValues: {
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      bio: data.bio || "",
      birthdate: data.birthdate || "",
      gender: data.gender || ""
    }
  })

  // Watch all form values
  const watchedValues = watch()

  // Memoize form data to prevent unnecessary updates
  const formData = useMemo(() => {
    const firstName = watchedValues.first_name?.trim()
    const lastName = watchedValues.last_name?.trim()
    const displayName = firstName && lastName ? `${firstName} ${lastName}` : undefined

    return {
      first_name: watchedValues.first_name || undefined,
      last_name: watchedValues.last_name || undefined,
      display_name: displayName,
      bio: watchedValues.bio || undefined,
      birthdate: watchedValues.birthdate || undefined,
      gender: watchedValues.gender || undefined
    }
  }, [
    watchedValues.first_name,
    watchedValues.last_name,
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

  const handleGenderChange = (value: string) => {
    setValue("gender", value, { shouldValidate: true })
  }

  return (
    <FormSetupCard
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
            <FormDateField
              label="Date of Birth"
              value={watchedValues.birthdate || ""}
              onChange={(value) => setValue("birthdate", value, { shouldValidate: true })}
              error={errors.birthdate?.message}
              name="birthdate"
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
    </FormSetupCard>
  )
}

export default PersonalInfoStep
