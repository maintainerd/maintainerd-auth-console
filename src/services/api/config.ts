/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

// Get base URL from environment variables
// In development, use relative path to go through Vite proxy
// In production, use the full API URL
const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    // Development: use relative path to go through Vite proxy
    return '/api/v1'
  }
  // Production: use environment variable or fallback
  return import.meta.env.VITE_AUTH_API_BASE_URL || 'http://api.maintainerd.auth/api/v1'
}

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const

// API Endpoints
export const API_ENDPOINTS = {
  SETUP: {
    CREATE_TENANT: '/setup/create_tenant',
    CREATE_ADMIN: '/setup/create_admin',
    CREATE_PROFILE: '/setup/create_profile',
  },
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    REFRESH: '/refresh',
    PROFILE: '/profile',
  },
  TENANT: '/tenant',
} as const
