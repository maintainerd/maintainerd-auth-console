import { Route, Routes, Navigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/toast.css'
import { queryClient } from '@/lib/queryClient'
import { useTenant } from '@/hooks/useTenant'
import { useAuth } from '@/hooks/useAuth'
import { determineTenantIdentifier } from '@/utils/tenant'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import ForgotPasswordPage from './pages/forgot-password'
import ResetPasswordPage from './pages/reset-password'
import SetupTenantPage from './pages/setup/tenant'
import SetupAdminPage from './pages/setup/admin'
import SetupProfilePage from './pages/setup/profile'
import RegisterProfilePage from './pages/register/profile'
import DashboardPage from './pages/dashboard'
import { PrivateLayout } from './components/layout/PrivateLayout'
import UsersPage from './pages/users'
import UserDetailsPage from './pages/users/details'
import UserAddOrUpdateForm from './pages/users/add-or-update-form'
import UserProfileForm from './pages/users/profile-form'
import RolesPage from './pages/roles'

import ServicesPage from './pages/services'
import ServiceDetailsPage from './pages/services/details'
import ServiceAddOrUpdateForm from './pages/services/form'
import ApisPage from './pages/apis'
import ApiDetailsPage from './pages/apis/details'
import ApiAddOrUpdateForm from './pages/apis/form'
import RoleDetailsPage from './pages/roles/details'
import RoleAddOrUpdateForm from './pages/roles/form'

import IdentityProvidersPage from './pages/identity-providers'
import IdentityProviderDetailsPage from './pages/identity-providers/details'
import IdentityProviderAddOrUpdateForm from './pages/identity-providers/form'
import SocialProvidersPage from './pages/social-providers'
import SocialProviderDetailsPage from './pages/social-providers/details'
import SocialProviderAddOrUpdateForm from './pages/social-providers/form'
import ClientsPage from './pages/clients'
import ClientDetailsPage from './pages/clients/details'
import ClientAddOrUpdateForm from './pages/clients/form'
import ApiKeysPage from './pages/api-keys'
import ApiKeyDetailsPage from './pages/api-keys/details'
import ApiKeyAddOrUpdateForm from './pages/api-keys/form'
import PoliciesPage from './pages/policies'
import PolicyDetailsPage from './pages/policies/details'
import PolicyAddOrUpdateForm from './pages/policies/form'
import SecuritySettingsPage from './pages/security/settings'
import PasswordPoliciesPage from './pages/security/password-policies'
import SessionManagementPage from './pages/security/session-management'
import ThreatDetectionPage from './pages/security/threat-detection'
import IpRestrictionsPage from './pages/security/ip-restrictions'
import OnboardingPage from './pages/onboarding'
import AnalyticsPage from './pages/analytics'
import LogMonitoringPage from './pages/log-monitoring'
import NotificationsPage from './pages/notifications'
import LoginBrandingPage from './pages/branding/login'
import EmailTemplatesPage from './pages/branding/email-templates'
import SmsTemplatesPage from './pages/branding/sms-templates'
import GeneralSettingsPage from './pages/settings'
import TenantCreatePage from './pages/tenant-create'

function App() {
  const location = useLocation()
  const { initializeFromLocation } = useTenant()
  const { initializeAuth } = useAuth()
  const authInitializedRef = useRef(false)
  const lastTenantIdentifierRef = useRef<string | null | undefined>(undefined)

  // Initialize auth once on app load
  useEffect(() => {
    const initializeAuthOnce = async () => {
      if (authInitializedRef.current) {
        return
      }
      authInitializedRef.current = true

      try {
        // Initialize auth first (this will fetch profile from backend if authenticated)
        await initializeAuth()
      } catch {
        // Error already handled in initializeAuth
      }
    }
    initializeAuthOnce()
  }, [initializeAuth]) // Only run once on mount

  // Initialize tenant data based on current URL (separate from auth)
  useEffect(() => {
    const initializeTenant = async () => {
      // Determine the tenant identifier from the current location
      const searchParams = new URLSearchParams(location.search)
      const tenantIdentifier = determineTenantIdentifier(location.pathname, searchParams)

      // Skip re-initialization if the tenant identifier hasn't changed
      // This prevents unnecessary API calls when navigating between public routes (login, forgot-password, etc.)
      if (lastTenantIdentifierRef.current === tenantIdentifier) {
        return
      }

      lastTenantIdentifierRef.current = tenantIdentifier

      // Initialize tenant based on current location
      // Error handling is done in initializeFromLocation, so we don't need to catch here
      try {
        await initializeFromLocation(location.pathname, location.search)
      } catch {
        // Error already shown in initializeFromLocation, just continue
      }
    }
    initializeTenant()
  }, [location.pathname, location.search, initializeFromLocation]) // Run on location changes for tenant switching

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
				<Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/setup/tenant" element={<SetupTenantPage />} />
        <Route path="/setup/admin" element={<SetupAdminPage />} />
        <Route path="/setup/profile" element={<SetupProfilePage />} />
        <Route path="/register/profile" element={<RegisterProfilePage />} />
        <Route path="/:tenantId" element={<PrivateLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="monitoring" element={<AnalyticsPage />} />
          <Route path="security/settings" element={<SecuritySettingsPage />} />
          <Route path="security/password-policies" element={<PasswordPoliciesPage />} />
          <Route path="security/sessions" element={<SessionManagementPage />} />
          <Route path="security/threats" element={<ThreatDetectionPage />} />
          <Route path="security/ip-restrictions" element={<IpRestrictionsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="users/create" element={<UserAddOrUpdateForm />} />
          <Route path="users/:userId" element={<UserDetailsPage />} />
          <Route path="users/:userId/edit" element={<UserAddOrUpdateForm />} />
          <Route path="users/:userId/profile" element={<UserProfileForm />} />
        </Route>
        <Route path="/:tenantId" element={<PrivateLayout fullWidth />}>
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="roles/create" element={<RoleAddOrUpdateForm />} />
          <Route path="roles/:roleId" element={<RoleDetailsPage />} />
          <Route path="roles/:roleId/edit" element={<RoleAddOrUpdateForm />} />

          <Route path="services" element={<ServicesPage />} />
          <Route path="services/create" element={<ServiceAddOrUpdateForm />} />
          <Route path="services/:serviceId" element={<ServiceDetailsPage />} />
          <Route path="services/:serviceId/edit" element={<ServiceAddOrUpdateForm />} />
          <Route path="apis" element={<ApisPage />} />
          <Route path="apis/create" element={<ApiAddOrUpdateForm />} />
          <Route path="apis/:apiId" element={<ApiDetailsPage />} />
          <Route path="apis/:apiId/edit" element={<ApiAddOrUpdateForm />} />
          <Route path="providers/identity" element={<IdentityProvidersPage />} />
          <Route path="providers/identity/create" element={<IdentityProviderAddOrUpdateForm />} />
          <Route path="providers/identity/:providerId" element={<IdentityProviderDetailsPage />} />
          <Route path="providers/identity/:providerId/edit" element={<IdentityProviderAddOrUpdateForm />} />
          <Route path="providers/social" element={<SocialProvidersPage />} />
          <Route path="providers/social/create" element={<SocialProviderAddOrUpdateForm />} />
          <Route path="providers/social/:providerId" element={<SocialProviderDetailsPage />} />
          <Route path="providers/social/:providerId/edit" element={<SocialProviderAddOrUpdateForm />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/create" element={<ClientAddOrUpdateForm />} />
          <Route path="clients/:clientId" element={<ClientDetailsPage />} />
          <Route path="clients/:clientId/edit" element={<ClientAddOrUpdateForm />} />
          <Route path="api-keys" element={<ApiKeysPage />} />
          <Route path="api-keys/create" element={<ApiKeyAddOrUpdateForm />} />
          <Route path="api-keys/:id" element={<ApiKeyDetailsPage />} />
          <Route path="api-keys/:id/edit" element={<ApiKeyAddOrUpdateForm />} />
          <Route path="policies" element={<PoliciesPage />} />
          <Route path="policies/create" element={<PolicyAddOrUpdateForm />} />
          <Route path="policies/:policyId" element={<PolicyDetailsPage />} />
          <Route path="policies/:policyId/edit" element={<PolicyAddOrUpdateForm />} />
					<Route path="onboarding" element={<OnboardingPage />} />
					<Route path="events" element={<DashboardPage />} />
          <Route path="webhooks" element={<DashboardPage />} />
          <Route path="logs" element={<LogMonitoringPage />} />
          <Route path="branding" element={<DashboardPage />} />
          <Route path="branding/login" element={<LoginBrandingPage />} />
          <Route path="branding/email-templates" element={<EmailTemplatesPage />} />
          <Route path="branding/sms-templates" element={<SmsTemplatesPage />} />
          <Route path="settings" element={<GeneralSettingsPage />} />
          <Route path="tenant/create" element={<TenantCreatePage />} />
        </Route>
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </QueryClientProvider>
  )
}

export default App
