/**
 * Reusable Form Switch Field Component
 * A flexible switch field with label, description, and error handling
 */

import { Switch } from "@/components/ui/switch"
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { cn } from "@/lib/utils"

export interface FormSwitchFieldProps {
  label: string
  description?: string
  error?: string
  disabled?: boolean
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
  descriptionClassName?: string
  id?: string
  layout?: "horizontal" | "vertical"
}

export function FormSwitchField({
  label,
  description,
  error,
  disabled = false,
  checked,
  onCheckedChange,
  containerClassName,
  labelClassName,
  errorClassName,
  descriptionClassName,
  id,
  layout = "horizontal",
}: FormSwitchFieldProps) {
  // Generate ID if not provided
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <Field className={cn(containerClassName)}>
      <div className={cn(
        "flex items-center",
        layout === "horizontal" ? "justify-between" : "flex-col items-start gap-2"
      )}>
        <div className="space-y-0.5 flex-1">
          <FieldLabel
            htmlFor={fieldId}
            className={cn("text-base", labelClassName)}
          >
            {label}
          </FieldLabel>
          {description && (
            <FieldDescription className={cn("text-sm", descriptionClassName)}>
              {description}
            </FieldDescription>
          )}
        </div>
        <Switch
          id={fieldId}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      </div>

      {error && (
        <FieldError className={cn("text-red-600", errorClassName)}>
          {error}
        </FieldError>
      )}
    </Field>
  )
}

FormSwitchField.displayName = "FormSwitchField"
