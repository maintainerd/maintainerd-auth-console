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
          <Route path="apis" element={<DashboardPage />} />
          <Route path="permissions" element={<DashboardPage />} />
          <Route path="user-management" element={<DashboardPage />} />
          <Route path="providers" element={<DashboardPage />} />
          <Route path="providers/identity" element={<DashboardPage />} />
          <Route path="providers/social" element={<DashboardPage />} />
          <Route path="applications" element={<DashboardPage />} />
          <Route path="clients" element={<DashboardPage />} />
          <Route path="policies" element={<DashboardPage />} />
          <Route path="security" element={<DashboardPage />} />
          <Route path="events" element={<DashboardPage />} />
          <Route path="webhooks" element={<DashboardPage />} />
          <Route path="monitoring" element={<DashboardPage />} />
          <Route path="analytics" element={<DashboardPage />} />
          <Route path="logs" element={<DashboardPage />} />
          <Route path="branding" element={<DashboardPage />} />
          <Route path="branding/login" element={<DashboardPage />} />
          <Route path="branding/email-templates" element={<DashboardPage />} />
          <Route path="branding/sms-templates" element={<DashboardPage />} />
          <Route path="onboarding" element={<DashboardPage />} />
          <Route path="settings" element={<DashboardPage />} />
        </Route>
        <Route path="/c/:containerId" element={<PrivateLayout fullWidth />}>
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="containers" element={<ContainersPage />} />
          <Route path="services" element={<ServicesPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
