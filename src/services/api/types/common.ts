/**
 * Common API Types
 * Shared type definitions used across multiple APIs
 */

/**
 * Generic API response structure
 * @template T - The type of the data payload (optional)
 *
 * @example
 * // Success response with data
 * ApiResponse<{ user_id: string }>
 *
 * @example
 * // Success response without data (success/message only)
 * ApiResponse
 *
 * @example
 * // Error response with string error
 * { success: false, error: "Invalid credentials", details: "Username not found" }
 *
 * @example
 * // Error response with object error/details
 * { success: false, error: { code: "AUTH_001", message: "Invalid credentials" }, details: { field: "username", reason: "not_found" } }
 */
export interface ApiResponse<T = undefined> {
  success: boolean
  data?: T
  message?: string
  error?: string | object
  details?: string | object
}
