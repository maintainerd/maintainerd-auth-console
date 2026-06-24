import { describe, expect, it, vi } from 'vitest'
import { post } from '../client'
import { TOKEN_DELIVERY_HEADER } from '../config'
import { beginMFALoginWebAuthn, sendMFALoginEmailOtp, sendMFALoginSMS, verifyMFALogin } from './index'

vi.mock('../client', () => ({
  get: vi.fn(),
  post: vi.fn(),
}))

describe('verifyMFALogin', () => {
  it('preserves tenant context for an internal MFA challenge', async () => {
    vi.mocked(post).mockResolvedValueOnce({ success: true })
    const request = { mfa_challenge_token: 'challenge', method: 'totp', code: '123456' }

    await verifyMFALogin(request, 'acme')

    expect(post).toHaveBeenCalledWith(
      '/login/mfa/verify?tenant_id=acme',
      request,
      { headers: TOKEN_DELIVERY_HEADER },
    )
  })
})

describe('login MFA challenge helpers', () => {
  it('sends SMS with tenant context only', async () => {
    vi.mocked(post).mockResolvedValueOnce({ success: true })

    await sendMFALoginSMS('challenge', 'acme')

    expect(post).toHaveBeenCalledWith('/login/mfa/send-sms?tenant_id=acme', {
      mfa_challenge_token: 'challenge',
    })
  })

  it('sends email OTP with tenant context only', async () => {
    vi.mocked(post).mockResolvedValueOnce({ success: true })

    await sendMFALoginEmailOtp('challenge', 'acme')

    expect(post).toHaveBeenCalledWith(
      '/login/mfa/send-email-otp?tenant_id=acme',
      { mfa_challenge_token: 'challenge' },
      { headers: TOKEN_DELIVERY_HEADER },
    )
  })

  it('begins WebAuthn with tenant context only', async () => {
    vi.mocked(post).mockResolvedValueOnce({ success: true, data: { publicKey: {} } })

    await beginMFALoginWebAuthn('challenge', 'acme')

    expect(post).toHaveBeenCalledWith('/login/mfa/webauthn/begin?tenant_id=acme', {
      mfa_challenge_token: 'challenge',
    })
  })
})
