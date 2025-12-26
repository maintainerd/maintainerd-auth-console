/**
 * Login Template API Types
 */

import type { StatusType } from '@/types/status'

/**
 * Login Template status type
 */
export type LoginTemplateStatusType = Extract<StatusType, 'active' | 'inactive'>

/**
 * Template type options
 */
export type TemplateType = 'classic' | 'modern' | 'minimal'

/**
 * Design metadata type
 */
export interface LoginTemplateDesignMetadata {
  primaryColor?: string
  backgroundColor?: string
  fontSize?: 'small' | 'medium' | 'large'
  borderRadius?: 'none' | 'small' | 'medium' | 'large'
  spacing?: 'compact' | 'normal' | 'spacious'
  [key: string]: unknown
}

/**
 * Layout metadata type
 */
export interface LoginTemplateLayoutMetadata {
  layout?: 'centered' | 'split' | 'fullscreen' | 'card'
  showEmailField?: boolean
  showPasswordField?: boolean
  showRememberMe?: boolean
  showForgotPassword?: boolean
  enableSocialLogin?: boolean
  socialButtonStyle?: 'icons' | 'buttons' | 'compact'
  enableSignup?: boolean
  enableClientValidation?: boolean
  showPasswordStrength?: boolean
  [key: string]: unknown
}

/**
 * Content metadata type
 */
export interface LoginTemplateContentMetadata {
  title?: string
  subtitle?: string
  welcomeMessage?: string
  emailLabel?: string
  passwordLabel?: string
  loginButtonText?: string
  signupButtonText?: string
  forgotPasswordText?: string
  rememberMeText?: string
  footerText?: string
  [key: string]: unknown
}

/**
 * Assets metadata type
 */
export interface LoginTemplateAssetsMetadata {
  logo?: string
  logoWidth?: number
  logoHeight?: number
  backgroundImage?: string
  favicon?: string
  [key: string]: unknown
}

/**
 * Metadata structure for design, layout, content, and assets
 */
export interface LoginTemplateMetadata {
  design?: LoginTemplateDesignMetadata
  layout?: LoginTemplateLayoutMetadata
  content?: LoginTemplateContentMetadata
  assets?: LoginTemplateAssetsMetadata
}

/**
 * Login Template type (camelCase for frontend)
 */
export type LoginTemplate = {
  loginTemplateId: string
  name: string
  description: string
  template: TemplateType
  status: LoginTemplateStatusType
  metadata?: LoginTemplateMetadata
  isDefault: boolean
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Login Template Payload type (snake_case from backend)
 */
export type LoginTemplatePayload = {
  login_template_id: string
  name: string
  description: string
  template: TemplateType
  status: LoginTemplateStatusType
  metadata?: LoginTemplateMetadata
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Login Template Query Params
 */
export interface LoginTemplateQueryParams {
  name?: string
  status?: LoginTemplateStatusType
  template?: TemplateType
  is_default?: boolean
  is_system?: boolean
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Login Template List Response
 */
export interface LoginTemplateListResponse {
  rows: LoginTemplate[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * Create Login Template Request
 */
export interface CreateLoginTemplateRequest {
  name: string
  description: string
  template: TemplateType
  metadata?: LoginTemplateMetadata
  status: LoginTemplateStatusType
}

/**
 * Update Login Template Request
 */
export interface UpdateLoginTemplateRequest {
  name: string
  description: string
  template: TemplateType
  metadata?: LoginTemplateMetadata
  status: LoginTemplateStatusType
}

/**
 * Update Login Template Status Request
 */
export interface UpdateLoginTemplateStatusRequest {
  status: LoginTemplateStatusType
}
