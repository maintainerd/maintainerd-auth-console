/**
 * Auth Extra Reducers
 * Async thunk reducers for auth slice
 */

import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import { loginAsync, registerAsync, logoutAsync, validateAuthAsync, initializeAuthAsync, fetchProfileAsync } from './actions'
import type { AuthStateInterface } from './types'

export const authExtraReducers = (builder: ActionReducerMapBuilder<AuthStateInterface>) => {
  builder
    // Login
    .addCase(loginAsync.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    .addCase(loginAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.profile = action.payload.data
      state.isAuthenticated = true
      state.error = null
    })
    .addCase(loginAsync.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message || 'Login failed'
    })
    // Register
    .addCase(registerAsync.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    .addCase(registerAsync.fulfilled, (state) => {
      state.isLoading = false
      state.error = null
      // Note: Registration doesn't automatically log the user in
      // They need to login after successful registration
    })
    .addCase(registerAsync.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message || 'Registration failed'
    })
    // Logout
    .addCase(logoutAsync.pending, (state) => {
      state.isLoading = true
    })
    .addCase(logoutAsync.fulfilled, (state) => {
      state.isLoading = false
      state.profile = null
      state.isAuthenticated = false
      state.error = null
    })
    .addCase(logoutAsync.rejected, (state, action) => {
      state.isLoading = false
      state.profile = null
      state.isAuthenticated = false
      state.error = action.error.message || 'Logout failed'
    })
    // Validate
    .addCase(validateAuthAsync.fulfilled, (state, action) => {
      state.profile = action.payload
      state.isAuthenticated = true
    })
    .addCase(validateAuthAsync.rejected, (state) => {
      state.profile = null
      state.isAuthenticated = false
    })
    // Initialize
    .addCase(initializeAuthAsync.pending, (state) => {
      state.isLoading = true
    })
    .addCase(initializeAuthAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isInitialized = true
      state.profile = action.payload
      state.isAuthenticated = !!action.payload
    })
    .addCase(initializeAuthAsync.rejected, (state) => {
      state.isLoading = false
      state.isInitialized = true
      state.profile = null
      state.isAuthenticated = false
    })
    // Fetch Profile
    .addCase(fetchProfileAsync.fulfilled, (state, action) => {
      state.profile = action.payload
      state.isAuthenticated = true
    })
    .addCase(fetchProfileAsync.rejected, (state) => {
      state.profile = null
      state.isAuthenticated = false
    })
}
