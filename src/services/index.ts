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
export type * from './api/service/types'
export type * from './api/api/types'
export type * from './api/policy/types'
export type * from './api/auth-client/types'

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

// Authentication service functions
export {
  authService,
  login,
  register,
  logout,
  fetchProfile,
  createUserProfile,
  createRegisterProfile,
  validateAuthentication,
  forgotPassword,
  resetPassword,
  type ResetPasswordQueryParams
} from './api/auth'

// Tenant service functions
export {
  tenantService,
  fetchDefaultTenant,
  fetchTenantByIdentifier,
  fetchTenant
} from './api/tenant'

// Service service functions
export {
  serviceService,
  fetchServices,
  fetchServiceById,
  createService,
  updateService,
  deleteService,
  updateServiceStatus,
  assignPolicyToService,
  removePolicyFromService
} from './api/service'

// API service functions
export {
  apiService,
  fetchApis,
  fetchApiById,
  createApi,
  updateApi,
  deleteApi,
  updateApiStatus
} from './api/api'

// Policy service functions
export {
  policyService,
  fetchPolicies,
  fetchPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
  updatePolicyStatus,
  fetchServicesByPolicy
} from './api/policy'

// Client service functions
export {
  clientService,
  fetchClients,
  fetchClientById,
  createClient,
  updateClient,
  deleteClient,
  updateClientStatus
} from './api/auth-client'

// Add more services as they are created
// export { userService, UserService } from './user_service'
