export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const SLUG_REGEX = /^[a-z0-9:-]+$/

export function sanitizeSlug(raw: string): string {
  return raw.replace(/[^a-z0-9:-]/g, '').toLowerCase()
}

export const PHONE_REGEX = /^\+?[1-9][\d\s\-().]{6,20}$/

export const PASSWORD_SPECIAL_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/

const NON_DIGIT_REGEX = /\D/g

const PHONE_DIGIT_LIMIT = 15

export function isValidEmail(email: string): boolean {
  if (email.length > 254) return false
  return EMAIL_REGEX.test(email)
}

export function isValidPhone(phone: string): boolean {
  const digitsOnly = phone.replace(NON_DIGIT_REGEX, '')
  if (digitsOnly.length < 7 || digitsOnly.length > 15) return false
  return PHONE_REGEX.test(phone)
}

export function formatPhone(value: string): string {
  let digits = value.replace(/\D/g, '').slice(0, PHONE_DIGIT_LIMIT)
  digits = digits.replace(/^0+/, '')
  if (digits.length === 0) return ''

  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  if (digits.length <= 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`

  return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, PHONE_DIGIT_LIMIT)}`
}

export const DEFAULT_PASSWORD_CONFIG = {
  min_length: 8,
  max_length: 128,
  require_uppercase: true,
  require_lowercase: true,
  require_number: true,
  require_symbol: true,
} as const
