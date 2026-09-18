'use server'

import { redirect } from 'next/navigation'
import { grantAdminAccess, revokeAdminAccess } from '@/lib/admin-access'

const ADMIN_PHONE = '01221250044'

function normalizePhone(value: string) {
  return value.replace(/[\s()-]/g, '').replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
}

export async function enterAdminPanel(formData: FormData) {
  const phone = normalizePhone(String(formData.get('phone') ?? ''))
  const password = String(formData.get('password') ?? '')
  const expectedPassword = process.env.ADMIN_PANEL_PASSWORD || 'admin123456'
  if (phone !== ADMIN_PHONE || password !== expectedPassword) {
    redirect('/admin/login?error=1')
  }
  await grantAdminAccess()
  redirect('/admin')
}

export async function logoutAdmin() {
  await revokeAdminAccess()
  redirect('/admin/login')
}
