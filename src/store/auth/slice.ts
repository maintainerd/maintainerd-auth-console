/**
 * Auth Slice
 * Redux slice for authentication state management
 */

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { authExtraReducers } from './extra-reducers'
import type { AuthState } from './types'
import type { ProfileEntity } from '@/services/api/auth/types'

const initialState: AuthState = {
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state: AuthState) => {
      state.error = null
    },
    setProfile: (state: AuthState, action: PayloadAction<ProfileEntity | null>) => {
      state.profile = action.payload
      state.isAuthenticated = !!action.payload
    },
    clearAuth: (state: AuthState) => {
      state.profile = null
      state.isAuthenticated = false
      state.error = null
    }
  },
  extraReducers: authExtraReducers
})

export const { clearError, setProfile, clearAuth } = authSlice.actions
export default authSlice.reducer
