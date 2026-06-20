import { describe, expect, it } from 'vitest'
import { buildLoginSchema, buildPasswordValidation } from './authSchema'

describe('buildLoginSchema', () => {
  it('allows an existing password that no longer meets the creation policy', async () => {
    await expect(
      buildLoginSchema().validate({ email: 'user@example.com', password: 'old' }),
    ).resolves.toEqual({ email: 'user@example.com', password: 'old' })
  })

  it('still requires a password', async () => {
    await expect(
      buildLoginSchema().validate({ email: 'user@example.com', password: '' }),
    ).rejects.toThrow('Password is required')
  })
})

describe('buildPasswordValidation', () => {
  it('counts Unicode code points consistently with the backend', async () => {
    const schema = buildPasswordValidation({
      min_length: 2,
      max_length: 2,
      require_uppercase: false,
      require_lowercase: false,
      require_number: false,
      require_symbol: false,
    })

    await expect(schema.validate('😀😀')).resolves.toBe('😀😀')
    await expect(schema.validate('😀')).rejects.toThrow('at least 2 characters')
  })
})
