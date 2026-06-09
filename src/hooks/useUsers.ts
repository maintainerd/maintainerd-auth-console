/**
 * Users Hook
 * Custom hook for fetching users using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  fetchUserRoles,
  fetchUserIdentities,
  fetchUserProfiles,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  setUserProfileAsDefault,
  assignUserRoles,
  removeUserRole,
  verifyUserEmail,
  verifyUserPhone,
  completeUserAccount,
  resetUserMfa,
  fetchUserActivity,
  fetchRecentActivity,
  fetchUserSessions,
  revokeUserSession,
  fetchUserMFA,
} from '@/services/api/users'
import type {
  UserQueryParams,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserStatusRequest,
  UserRolesQueryParams,
  UserIdentitiesQueryParams,
  UserProfilesQueryParams,
  CreateUserProfileRequest,
  UpdateUserProfileRequest,
  UserActivityQueryParams
} from '@/services/api/users/types'

/**
 * Query key factory for users
 */
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: UserQueryParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  roles: (id: string) => [...userKeys.all, 'roles', id] as const,
  rolesList: (id: string, params?: UserRolesQueryParams) => [...userKeys.roles(id), params] as const,
  identities: (id: string) => [...userKeys.all, 'identities', id] as const,
  identitiesList: (id: string, params?: UserIdentitiesQueryParams) => [...userKeys.identities(id), params] as const,
  profiles: (id: string) => [...userKeys.all, 'profiles', id] as const,
  profilesList: (id: string, params?: UserProfilesQueryParams) => [...userKeys.profiles(id), params] as const,
  activity: (id: string) => [...userKeys.all, 'activity', id] as const,
  activityList: (id: string, params?: UserActivityQueryParams) => [...userKeys.activity(id), params] as const,
  sessions: (id: string) => [...userKeys.all, 'sessions', id] as const,
  mfa: (id: string) => [...userKeys.all, 'mfa', id] as const,
}

/**
 * Hook to fetch users with optional filters and pagination
 */
export function useUsers(params?: UserQueryParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => fetchUsers(params),
  })
}

/**
 * Hook to fetch a single user by ID
 */
export function useUser(userId: string) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => fetchUserById(userId),
    enabled: !!userId,
  })
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUser(data),
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

/**
 * Hook to update an existing user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRequest }) =>
      updateUser(userId, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific user and the list
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

/**
 * Hook to update user status
 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserStatusRequest }) =>
      updateUserStatus(userId, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific user and the list
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

/**
 * Hook to fetch user roles with optional filters and pagination
 */
export function useUserRoles(userId: string, params?: UserRolesQueryParams) {
  return useQuery({
    queryKey: userKeys.rolesList(userId, params),
    queryFn: () => fetchUserRoles(userId, params),
    enabled: !!userId,
  })
}

/**
 * Hook to fetch user identities with optional filters and pagination
 */
export function useUserIdentities(userId: string, params?: UserIdentitiesQueryParams) {
  return useQuery({
    queryKey: userKeys.identitiesList(userId, params),
    queryFn: () => fetchUserIdentities(userId, params),
    enabled: !!userId,
  })
}

/**
 * Hook to fetch user profiles with optional filters and pagination
 */
export function useUserProfiles(userId: string, params?: UserProfilesQueryParams) {
  return useQuery({
    queryKey: userKeys.profilesList(userId, params),
    queryFn: () => fetchUserProfiles(userId, params),
    enabled: !!userId,
  })
}

/**
 * Hook to assign roles to a user
 */
export function useAssignUserRoles() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: { role_ids: string[] } }) =>
      assignUserRoles(userId, data),
    onSuccess: (_, variables) => {
      // Invalidate user roles and user detail
      queryClient.invalidateQueries({ queryKey: userKeys.roles(variables.userId) })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) })
    },
  })
}

/**
 * Hook to remove a role from a user
 */
