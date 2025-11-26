/**
 * Global Status Types
 * Defines all possible status values across the entire application
 */

/**
 * Global status type that encompasses all possible statuses from different features
 */
export type StatusType = 
  | 'active'
  | 'inactive'
  | 'pending'
  | 'suspended'
  | 'maintenance'
  | 'deprecated'
  | 'draft'
  | 'configuring'
  | 'expired'

