/**
 * Services Index
 * Central export point for all services
 */

// API Client and utilities
export { apiClient, ApiError, get, post, put, deleteRequest, patch } from './api/client'
export { API_CONFIG, API_ENDPOINTS } from './api/config'
export type * from './api/types'

// Service-specific API types
export type * from './api/auth/types'
export type * from './api/setup/types'
export type * from './api/tenant/types'

// Setup service functions
export {
  setupService,
  createTenant,
  createAdmin,
  createProfile,
  getDefaultTenantMetadata,
  createTenantWithDefaults,
  isSetupCompleted
} from './api/setup'

// Authentication service functions (API + Storage)
export {
  authService,
  login,
  logout,
  fetchAndStoreProfile,
  getUserProfile,
  clearProfile,
  isAuthenticated,
  validateAuthentication
} from './api/auth'

// Tenant service functions (API + Storage)
export {
  tenantService,
  fetchAndStoreDefaultTenant,
  fetchAndStoreTenantByIdentifier,
  fetchAndStoreTenant,
  getCurrentTenant,
  clearTenant,
  hasTenant
} from './api/tenant'

// Storage utilities
export { authStorage } from './storage/auth'
export { tenantStorage } from './storage/tenant'
export { LocalStorageAdapter, localStorageAdapter } from './storage/adapters'
export type * from './storage/types'

// Add more services as they are created
// export { userService, UserService } from './user_service'
