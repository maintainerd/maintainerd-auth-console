/**
 * User Pool API
 *
 * Reference implementation of the generic resource factory. The list endpoint
 * returns a flat array (`UserPool[]`), so that's declared as the list shape.
 */

import { createResourceApi } from '../_lib/resource'
import { API_ENDPOINTS } from '../config'
import type { UserPool, CreateUserPoolRequest, UpdateUserPoolRequest } from './types'

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
