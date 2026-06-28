import { describe, expect, it } from 'vitest'
import { brandingSchema } from './brandingSchema'

const validBranding = {
  name: 'acme-light',
  layout: 'centered',
  company_name: 'Acme Inc.',
  logo_url: '',
  favicon_url: '',
  support_url: '',
  privacy_policy_url: '',
  terms_of_service_url: '',
}

describe('brandingSchema', () => {
  it.each(['centered', 'full_page', 'split'])('accepts the %s layout', async (layout) => {
    await expect(brandingSchema.validate({ ...validBranding, layout })).resolves.toMatchObject({ layout })
  })

  it('rejects an unsupported layout', async () => {
    await expect(
      brandingSchema.validate({ ...validBranding, layout: 'sidebar' }),
    ).rejects.toThrow('Select a valid login layout')
  })

  it('defaults an omitted layout to centered', async () => {
    const { layout } = await brandingSchema.validate({ ...validBranding, layout: undefined })
    expect(layout).toBe('centered')
  })
})
