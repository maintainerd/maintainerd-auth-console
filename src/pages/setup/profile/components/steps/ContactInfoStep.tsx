import { useEffect, useRef, useMemo } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { FieldGroup } from "@/components/ui/field"
import { FormInputField, FormLoginCard } from "@/components/form"
import { setupProfileContactSchema } from "@/lib/validations"
import type { CreateProfileRequest } from "@/services/api/types/setup"

interface ContactInfoStepProps {
  data: Partial<CreateProfileRequest>
  onDataChange: (data: Partial<CreateProfileRequest>) => void
  onValidationChange: (isValid: boolean) => void
}

const ContactInfoStep = ({ data, onDataChange, onValidationChange }: ContactInfoStepProps) => {
  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(setupProfileContactSchema),
    mode: "onChange",
    defaultValues: {
      email: data.email || "",
      phone: data.phone || ""
    }
  })

  // Watch all form values
  const watchedValues = watch()

  // Memoize form data to prevent unnecessary updates
  const formData = useMemo(() => ({
    email: watchedValues.email || undefined,
    phone: watchedValues.phone || undefined
  }), [
    watchedValues.email,
    watchedValues.phone
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



  return (
    <FormLoginCard
      title="Contact Information"
      description="How can we reach you?"
    >
      <div className="space-y-6">
        <FieldGroup>
          <FormInputField
            label="Email Address"
            type="email"
            placeholder="john.doe@company.com"
            description="This will be used for account notifications and communications"
            error={errors.email?.message}
            required
            {...register("email")}
          />

          <FormInputField
            label="Phone Number"
            type="tel"
            placeholder="+1234567890"
            description="Include country code (optional)"
            error={errors.phone?.message}
            {...register("phone")}
          />


        </FieldGroup>
      </div>
    </FormLoginCard>
  )
}

export default ContactInfoStep
