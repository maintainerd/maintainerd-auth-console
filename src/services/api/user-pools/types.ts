/**
 * User Pool API Types
 */

import type { Status } from '@/types/status'

/**
 * User pool status type — defines valid statuses for User Pools only
 */
export type UserPoolStatus = Extract<Status, 'active' | 'inactive'>

/**
 * User pool entity.
 *
 * Note: the backend serializes the pool's UUID under the `user_pool_id` key.
 */
export interface UserPool {
  user_pool_id: string
  name: string
  display_name: string
  identifier: string
  is_system: boolean
  status: UserPoolStatus
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

/**
 * Create User Pool request interface
 */
export interface CreateUserPoolRequest {
  name: string
  display_name: string
  status: UserPoolStatus
  metadata?: Record<string, unknown>
}

/**
 * Update User Pool request interface
 */
export interface UpdateUserPoolRequest {
  name: string
  display_name: string
  status: UserPoolStatus
  metadata?: Record<string, unknown>
}
