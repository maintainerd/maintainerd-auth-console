/**
 * Reusable Form Date Field Component
 * A flexible date input field with label, validation, and error handling
 */

import { forwardRef } from "react"
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface FormDateFieldProps extends Omit<React.ComponentProps<typeof Input>, 'type'> {
  label: string
  error?: string
  description?: string
  required?: boolean
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
  descriptionClassName?: string
}

export const FormDateField = forwardRef<HTMLInputElement, FormDateFieldProps>(
  (
    {
      label,
      error,
      description,
      required = false,
      containerClassName,
      labelClassName,
      errorClassName,
      descriptionClassName,
      className,
      id,
      ...props
    },
    ref
  ) => {
    // Generate ID if not provided
    const fieldId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
      <Field className={cn("space-y-2", containerClassName)}>
        <FieldLabel 
          htmlFor={fieldId} 
          className={cn(labelClassName)}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </FieldLabel>
        
        <Input
          id={fieldId}
          ref={ref}
          type="date"
          className={cn(
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />

        {description && (
          <FieldDescription className={cn(descriptionClassName)}>
            {description}
          </FieldDescription>
        )}
        
        {error && (
          <FieldError className={cn("text-red-600", errorClassName)}>
            {error}
          </FieldError>
        )}
      </Field>
    )
  }
)

FormDateField.displayName = "FormDateField"
