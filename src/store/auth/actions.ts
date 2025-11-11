/**
 * Auth Actions
 * Redux async thunks for auth operations
 */

import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  login as authLogin,
  logout as authLogout,
  getUserProfile,
  validateAuthentication,
  clearProfile
} from '@/services'
import type { LoginCredentialsInterface } from '@/types'

export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }: LoginCredentialsInterface) => {
    const response = await authLogin(email, password)
    if (response.success) {
      const userProfile = getUserProfile()
      return { success: true, user: userProfile }
    }
    throw new Error(response.message || 'Login failed')
  }
)

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    await authLogout()
    clearProfile()
  }
)

export const validateAuthAsync = createAsyncThunk(
  'auth/validate',
  async () => {
    const isValid = await validateAuthentication()
    if (isValid) {
      const userProfile = getUserProfile()
      return userProfile
    }
    throw new Error('Authentication validation failed')
  }
)

export const initializeAuthAsync = createAsyncThunk(
  'auth/initialize',
  async () => {
    const userProfile = getUserProfile()
    if (!userProfile) {
      return null
    }

    const isValid = await validateAuthentication()
    if (isValid) {
      return userProfile
    }

    // Clear invalid profile
    clearProfile()
    return null
  }
)

export const fetchProfileAsync = createAsyncThunk(
  'auth/fetchProfile',
  async () => {
    const userProfile = getUserProfile()
    if (userProfile) {
      return userProfile
    }
    throw new Error('No profile found')
  }
)
