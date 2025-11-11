/**
 * Auth Extra Reducers
 * Async thunk reducers for auth slice
 */

import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import { loginAsync, logoutAsync, validateAuthAsync, initializeAuthAsync, fetchProfileAsync } from './actions'
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
      state.profile = action.payload.user
      state.isAuthenticated = true
      state.error = null
    })
    .addCase(loginAsync.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message || 'Login failed'
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
      state.profile = action.payload
      state.isAuthenticated = !!action.payload
    })
    .addCase(initializeAuthAsync.rejected, (state) => {
      state.isLoading = false
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
