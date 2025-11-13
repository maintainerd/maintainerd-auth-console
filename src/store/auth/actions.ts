/**
 * Auth Actions
 * Redux async thunks for auth operations
 */

import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  login as authLogin,
  register as authRegister,
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
      // userProfile may be null if profile doesn't exist (newly registered user)
      return { success: true, user: userProfile }
    }
    throw new Error(response.message || 'Login failed')
  }
)

export const registerAsync = createAsyncThunk(
  'auth/register',
  async ({
    fullname,
    email,
    password,
    phone,
    clientId,
    providerId
  }: {
    fullname: string
    email: string
    password: string
    phone?: string
    clientId?: string
    providerId?: string
  }) => {
    const response = await authRegister(fullname, email, password, phone, clientId, providerId)
    if (response.success) {
      return { success: true, data: response.data }
    }
    throw new Error(response.message || 'Registration failed')
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
      // validateAuthentication already stores the profile, so get it
      const userProfile = getUserProfile()
      return userProfile
    }
    throw new Error('Authentication validation failed')
  }
)

export const initializeAuthAsync = createAsyncThunk(
  'auth/initialize',
  async () => {
    // Always validate with backend first - don't check localStorage
    // The backend is the source of truth for authentication
    const isValid = await validateAuthentication()
    if (isValid) {
      // validateAuthentication already stores the profile, so get it
      return getUserProfile()
    }

    // Not authenticated - profile already cleared by validateAuthentication
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
