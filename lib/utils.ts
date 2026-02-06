import { nanoid } from 'nanoid'

export function generateReferralCode(): string {
  return nanoid(10)
}

export function generateAdminSecret(): string {
  return nanoid(32)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