export function useRemoveUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      removeUserRole(userId, roleId),
    onSuccess: (_, variables) => {
      // Invalidate user roles and user detail
      queryClient.invalidateQueries({ queryKey: userKeys.roles(variables.userId) })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) })
    },
  })
}

/**
 * Hook to create a user profile
 */
export function useCreateUserProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: CreateUserProfileRequest }) =>
      createUserProfile(userId, data),
    onSuccess: (_, variables) => {
      // Invalidate the profiles list for this user
      queryClient.invalidateQueries({ queryKey: userKeys.profiles(variables.userId) })
    },
  })
}

/**
 * Hook to update a user profile
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, profileId, data }: { userId: string; profileId: string; data: UpdateUserProfileRequest }) =>
      updateUserProfile(userId, profileId, data),
    onSuccess: (_, variables) => {
      // Invalidate the profiles list for this user
      queryClient.invalidateQueries({ queryKey: userKeys.profiles(variables.userId) })
    },
  })
}

/**
 * Hook to delete a user profile
 */
export function useDeleteUserProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, profileId }: { userId: string; profileId: string }) =>
      deleteUserProfile(userId, profileId),
    onSuccess: (_, variables) => {
      // Invalidate the profiles list for this user
      queryClient.invalidateQueries({ queryKey: userKeys.profiles(variables.userId) })
    },
  })
}

/**
 * Hook to set a user profile as default
 */
export function useSetUserProfileAsDefault() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, profileId }: { userId: string; profileId: string }) =>
      setUserProfileAsDefault(userId, profileId),
    onSuccess: (_, variables) => {
      // Invalidate the profiles list for this user
      queryClient.invalidateQueries({ queryKey: userKeys.profiles(variables.userId) })
    },
  })
}

/**
 * Hook to verify user email
 */
export function useVerifyUserEmail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => verifyUserEmail(userId),
    onSuccess: (_, userId) => {
      // Invalidate the specific user to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

/**
 * Hook to verify user phone
 */
export function useVerifyUserPhone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => verifyUserPhone(userId),
    onSuccess: (_, userId) => {
      // Invalidate the specific user to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

/**
 * Hook to complete user account
 */
export function useCompleteUserAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => completeUserAccount(userId),
    onSuccess: (_, userId) => {
      // Invalidate the specific user to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

/**
 * Hook to reset a user's MFA enrollment (admin action)
 */
export function useResetUserMfa() {
  return useMutation({
    mutationFn: (userId: string) => resetUserMfa(userId),
  })
}

/**
 * Hook to fetch a user's activity (auth events)
 */
export function useUserActivity(userId: string, params?: UserActivityQueryParams) {
  return useQuery({
    queryKey: userKeys.activityList(userId, params),
    queryFn: () => fetchUserActivity(userId, params),
    enabled: !!userId,
  })
}

/**
 * Hook to fetch recent tenant-wide activity (auth events) for the dashboard feed.
 * Not scoped to a single actor — the backend scopes results to the caller's session.
 */
export function useRecentActivity(params?: UserActivityQueryParams) {
  return useQuery({
    queryKey: ['auth-events', 'recent', params] as const,
    queryFn: () => fetchRecentActivity(params),
  })
}

/**
 * Hook to fetch a user's active sessions
 */
export function useUserSessions(userId: string) {
  return useQuery({
    queryKey: userKeys.sessions(userId),
    queryFn: () => fetchUserSessions(userId),
    enabled: !!userId,
  })
}

/**
 * Hook to revoke a single user session (admin action)
 */
export function useRevokeUserSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, sessionId }: { userId: string; sessionId: string }) =>
      revokeUserSession(userId, sessionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.sessions(variables.userId) })
    },
  })
}

/**
 * Hook to fetch a user's MFA configuration
 */
export function useUserMFA(userId: string) {
  return useQuery({
    queryKey: userKeys.mfa(userId),
    queryFn: () => fetchUserMFA(userId),
    enabled: !!userId,
  })
}

