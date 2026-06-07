/**
 * User Pool API
 *
 * Reference implementation of the generic resource factory. The list endpoint
 * returns a flat array (`UserPool[]`), so that's declared as the list shape.
 */

import { patch } from '../client'
import { createResourceApi } from '../_lib/resource'
import { unwrap } from '../_lib/unwrap'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse } from '../types'
import type { UserPool, CreateUserPoolRequest, UpdateUserPoolRequest, UserPoolStatus } from './types'

const userPoolApi = createResourceApi<UserPool, CreateUserPoolRequest, UpdateUserPoolRequest, UserPool[]>(
  API_ENDPOINTS.USER_POOL,
  'user pool',
)

export const fetchUserPools = () => userPoolApi.list()
export const fetchUserPoolById = (userPoolId: string) => userPoolApi.getById(userPoolId)
export const createUserPool = (data: CreateUserPoolRequest) => userPoolApi.create(data)
export const updateUserPool = (userPoolId: string, data: UpdateUserPoolRequest) =>
  userPoolApi.update(userPoolId, data)
export const deleteUserPool = (userPoolId: string) => userPoolApi.remove(userPoolId)

/** Bespoke endpoint: PATCH /user-pools/{id}/status — activate/deactivate a pool. */
export const setUserPoolStatus = (userPoolId: string, status: UserPoolStatus) =>
  patch<ApiResponse<UserPool>>(`${API_ENDPOINTS.USER_POOL}/${userPoolId}/status`, { status }).then((r) =>
    unwrap(r, 'update user pool status'),
  )
