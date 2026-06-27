/**
 * Auth Extra Reducers
 * Async thunk reducers for auth slice
 */

import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import { logoutAsync, validateAuthAsync, initializeAuthAsync, fetchProfileAsync, refreshAccountAsync } from './actions'
import type { AuthState } from './types'
import type { AccountEntity, ProfileEntity } from '@/services/api/auth/types'

function populateAccount(state: AuthState, account: AccountEntity | null) {
  state.account = account
  state.profile = account?.profiles?.[0] ? ({
    profile_id: account.profiles[0].profile_id,
    email: account.email,
    first_name: account.profiles[0].first_name,
    last_name: account.profiles[0].last_name || '',
    display_name: account.profiles[0].display_name || '',
    phone: account.phone,
    created_at: '',
    updated_at: '',
  } as ProfileEntity) : null
  state.roles = account?.roles ?? []
  state.permissions = account?.permissions ?? []
}

export const authExtraReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    // Logout
    .addCase(logoutAsync.pending, (state) => {
      state.isLoading = true
    })
    .addCase(logoutAsync.fulfilled, (state) => {
      state.isLoading = false
      populateAccount(state, null)
      state.isAuthenticated = false
      state.error = null
    })
    .addCase(logoutAsync.rejected, (state, action) => {
      state.isLoading = false
      populateAccount(state, null)
      state.isAuthenticated = false
      state.error = action.error.message || 'Logout failed'
    })
    // Validate
    .addCase(validateAuthAsync.fulfilled, (state, action) => {
      populateAccount(state, action.payload)
      state.isAuthenticated = true
    })
    .addCase(validateAuthAsync.rejected, (state) => {
      populateAccount(state, null)
      state.isAuthenticated = false
    })
    // Initialize
    .addCase(initializeAuthAsync.pending, (state) => {
      state.isLoading = true
    })
    .addCase(initializeAuthAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isInitialized = true
      populateAccount(state, action.payload)
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
      populateAccount(state, action.payload)
      state.isAuthenticated = true
    })
    .addCase(fetchProfileAsync.rejected, (state) => {
      populateAccount(state, null)
      state.isAuthenticated = false
    })
    // Refresh Account (sync auth state with the live cookie session)
    .addCase(refreshAccountAsync.fulfilled, (state, action) => {
      state.isInitialized = true
      populateAccount(state, action.payload)
      state.isAuthenticated = !!action.payload
    })
    .addCase(refreshAccountAsync.rejected, (state) => {
      populateAccount(state, null)
      state.isAuthenticated = false
    })
}
