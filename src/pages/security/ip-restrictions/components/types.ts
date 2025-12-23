/**
 * Base props for IP restriction settings components
 */

import type { Control, UseFormWatch } from 'react-hook-form'
import type { IpRestrictionSettingsFormData } from '@/lib/validations/ipRestrictionSettingsSchema'

export interface BaseIpRestrictionSettingsProps {
  control: Control<IpRestrictionSettingsFormData>
  watch: UseFormWatch<IpRestrictionSettingsFormData>
}
