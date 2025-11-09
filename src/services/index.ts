/**
 * Services Index
 * Central export point for all services
 */

// API Client and utilities
export { apiClient, ApiError, get, post, put, deleteRequest, patch } from './api/client'
export { API_CONFIG, API_ENDPOINTS } from './api/config'
export type * from './api/types'

// Setup service functions
export {
  setupService,
  createTenant,
  createAdmin,
  createProfile,
  getDefaultTenantMetadata,
  createTenantWithDefaults,
  isSetupCompleted
} from './setupService'

// Add more services as they are created
// export { authService, AuthService } from './auth_service'
// export { userService, UserService } from './user_service'
