import { Route, Routes, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { StepUpProvider } from './components/stepup/StepUpProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/toast.css'
import { queryClient } from '@/lib/queryClient'
import { AppBootstrap } from './components/auth/AppBootstrap'
import NoAccessPage from './pages/no-access/NoAccessPage'
import ServiceUnavailablePage from './pages/service-unavailable/ServiceUnavailablePage'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import RegisterInvitePage from './pages/register/invite/RegisterInvitePage'
import ForgotPasswordPage from './pages/forgot-password'
import ResetPasswordPage from './pages/reset-password'
import SetupTenantPage from './pages/setup/tenant'
import SetupAdminPage from './pages/setup/admin'
import RegisterProfilePage from './pages/register/profile'
import VerifyEmailPage from './pages/register/verify-email/VerifyEmailPage'
import DashboardPage from './pages/dashboard'
import { PrivateLayout } from './components/layout/PrivateLayout'
import UsersPage from './pages/users'
import UserDetailsPage from './pages/users/details'
import InvitationsPage from './pages/invitations'
import InviteForm from './pages/invitations/form/InviteForm'
import InviteDetailsPage from './pages/invitations/details/InviteDetailsPage'
import UserAddOrUpdateForm from './pages/users/form'
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
import ClientsPage from './pages/clients'
import ClientDetailsPage from './pages/clients/details'
import ClientAddOrUpdateForm from './pages/clients/form'
import WebhooksPage from './pages/webhooks'
import WebhookDetailsPage from './pages/webhooks/details'
import WebhookAddOrUpdateForm from './pages/webhooks/form'
import EventTypesPage from './pages/event-types'
import { EventRoutesPage } from './pages/event-routes'
import ApiKeysPage from './pages/api-keys'
import ApiKeyDetailsPage from './pages/api-keys/details'
import ApiKeyAddOrUpdateForm from './pages/api-keys/form'
import PoliciesPage from './pages/policies'
import PolicyDetailsPage from './pages/policies/details'
import PolicyAddOrUpdateForm from './pages/policies/form'
import MfaConfigPage from './pages/security/mfa/MfaConfigPage'
import MfaViewPage from './pages/security/mfa/MfaViewPage'
import PasswordPoliciesPage, { PasswordPoliciesFormPage } from './pages/security/password-policies'
import SessionManagementPage, { SessionManagementFormPage } from './pages/security/session-management'
import TokenViewPage from './pages/security/token/TokenViewPage'
import TokenConfigPage from './pages/security/token/TokenConfigPage'
import LockoutViewPage from './pages/security/lockout/LockoutViewPage'
import LockoutConfigPage from './pages/security/lockout/LockoutConfigPage'
import RegistrationViewPage from './pages/security/registration/RegistrationViewPage'
import RegistrationConfigPage from './pages/security/registration/RegistrationConfigPage'
import ThreatDetectionPage, { ThreatDetectionFormPage } from './pages/security/threat-detection'
import IpRestrictionsPage from './pages/security/ip-restrictions'
import { TenantSettingsPage } from './pages/tenant-settings/TenantSettingsPage'
import TenantsPage from './pages/tenants'
import TenantDetailsPage from './pages/tenants/details'
import TenantAddOrUpdateForm from './pages/tenants/form'
import SignupFlowsPage from './pages/signup-flows'
import SignupFlowDetailsPage from './pages/signup-flows/details'
import SignupFlowAddOrUpdateForm from './pages/signup-flows/form'
import LogMonitoringPage from './pages/log-monitoring'
import AuthEventDetailsPage from './pages/log-monitoring/details/AuthEventDetailsPage'
import BrandingTemplatesPage from './pages/branding/templates'
import BrandingDetailsPage from './pages/branding/templates/details/BrandingDetailsPage'
import BrandingForm from './pages/branding/templates/form/BrandingForm'
import EmailTemplatesPage from './pages/branding/email-templates'
import EmailTemplateDetailsPage from './pages/branding/email-templates/details'
import EmailTemplateForm from './pages/branding/email-templates/form'
import SmsTemplatesPage from './pages/branding/sms-templates'
import SmsTemplateDetailsPage from './pages/branding/sms-templates/details'
import SmsTemplateForm from './pages/branding/sms-templates/form'
import EmailDeliveryPage from './pages/messaging/email/EmailDeliveryPage'
import EmailConfigPage from './pages/messaging/email/EmailConfigPage'
import SMSDeliveryPage from './pages/messaging/sms/SMSDeliveryPage'
import SMSConfigPage from './pages/messaging/sms/SMSConfigPage'
import MFAPage, { MFAIndex } from './pages/account/MFAPage'
import TOTPSetupPage from './pages/account/TOTPSetupPage'
import PasskeySetupPage from './pages/account/PasskeySetupPage'
import SMSSetupPage from './pages/account/SMSSetupPage'
import ProfilePage from './pages/account/ProfilePage'
import SettingsPage from './pages/account/SettingsPage'

function App() {
  // Auth + tenant initialization and all redirect gating now live in
  // AppBootstrap → RouteGuard, which wrap the route tree below.
  return (
    <QueryClientProvider client={queryClient}>
      <StepUpProvider>
      <AppBootstrap>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/no-access" element={<NoAccessPage />} />
        <Route path="/service-unavailable" element={<ServiceUnavailablePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/:tenantId/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/invite" element={<RegisterInvitePage />} />
        <Route path="/email-verification" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/setup/tenant" element={<SetupTenantPage />} />
        <Route path="/setup/admin" element={<SetupAdminPage />} />
        <Route path="/register/profile" element={<RegisterProfilePage />} />
        <Route path="/:tenantId" element={<PrivateLayout fullWidth />}>
          <Route path="logs" element={<LogMonitoringPage />} />
          <Route path="logs/:eventId" element={<AuthEventDetailsPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="security/mfa" element={<MfaViewPage />} />
          <Route path="security/mfa/configure" element={<MfaConfigPage />} />
          <Route path="security/password" element={<PasswordPoliciesPage />} />
          <Route path="security/password/configure" element={<PasswordPoliciesFormPage />} />
          <Route path="security/session" element={<SessionManagementPage />} />
          <Route path="security/session/configure" element={<SessionManagementFormPage />} />
          <Route path="security/token" element={<TokenViewPage />} />
          <Route path="security/token/configure" element={<TokenConfigPage />} />
          <Route path="security/lockout" element={<LockoutViewPage />} />
          <Route path="security/lockout/configure" element={<LockoutConfigPage />} />
          <Route path="security/registration" element={<RegistrationViewPage />} />
          <Route path="security/registration/configure" element={<RegistrationConfigPage />} />
          <Route path="security/threat" element={<ThreatDetectionPage />} />
          <Route path="security/threat/configure" element={<ThreatDetectionFormPage />} />
          <Route path="security/ip-restrictions" element={<IpRestrictionsPage />} />
          <Route path="settings" element={<TenantSettingsPage />} />
          <Route path="tenants" element={<TenantsPage />} />
          <Route path="tenants/create" element={<TenantAddOrUpdateForm />} />
          <Route path="tenants/:id" element={<TenantDetailsPage />} />
          <Route path="tenants/:id/edit" element={<TenantAddOrUpdateForm />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/create" element={<UserAddOrUpdateForm />} />
          <Route path="users/:userId" element={<UserDetailsPage />} />
          <Route path="users/:userId/edit" element={<UserAddOrUpdateForm />} />
          <Route path="invites" element={<InvitationsPage />} />
          <Route path="invites/create" element={<InviteForm />} />
          <Route path="invites/:inviteId" element={<InviteDetailsPage />} />
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
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/create" element={<ClientAddOrUpdateForm />} />
          <Route path="clients/:clientId" element={<ClientDetailsPage />} />
          <Route path="clients/:clientId/edit" element={<ClientAddOrUpdateForm />} />
          <Route path="webhooks" element={<WebhooksPage />} />
          <Route path="webhooks/create" element={<WebhookAddOrUpdateForm />} />
          <Route path="webhooks/:webhookId" element={<WebhookDetailsPage />} />
          <Route path="webhooks/:webhookId/edit" element={<WebhookAddOrUpdateForm />} />
          <Route path="events/types" element={<EventTypesPage />} />
          <Route path="events/routes" element={<EventRoutesPage />} />
          <Route path="api-keys" element={<ApiKeysPage />} />
          <Route path="api-keys/create" element={<ApiKeyAddOrUpdateForm />} />
          <Route path="api-keys/:id" element={<ApiKeyDetailsPage />} />
          <Route path="api-keys/:id/edit" element={<ApiKeyAddOrUpdateForm />} />
          <Route path="policies" element={<PoliciesPage />} />
          <Route path="policies/create" element={<PolicyAddOrUpdateForm />} />
          <Route path="policies/:policyId" element={<PolicyDetailsPage />} />
          <Route path="policies/:policyId/edit" element={<PolicyAddOrUpdateForm />} />
          <Route path="auth-flows" element={<SignupFlowsPage />} />
          <Route path="auth-flows/create" element={<SignupFlowAddOrUpdateForm />} />
          <Route path="auth-flows/:signupFlowId" element={<SignupFlowDetailsPage />} />
          <Route path="auth-flows/:signupFlowId/edit" element={<SignupFlowAddOrUpdateForm />} />
          <Route path="events" element={<DashboardPage />} />
          <Route path="branding" element={<DashboardPage />} />
          <Route path="branding/templates" element={<BrandingTemplatesPage />} />
          <Route path="branding/templates/create" element={<BrandingForm />} />
          <Route path="branding/templates/:brandingId" element={<BrandingDetailsPage />} />
          <Route path="branding/templates/:brandingId/edit" element={<BrandingForm />} />
          <Route path="branding/email-templates" element={<EmailTemplatesPage />} />
          <Route path="branding/email-templates/:templateId" element={<EmailTemplateDetailsPage />} />
          <Route path="branding/email-templates/:templateId/edit" element={<EmailTemplateForm />} />
          <Route path="branding/sms-templates" element={<SmsTemplatesPage />} />
          <Route path="branding/sms-templates/:templateId" element={<SmsTemplateDetailsPage />} />
          <Route path="branding/sms-templates/:templateId/edit" element={<SmsTemplateForm />} />
          <Route path="messaging/email" element={<EmailDeliveryPage />} />
          <Route path="messaging/email/configure" element={<EmailConfigPage />} />
          <Route path="messaging/sms" element={<SMSDeliveryPage />} />
          <Route path="messaging/sms/configure" element={<SMSConfigPage />} />
          <Route path="account/profile" element={<ProfilePage />} />
          <Route path="account/settings" element={<SettingsPage />} />
          <Route path="account/mfa" element={<MFAPage />}>
            <Route index element={<MFAIndex />} />
            <Route path="totp" element={<TOTPSetupPage />} />
            <Route path="passkeys" element={<PasskeySetupPage />} />
            <Route path="sms" element={<SMSSetupPage />} />
          </Route>
        </Route>
      </Routes>
      </AppBootstrap>
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
      </StepUpProvider>
    </QueryClientProvider>
  )
}

export default App
