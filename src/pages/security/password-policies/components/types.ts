/**
 * Base types for password policies settings components
 */

import type { FieldErrors } from "react-hook-form"
import type { PasswordPoliciesFormData } from "@/lib/validations"

export interface BasePasswordPoliciesProps {
  onUpdate: (updates: Partial<PasswordPoliciesFormData>) => void
  errors?: FieldErrors<PasswordPoliciesFormData>
}
