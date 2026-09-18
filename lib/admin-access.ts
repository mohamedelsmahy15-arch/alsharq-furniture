import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'admin_panel_access'
const MAX_AGE = 60 * 60 * 24 * 7

function token() {
  const secret = process.env.ADMIN_PANEL_PASSWORD || 'admin123456'
  return createHmac('sha256', secret).update('admin-panel-access-v1').digest('hex')
}

export async function hasAdminAccess(explicitToken?: string) {
  let value = explicitToken
  if (!value) {
    try {
      value = (await cookies()).get(COOKIE_NAME)?.value
    } catch {
      value = undefined
    }
  }
  if (!value) return false
  const expected = token()
  return value.length === expected.length && timingSafeEqual(Buffer.from(value), Buffer.from(expected))
}

export async function grantAdminAccess() {
  const jar = await cookies()
  jar.set(COOKIE_NAME, token(), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: MAX_AGE, path: '/' })
}

export async function revokeAdminAccess() {
  ;(await cookies()).delete(COOKIE_NAME)
}

export async function requireAdminAccess() {
  if (!(await hasAdminAccess())) throw new Error('Unauthorized')
}

export { COOKIE_NAME }
