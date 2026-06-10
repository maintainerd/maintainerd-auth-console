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
// `setup/types` shares `CreateProfileRequest`/`CreateProfileResponse` with
// `auth/types`; auth's definitions win, so re-export setup's remaining members
// explicitly to avoid the ambiguous-wildcard conflict.
export type {
  CreateTenantRequest,
  TenantData,
  CreateTenantResponse,
  CreateAdminRequest,
  AdminData,
  CreateAdminResponse,
  ProfileData,
  SetupStatusData,
  SetupStatusResponse,
  CompleteSetupData,
  CompleteSetupResponse,
} from './api/setup/types'
// `tenants/types` shares `CreateTenantRequest` with `setup/types`; setup's
// definition wins, so re-export tenants' remaining members explicitly.
export type {
  TenantStatus,
  TenantEntity,
  TenantListParams,
  UpdateTenantRequest,
  TenantResponse,
  TenantListResponse,
} from './api/tenants/types'
export type * from './api/services/types'
export type * from './api/api/types'
export type * from './api/policies/types'
export type * from './api/clients/types'
export type * from './api/api-keys/types'

// Setup service functions
export {
  setupService,
  createTenant,
  createAdmin,
  createProfile,
  getSetupStatus,
  completeSetup,
  getDefaultTenantMetadata,
  createTenantWithDefaults,
  isSetupCompleted,
} from './api/setup'

// Authentication service functions
export {
  authService,
  login,
  verifyMFALogin,
  sendMFALoginSMS,
  beginMFALoginWebAuthn,
  register,
  logout,
  fetchProfile,
  createUserProfile,
  createRegisterProfile,
  validateAuthentication,
  forgotPassword,
  resetPassword,
} from './api/auth'
// `ResetPasswordQueryParams` is a type-only member surfaced through the
// `./api/auth/types` wildcard above (the `./api/auth` value module does not
// re-export it).

// Tenant service functions
export {
  tenantService,
  fetchDefaultTenant,
  fetchTenantByIdentifier,
  fetchTenant
} from './api/tenants'

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
} from './api/services'

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
} from './api/policies'

// Client service functions
export {
  clientService,
  fetchClients,
  fetchClientById,
  createClient,
  updateClient,
  deleteClient,
  updateClientStatus
} from './api/clients'

// API Key service functions
export {
  fetchApiKeys,
  fetchApiKeyById,
  createApiKey,
  updateApiKey,
  deleteApiKey,
  updateApiKeyStatus,
  fetchApiKeyConfig
} from './api/api-keys'

// Add more services as they are created
// export { userService, UserService } from './user_service'
