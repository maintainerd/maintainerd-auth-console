import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  fetchProfile,
  validateAuthentication,
	type LoginRequest,
	type RegisterRequest
} from '@/services'

// Extended register request with optional query parameters
export interface RegisterAsyncRequest extends Omit<RegisterRequest, 'username'> {
  clientId?: string
  providerId?: string
}

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (data: LoginRequest, thunkAPI) => {
		try {
			const response = await authLogin(data)
			const userProfile = await fetchProfile()
			return { data: userProfile, message: response.message }
		} catch (error: any) {
			const errorMessage = error?.message || 'Login failed'
			return thunkAPI.rejectWithValue({ message: errorMessage })
		}
  }
)

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (data: RegisterAsyncRequest, thunkAPI) => {
    try {
      const response = await authRegister(data)
      return { data: response.data }
    } catch (error: any) {
      const errorMessage = error?.message || 'Registration failed'
      return thunkAPI.rejectWithValue({ message: errorMessage })
    }
  }
)

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    await authLogout()
  }
)

export const validateAuthAsync = createAsyncThunk(
  'auth/validate',
  async (_, thunkAPI) => {
    const userProfile = await validateAuthentication()
    if (userProfile) {
      return userProfile
    }
    return thunkAPI.rejectWithValue({ message: 'Authentication validation failed' })
  }
)

export const initializeAuthAsync = createAsyncThunk(
  'auth/initialize',
  async () => {
    const userProfile = await validateAuthentication()
    return userProfile
  }
)

export const fetchProfileAsync = createAsyncThunk(
  'auth/fetchProfile',
  async () => {
    const userProfile = await fetchProfile()
    if (userProfile) {
      return userProfile
    }
    throw new Error('No profile found')
  }
)
