/**
 * Tenant Reducers
 * Exports the tenant reducer and actions
 */

export { default as tenantReducer } from './slice'
export { clearError, setCurrentTenant, clearTenant } from './slice'
export {
  fetchTenantAsync,
  fetchDefaultTenantAsync,
  fetchTenantByIdentifierAsync,
  initializeTenantAsync
} from './actions'
export type { TenantStateInterface } from './types'