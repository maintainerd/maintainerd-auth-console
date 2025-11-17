/**
 * Tenant Slice
 * Redux slice for tenant state management
 */

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { tenantExtraReducers } from './extra-reducers'
import type { TenantStateInterface } from './types'
import type { TenantType } from '@/types'

const initialState: TenantStateInterface = {
  currentTenant: null,
  isLoading: false,
  error: null
}

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    clearError: (state: TenantStateInterface) => {
      state.error = null
    },
    setCurrentTenant: (state: TenantStateInterface, action: PayloadAction<TenantType | null>) => {
      state.currentTenant = action.payload
    },
    clearTenant: (state: TenantStateInterface) => {
      state.currentTenant = null
      state.error = null
    }
  },
  extraReducers: tenantExtraReducers
})

export const { clearError, setCurrentTenant, clearTenant } = tenantSlice.actions
export default tenantSlice.reducer
