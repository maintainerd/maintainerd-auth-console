import { SettingsCard } from "@/components/card"
import { FormSelectField, type SelectOption } from "@/components/form"
import { FileText } from "lucide-react"
import type { BaseSettingsProps } from "./types"
import type { SecuritySettingsFormData } from "@/lib/validations"
import { Controller } from "react-hook-form"
import type { Control } from "react-hook-form"

interface ComplianceSettingsProps extends BaseSettingsProps {
  settings: SecuritySettingsFormData
  control: Control<SecuritySettingsFormData>
}

const COMPLIANCE_OPTIONS: SelectOption[] = [
  { value: "standard", label: "Standard" },
  { value: "gdpr", label: "GDPR Compliant" },
  { value: "hipaa", label: "HIPAA Compliant" },
  { value: "sox", label: "SOX Compliant" },
  { value: "pci", label: "PCI DSS Compliant" },
]

export function ComplianceSettings({ control, errors }: ComplianceSettingsProps) {
  return (
    <SettingsCard
      title="Compliance"
      description="Configure compliance framework and global security standards"
      icon={FileText}
      contentClassName="space-y-4"
    >
      <Controller
        name="complianceMode"
        control={control}
        render={({ field }) => (
          <FormSelectField
            key={`complianceMode-${field.value || 'empty'}`}
            label="Compliance mode"
            description="Select the compliance framework that applies to your organization"
            options={COMPLIANCE_OPTIONS}
            value={field.value}
            onValueChange={field.onChange}
            className="w-48"
            error={errors?.complianceMode?.message}
          />
        )}
      />
    </SettingsCard>
  )
}
