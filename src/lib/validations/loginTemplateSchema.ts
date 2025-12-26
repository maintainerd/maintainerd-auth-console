/**
 * Login Template Form Validation Schema
 * Yup validation schema for login template forms
 */

import * as yup from 'yup'

// Login Template Form Schema
export const loginTemplateSchema = yup.object({
  // Basic Information
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  template: yup
    .string()
    .oneOf(['classic', 'modern', 'minimal'], 'Invalid template type')
    .required('Template type is required'),
  status: yup
    .string()
    .oneOf(['active', 'inactive'], 'Invalid status')
    .required('Status is required'),
  
  // Design / Theme
  primaryColor: yup.string().default('#3b82f6'),
  backgroundColor: yup.string().default('#f8fafc'),
  fontSize: yup.string().oneOf(['small', 'medium', 'large']).default('medium'),
  borderRadius: yup.string().oneOf(['none', 'small', 'medium', 'large']).default('medium'),
  spacing: yup.string().oneOf(['compact', 'normal', 'spacious']).default('normal'),
  
  // Layout / Form Configuration
  layout: yup.string().oneOf(['centered', 'split', 'fullscreen', 'card']).default('centered'),
  showEmailField: yup.boolean().default(true),
  showPasswordField: yup.boolean().default(true),
  showRememberMe: yup.boolean().default(true),
  showForgotPassword: yup.boolean().default(true),
  enableSocialLogin: yup.boolean().default(false),
  socialButtonStyle: yup.string().oneOf(['icons', 'buttons', 'compact']).default('buttons'),
  enableSignup: yup.boolean().default(true),
  enableClientValidation: yup.boolean().default(true),
  showPasswordStrength: yup.boolean().default(false),
  
  // Content
  title: yup.string().default('Welcome Back'),
  subtitle: yup.string().default('Sign in to your account'),
  welcomeMessage: yup.string().default(''),
  emailLabel: yup.string().default('Email Address'),
  passwordLabel: yup.string().default('Password'),
  loginButtonText: yup.string().default('Sign In'),
  signupButtonText: yup.string().default('Create Account'),
  forgotPasswordText: yup.string().default('Forgot your password?'),
  rememberMeText: yup.string().default('Remember me'),
  footerText: yup.string().default(''),
  
  // Assets
  logo: yup.string().default(''),
  logoWidth: yup.number().default(120),
  logoHeight: yup.number().default(40),
  backgroundImage: yup.string().default(''),
  favicon: yup.string().default(''),
})

export type LoginTemplateFormData = yup.InferType<typeof loginTemplateSchema>
