/**
 * Tenant Actions
 * Redux async thunks for tenant operations
 */

import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  getCurrentTenant as getTenant,
  fetchAndStoreTenant,
  fetchAndStoreDefaultTenant,
  fetchAndStoreTenantByIdentifier
} from '@/services'

export const fetchTenantAsync = createAsyncThunk(
  'tenant/fetch',
  async (identifier?: string) => {
    return await fetchAndStoreTenant(identifier)
  }
)

export const fetchDefaultTenantAsync = createAsyncThunk(
  'tenant/fetchDefault',
  async () => {
    return await fetchAndStoreDefaultTenant()
  }
)

export const fetchTenantByIdentifierAsync = createAsyncThunk(
  'tenant/fetchByIdentifier',
  async (identifier: string) => {
    return await fetchAndStoreTenantByIdentifier(identifier)
  }
)

export const initializeTenantAsync = createAsyncThunk(
  'tenant/initialize',
  async (identifier?: string) => {
    // First check if we already have a tenant in localStorage
    const currentTenant = getTenant()

    // If we have a tenant, check if it matches the requested identifier
    if (currentTenant) {
      // If no specific identifier is requested, return current tenant
      if (!identifier) {
        return currentTenant
      }

      // If the current tenant matches the requested identifier, return it
      if (currentTenant.identifier === identifier) {
        return currentTenant
      }

      // If identifiers don't match, we need to fetch the correct tenant
      // This handles cases where user navigates to a different tenant URL
    }

    // Fetch and store the correct tenant (either no tenant exists or wrong tenant)
    return await fetchAndStoreTenant(identifier)
  }
)
