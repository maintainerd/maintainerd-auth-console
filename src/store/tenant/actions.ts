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
    if (currentTenant) {
      return currentTenant
    }
    
    // If not, fetch and store tenant
    return await fetchAndStoreTenant(identifier)
  }
)
