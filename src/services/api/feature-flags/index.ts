import { get, put } from '@/services'
import type { FeatureFlags, FeatureFlagsPayload, FeatureFlagsResponse } from './types'

export async function fetchFeatureFlags(): Promise<FeatureFlags> {
  const response = await get<FeatureFlagsResponse>('/tenant-settings/feature-flags')
  if (!response.success) throw new Error(response.message || 'Failed to fetch feature flags')
  return response.data
}

export async function updateFeatureFlags(data: FeatureFlagsPayload): Promise<FeatureFlags> {
  const response = await put<FeatureFlagsResponse>('/tenant-settings/feature-flags', data)
  if (!response.success) throw new Error(response.message || 'Failed to update feature flags')
  return response.data
}
