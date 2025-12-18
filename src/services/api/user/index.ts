/**
 * User API Service
 * Service for managing user-related API calls
 */

import { get, post, put, patch, deleteRequest } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse } from '../types'
import type {
  UserListResponseInterface,
  UserQueryParamsInterface,
  UserType,
  CreateUserRequestInterface,
  UpdateUserRequestInterface,
  UpdateUserStatusRequestInterface,
  UserRolesQueryParamsInterface,
  UserRolesResponseInterface,
  UserIdentitiesQueryParamsInterface,
  UserIdentitiesResponseInterface,
  UserProfilesQueryParamsInterface,
  UserProfilesResponseInterface,
  CreateUserProfileRequestInterface,
  UpdateUserProfileRequestInterface,
  UserProfileType
} from './types'

/**
 * Fetch users with optional filters and pagination
 */
export async function fetchUsers(params?: UserQueryParamsInterface): Promise<UserListResponseInterface> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.USER}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<UserListResponseInterface>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch users')
}

/**
 * Fetch a single user by ID
 */
export async function fetchUserById(userId: string): Promise<UserType> {
  const endpoint = `${API_ENDPOINTS.USER}/${userId}`
  const response = await get<ApiResponse<UserType>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch user')
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserRequestInterface): Promise<UserType> {
  const endpoint = API_ENDPOINTS.USER
  const response = await post<ApiResponse<UserType>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to create user')
}

/**
 * Update an existing user
 */
export async function updateUser(userId: string, data: UpdateUserRequestInterface): Promise<UserType> {
  const endpoint = `${API_ENDPOINTS.USER}/${userId}`
  const response = await put<ApiResponse<UserType>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to update user')
}

/**
 * Delete a user
 */
export async function deleteUser(userId: string): Promise<void> {
  const endpoint = `${API_ENDPOINTS.USER}/${userId}`
  const response = await deleteRequest<ApiResponse<void>>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to delete user')
  }
}

/**
 * Update user status (activate, deactivate, suspend)
 */
export async function updateUserStatus(userId: string, data: UpdateUserStatusRequestInterface): Promise<UserType> {
  const endpoint = `${API_ENDPOINTS.USER}/${userId}/status`
  const response = await put<ApiResponse<UserType>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to update user status')
}

/**
 * Fetch user roles with optional filters and pagination
 */
export async function fetchUserRoles(userId: string, params?: UserRolesQueryParamsInterface): Promise<UserRolesResponseInterface> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.USER}/${userId}/roles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<UserRolesResponseInterface>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch user roles')
}

/**
 * Fetch user identities with optional filters and pagination
 */
export async function fetchUserIdentities(userId: string, params?: UserIdentitiesQueryParamsInterface): Promise<UserIdentitiesResponseInterface> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.USER}/${userId}/identities${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<UserIdentitiesResponseInterface>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch user identities')
}

/**
 * Assign roles to a user
 */
export async function assignUserRoles(
  userId: string,
  data: { role_ids: string[] }
): Promise<void> {
  const endpoint = `${API_ENDPOINTS.USER}/${userId}/roles`
  const response = await post<ApiResponse<void>>(endpoint, data)

  if (!response.success) {
    throw new Error(response.message || 'Failed to assign roles to user')
  }
}

/**
 * Remove a role from a user
 */
export async function removeUserRole(
  userId: string,
  roleId: string
): Promise<void> {
  const endpoint = `${API_ENDPOINTS.USER}/${userId}/roles/${roleId}`
  const response = await deleteRequest<ApiResponse<void>>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to remove role from user')
  }
}

/**
 * Fetch user profiles
 */
export async function fetchUserProfiles(
  userId: string,
  params?: UserProfilesQueryParamsInterface
): Promise<UserProfilesResponseInterface> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.USER}/${userId}/profiles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<UserProfilesResponseInterface>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch user profiles')
}

/**
 * Create a user profile
 */
export async function createUserProfile(
  userId: string,
  data: CreateUserProfileRequestInterface
): Promise<UserProfileType> {
  const endpoint = `${API_ENDPOINTS.USER}/${userId}/profiles`
  const response = await post<ApiResponse<UserProfileType>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to create user profile')
}

/**
 * Update a user profile
 */
export async function updateUserProfile(
  userId: string,
  profileId: string,
  data: UpdateUserProfileRequestInterface
): Promise<UserProfileType> {
  const endpoint = `${API_ENDPOINTS.USER}/${userId}/profiles/${profileId}`
  const response = await put<ApiResponse<UserProfileType>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to update user profile')
}

/**
 * Delete a user profile
 */
export async function deleteUserProfile(
  userId: string,
  profileId: string
): Promise<void> {
  const endpoint = `${API_ENDPOINTS.USER}/${userId}/profiles/${profileId}`
  const response = await deleteRequest<ApiResponse<void>>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to delete user profile')
  }
}

/**
 * Set a user profile as default
 */
export async function setUserProfileAsDefault(
  userId: string,
  profileId: string
): Promise<UserProfileType> {
  const endpoint = `${API_ENDPOINTS.USER}/${userId}/profiles/${profileId}/set-default`
  const response = await put<ApiResponse<UserProfileType>>(endpoint, {})

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to set profile as default')
}

/**
 * Mark user email as verified
 */
export async function verifyUserEmail(userId: string): Promise<UserType> {
  const endpoint = `${API_ENDPOINTS.USER}/${userId}/verify-email`
  const response = await patch<ApiResponse<UserType>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to verify email')
}

/**
 * Mark user phone as verified
 */
export async function verifyUserPhone(userId: string): Promise<UserType> {
  const endpoint = `${API_ENDPOINTS.USER}/${userId}/verify-phone`
  const response = await patch<ApiResponse<UserType>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to verify phone')
}

/**
 * Mark user account as completed
 */
export async function completeUserAccount(userId: string): Promise<UserType> {
  const endpoint = `${API_ENDPOINTS.USER}/${userId}/complete-account`
  const response = await patch<ApiResponse<UserType>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to complete account')
}
