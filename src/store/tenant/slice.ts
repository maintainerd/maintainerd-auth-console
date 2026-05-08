/**
 * Tenant Slice
 * Redux slice for tenant state management
 */

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { tenantExtraReducers } from './extra-reducers'
import type { TenantState } from './types'
import type { TenantEntity } from '@/services/api/tenants/types'

const initialState: TenantState = {
  currentTenant: null,
  isLoading: false,
  error: null
}

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    clearError: (state: TenantState) => {
      state.error = null
    },
    setCurrentTenant: (state: TenantState, action: PayloadAction<TenantEntity | null>) => {
      state.currentTenant = action.payload
    },
    clearTenant: (state: TenantState) => {
      state.currentTenant = null
      state.error = null
    }
  },
  extraReducers: tenantExtraReducers
})

export const { clearError, setCurrentTenant, clearTenant } = tenantSlice.actions
export default tenantSlice.reducer
