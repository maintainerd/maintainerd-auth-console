/**
 * Base props for threat detection settings components
 */

import type { Control, UseFormWatch } from 'react-hook-form'
import type { ThreatDetectionSettingsFormData } from '@/lib/validations/threatDetectionSettingsSchema'

export interface BaseThreatDetectionSettingsProps {
  control: Control<ThreatDetectionSettingsFormData>
  watch: UseFormWatch<ThreatDetectionSettingsFormData>
}
}
