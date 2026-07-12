import { forwardRef, useCallback } from "react"
import { FormInputField, type FormInputFieldProps } from "@/components/form"
import { sanitizeSlug } from "@/lib/validations/regex"

export type FormSlugFieldProps = Omit<FormInputFieldProps, 'type'>

export const FormSlugField = forwardRef<HTMLInputElement, FormSlugFieldProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = sanitizeSlug(e.target.value)
        if (sanitized !== e.target.value) {
          e.target.value = sanitized
        }
        onChange?.(e)
      },
      [onChange]
    )

    return (
      <FormInputField
        ref={ref}
        type="text"
        autoComplete="off"
        onChange={handleChange}
        {...props}
      />
    )
  }
)

FormSlugField.displayName = "FormSlugField"
