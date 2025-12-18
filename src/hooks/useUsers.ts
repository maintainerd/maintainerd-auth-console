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
  completeUserAccount
} from '@/services/api/user'
import type {
  UserQueryParamsInterface,
  CreateUserRequestInterface,
  UpdateUserRequestInterface,
  UpdateUserStatusRequestInterface,
  UserRolesQueryParamsInterface,
  UserIdentitiesQueryParamsInterface,
  UserProfilesQueryParamsInterface,
  CreateUserProfileRequestInterface,
  UpdateUserProfileRequestInterface
} from '@/services/api/user/types'

/**
 * Query key factory for users
 */
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: UserQueryParamsInterface) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  roles: (id: string) => [...userKeys.all, 'roles', id] as const,
  rolesList: (id: string, params?: UserRolesQueryParamsInterface) => [...userKeys.roles(id), params] as const,
  identities: (id: string) => [...userKeys.all, 'identities', id] as const,
  identitiesList: (id: string, params?: UserIdentitiesQueryParamsInterface) => [...userKeys.identities(id), params] as const,
  profiles: (id: string) => [...userKeys.all, 'profiles', id] as const,
  profilesList: (id: string, params?: UserProfilesQueryParamsInterface) => [...userKeys.profiles(id), params] as const,
}

/**
 * Hook to fetch users with optional filters and pagination
 */
export function useUsers(params?: UserQueryParamsInterface) {
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
    mutationFn: (data: CreateUserRequestInterface) => createUser(data),
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
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRequestInterface }) =>
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
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserStatusRequestInterface }) =>
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
export function useUserRoles(userId: string, params?: UserRolesQueryParamsInterface) {
  return useQuery({
    queryKey: userKeys.rolesList(userId, params),
    queryFn: () => fetchUserRoles(userId, params),
    enabled: !!userId,
  })
}

/**
 * Hook to fetch user identities with optional filters and pagination
 */
export function useUserIdentities(userId: string, params?: UserIdentitiesQueryParamsInterface) {
  return useQuery({
    queryKey: userKeys.identitiesList(userId, params),
    queryFn: () => fetchUserIdentities(userId, params),
    enabled: !!userId,
  })
}

/**
 * Hook to fetch user profiles with optional filters and pagination
 */
export function useUserProfiles(userId: string, params?: UserProfilesQueryParamsInterface) {
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
    mutationFn: ({ userId, data }: { userId: string; data: CreateUserProfileRequestInterface }) =>
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
    mutationFn: ({ userId, profileId, data }: { userId: string; profileId: string; data: UpdateUserProfileRequestInterface }) =>
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

