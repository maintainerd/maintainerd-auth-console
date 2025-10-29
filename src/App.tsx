import { Route, Routes, Navigate } from 'react-router-dom'
import LoginPage from './pages/login'
import SignupPage from './pages/signup'
import SetupOrganizationPage from './pages/setup/organization'
import SetupAdminPage from './pages/setup/admin'
import DashboardPage from './pages/dashboard'
import { PrivateLayout } from './components/layout/PrivateLayout'
import UsersPage from './pages/users'
import RolesPage from './pages/roles'
import ContainersPage from './pages/containers'
import ServicesPage from './pages/services'
import ApisPage from './pages/apis'
import PermissionsPage from './pages/permissions'
import IdentityProvidersPage from './pages/identity-providers'
import SocialProvidersPage from './pages/social-providers'
import ClientsPage from './pages/clients'
import ApiKeysPage from './pages/api-keys'
import PoliciesPage from './pages/policies'
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

function App() {
  return (
    <>
      <Routes>
				<Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/setup/organization" element={<SetupOrganizationPage />} />
        <Route path="/setup/admin" element={<SetupAdminPage />} />
        <Route path="/c/:containerId" element={<PrivateLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="monitoring" element={<AnalyticsPage />} />
          <Route path="security/settings" element={<SecuritySettingsPage />} />
          <Route path="security/password-policies" element={<PasswordPoliciesPage />} />
          <Route path="security/sessions" element={<SessionManagementPage />} />
          <Route path="security/threats" element={<ThreatDetectionPage />} />
          <Route path="security/ip-restrictions" element={<IpRestrictionsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
        <Route path="/c/:containerId" element={<PrivateLayout fullWidth />}>
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="containers" element={<ContainersPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="apis" element={<ApisPage />} />
          <Route path="permissions" element={<PermissionsPage />} />
          <Route path="providers/identity" element={<IdentityProvidersPage />} />
          <Route path="providers/social" element={<SocialProvidersPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="api-keys" element={<ApiKeysPage />} />
          <Route path="policies" element={<PoliciesPage />} />
					<Route path="onboarding" element={<OnboardingPage />} />
					<Route path="events" element={<DashboardPage />} />
          <Route path="webhooks" element={<DashboardPage />} />
          <Route path="logs" element={<LogMonitoringPage />} />
          <Route path="branding" element={<DashboardPage />} />
          <Route path="branding/login" element={<LoginBrandingPage />} />
          <Route path="branding/email-templates" element={<EmailTemplatesPage />} />
          <Route path="branding/sms-templates" element={<SmsTemplatesPage />} />
          <Route path="settings" element={<DashboardPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
