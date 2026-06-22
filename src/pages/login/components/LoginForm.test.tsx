import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/utils'
import LoginForm from './LoginForm'

const { loginMock, navigateMock } = vi.hoisted(() => ({
  loginMock: vi.fn(),
  navigateMock: vi.fn(),
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ login: loginMock }),
}))

vi.mock('@/hooks/useTenant', () => ({
  useTenant: () => ({
    getCurrentTenant: () => ({
      identifier: 'acme',
      registration_config: { self_registration_enabled: true },
    }),
  }),
}))

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ showSuccess: vi.fn() }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => navigateMock }
})

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows validation error for empty email', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />, { route: '/acme/login', path: '/:tenantId/login' })

    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByText('Email is required')).toBeInTheDocument()
    expect(loginMock).not.toHaveBeenCalled()
  })

  it('shows validation error for empty password', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />, { route: '/acme/login', path: '/:tenantId/login' })

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'user@example.com')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByText('Password is required')).toBeInTheDocument()
    expect(loginMock).not.toHaveBeenCalled()
  })

  it('calls login with email, password, and tenant context', async () => {
    const user = userEvent.setup()
    loginMock.mockResolvedValueOnce({ mfaRequired: false, account: null })
    renderWithProviders(<LoginForm />, { route: '/acme/login', path: '/:tenantId/login' })

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await vi.waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('user@example.com', 'password123', 'acme')
    })
  })
})
