import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login'
import SignupPage from './pages/signup'
import SetupOrganizationPage from './pages/setup/organization'
import SetupAdminPage from './pages/setup/admin'

function App() {
  return (
    <>
      <Routes>
				<Route path="/setup/organization" element={<SetupOrganizationPage />} />
				<Route path="/setup/admin" element={<SetupAdminPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </>
  )
}

export default App
