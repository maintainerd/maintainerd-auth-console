/**
 * Base props for session settings components
 */

import type { Control, UseFormWatch } from 'react-hook-form'
import type { SessionSettingsFormData } from '@/lib/validations/sessionSettingsSchema'

export interface BaseSessionSettingsProps {
  control: Control<SessionSettingsFormData>
  watch: UseFormWatch<SessionSettingsFormData>
}
