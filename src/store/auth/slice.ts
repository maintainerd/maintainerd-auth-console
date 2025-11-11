/**
 * Auth Slice
 * Redux slice for authentication state management
 */

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { authExtraReducers } from './extra-reducers'
import type { AuthStateInterface } from './types'
import type { AuthUserType } from '@/types'

const initialState: AuthStateInterface = {
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state: AuthStateInterface) => {
      state.error = null
    },
    setProfile: (state: AuthStateInterface, action: PayloadAction<AuthUserType | null>) => {
      state.profile = action.payload
      state.isAuthenticated = !!action.payload
    },
    clearAuth: (state: AuthStateInterface) => {
      state.profile = null
      state.isAuthenticated = false
      state.error = null
    }
  },
  extraReducers: authExtraReducers
})

export const { clearError, setProfile, clearAuth } = authSlice.actions
export default authSlice.reducer
