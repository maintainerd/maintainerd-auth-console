import { describe, expect, it, vi } from 'vitest'
import { post } from '../client'
import { TOKEN_DELIVERY_HEADER } from '../config'
import { verifyMFALogin } from './index'

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
