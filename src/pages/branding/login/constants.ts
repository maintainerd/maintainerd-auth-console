import type { LoginBranding } from "./types"

// Default theme configurations
export const defaultThemes = {
  modern: {
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    backgroundColor: "#f8fafc",
    cardBackgroundColor: "#ffffff",
    textColor: "#1e293b",
    linkColor: "#3b82f6",
    errorColor: "#ef4444",
    successColor: "#10b981",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "medium" as const,
    borderRadius: "medium" as const,
    spacing: "normal" as const
  },
  classic: {
    primaryColor: "#1f2937",
    secondaryColor: "#6b7280",
    backgroundColor: "#f9fafb",
    cardBackgroundColor: "#ffffff",
    textColor: "#111827",
    linkColor: "#1f2937",
    errorColor: "#dc2626",
    successColor: "#059669",
    fontFamily: "Georgia, serif",
    fontSize: "medium" as const,
    borderRadius: "small" as const,
    spacing: "normal" as const
  },
  minimal: {
    primaryColor: "#000000",
    secondaryColor: "#6b7280",
    backgroundColor: "#ffffff",
    cardBackgroundColor: "#ffffff",
    textColor: "#000000",
    linkColor: "#000000",
    errorColor: "#dc2626",
    successColor: "#059669",
    fontFamily: "system-ui, sans-serif",
    fontSize: "medium" as const,
    borderRadius: "none" as const,
    spacing: "compact" as const
  }
}

// Mock data for development
export const MOCK_LOGIN_BRANDINGS: LoginBranding[] = [
  {
    id: "1",
    name: "Default Login",
    description: "System default login page with standard branding",
    status: "active",
    template: "modern",
    layout: "centered",
    theme: defaultThemes.modern,
    assets: {
      logo: "/assets/logo.svg",
      logoWidth: 120,
      logoHeight: 40
    },
    form: {
      showEmailField: true,
      showPasswordField: true,
      showRememberMe: true,
      showForgotPassword: true,
      enableSocialLogin: true,
      socialProviders: ["google", "github"],
      socialButtonStyle: "buttons",
      enableSignup: true,
      enableClientValidation: true,
      showPasswordStrength: false
    },
    content: {
      title: "Welcome Back",
      subtitle: "Sign in to your account",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      loginButtonText: "Sign In",
      signupButtonText: "Create Account",
      forgotPasswordText: "Forgot your password?",
      rememberMeText: "Remember me",
      footerText: "© 2024 M9d-Auth. All rights reserved."
    },
    isDefault: true,
    isSystem: true,
    usageCount: 1247,
    previewUrl: "https://auth.example.com/preview/default",
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    updatedAt: "2024-01-15T10:30:00Z",
    updatedBy: "admin@example.com"
  },
  {
    id: "2",
    name: "Corporate Theme",
    description: "Professional corporate branding for enterprise clients",
    status: "active",
    template: "corporate",
    layout: "split",
    theme: {
      ...defaultThemes.classic,
      primaryColor: "#1e40af",
      backgroundColor: "#f1f5f9"
    },
    assets: {
      logo: "/assets/corporate-logo.svg",
      logoWidth: 150,
      logoHeight: 50,
      backgroundImage: "/assets/corporate-bg.jpg"
    },
    form: {
      showEmailField: true,
      showPasswordField: true,
      showRememberMe: true,
      showForgotPassword: true,
      enableSocialLogin: false,
      socialProviders: [],
      socialButtonStyle: "buttons",
      enableSignup: false,
      enableClientValidation: true,
      showPasswordStrength: true
    },
    content: {
      title: "Enterprise Portal",
      subtitle: "Access your corporate account",
      welcomeMessage: "Welcome to the secure enterprise portal",
      emailLabel: "Corporate Email",
      passwordLabel: "Password",
      loginButtonText: "Access Portal",
      signupButtonText: "Request Access",
      forgotPasswordText: "Contact IT Support",
      rememberMeText: "Keep me signed in",
      footerText: "Enterprise Security Portal - Authorized Access Only"
    },
    isDefault: false,
    isSystem: false,
    usageCount: 89,
    previewUrl: "https://auth.example.com/preview/corporate",
    createdAt: "2024-01-10T09:15:00Z",
    createdBy: "admin@example.com",
    updatedAt: "2024-01-20T14:22:00Z",
    updatedBy: "admin@example.com"
  },
  {
    id: "3",
    name: "Minimal Design",
    description: "Clean, distraction-free login experience",
    status: "active",
    template: "minimal",
    layout: "card",
    theme: defaultThemes.minimal,
    assets: {
      logo: "/assets/minimal-logo.svg",
      logoWidth: 80,
      logoHeight: 80
    },
    form: {
      showEmailField: true,
      showPasswordField: true,
      showRememberMe: false,
      showForgotPassword: true,
      enableSocialLogin: true,
      socialProviders: ["google"],
      socialButtonStyle: "icons",
      enableSignup: true,
      enableClientValidation: true,
      showPasswordStrength: false
    },
    content: {
      title: "Sign In",
      emailLabel: "Email",
      passwordLabel: "Password",
      loginButtonText: "Continue",
      signupButtonText: "Sign Up",
      forgotPasswordText: "Forgot password?",
      rememberMeText: "Remember me"
    },
    isDefault: false,
    isSystem: false,
    usageCount: 156,
    previewUrl: "https://auth.example.com/preview/minimal",
    createdAt: "2024-01-12T11:20:00Z",
    createdBy: "designer@example.com",
    updatedAt: "2024-01-18T16:45:00Z",
    updatedBy: "designer@example.com"
  },
  {
    id: "4",
    name: "Creative Brand",
    description: "Unique, visually engaging design for creative agencies",
    status: "draft",
    template: "creative",
    layout: "fullscreen",
    theme: {
      primaryColor: "#8b5cf6",
      secondaryColor: "#a78bfa",
      backgroundColor: "#1e1b4b",
      cardBackgroundColor: "rgba(255, 255, 255, 0.1)",
      textColor: "#ffffff",
      linkColor: "#a78bfa",
      errorColor: "#f87171",
      successColor: "#34d399",
      fontFamily: "Poppins, sans-serif",
      fontSize: "large" as const,
      borderRadius: "large" as const,
      spacing: "spacious" as const
    },
    assets: {
      logo: "/assets/creative-logo.svg",
      logoWidth: 100,
      logoHeight: 100,
      backgroundImage: "/assets/creative-bg.jpg"
    },
    form: {
      showEmailField: true,
      showPasswordField: true,
      showRememberMe: true,
      showForgotPassword: true,
      enableSocialLogin: true,
      socialProviders: ["google", "github", "dribbble"],
      socialButtonStyle: "compact",
      enableSignup: true,
      enableClientValidation: true,
      showPasswordStrength: true
    },
    content: {
      title: "Join the Creative Community",
      subtitle: "Where ideas come to life",
      welcomeMessage: "Welcome to our creative platform",
      emailLabel: "Your Email",
      passwordLabel: "Secret Code",
      loginButtonText: "Enter the Studio",
      signupButtonText: "Start Creating",
      forgotPasswordText: "Lost your way?",
      rememberMeText: "Keep me inspired",
      footerText: "Creative Commons - Inspiring Innovation"
    },
    isDefault: false,
    isSystem: false,
    usageCount: 0,
    previewUrl: "https://auth.example.com/preview/creative",
    createdAt: "2024-01-22T15:30:00Z",
    createdBy: "creative@example.com",
    updatedAt: "2024-01-22T15:30:00Z",
    updatedBy: "creative@example.com"
  }
]
