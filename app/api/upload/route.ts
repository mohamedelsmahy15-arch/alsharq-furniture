import { put } from '@vercel/blob'
import { NextResponse, type NextRequest } from 'next/server'
import { hasAdminAccess, COOKIE_NAME } from '@/lib/admin-access'
import fs from 'node:fs/promises'
import path from 'node:path'

export async function POST(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  const isAdmin = await hasAdminAccess(token)
  if (!isAdmin) {
    return NextResponse.json({ error: 'غير مصرح بالدخول — يرجى تسجيل الدخول للوحة التحكم' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'لم يتم إرفاق ملف' }, { status: 400 })
  }

  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    return NextResponse.json({ error: 'يسمح برفع الصور والفيديوهات فقط' }, { status: 400 })
  }

  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: 'الحد الأقصى لحجم الملف هو 50 ميجابايت' }, { status: 400 })
  }

  // If Vercel Blob token is configured, use it
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`admin/${Date.now()}-${file.name}`, file, { access: 'public' })
      return NextResponse.json({ url: blob.url })
    } catch (err) {
      console.warn('[upload] Vercel blob failed, falling back to local file:', err)
    }
  }

  // Fallback: save to public/uploads
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadsDir, { recursive: true })

    const ext = path.extname(file.name) || (file.type.startsWith('video/') ? '.mp4' : '.png')
    const baseClean = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_')
    const uniqueName = `upload-${Date.now()}-${baseClean}${ext}`
    const destPath = path.join(uploadsDir, uniqueName)

    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(destPath, buffer)

    return NextResponse.json({ url: `/uploads/${uniqueName}` })
  } catch (err) {
    console.error('[upload] Local file write failed:', err)
    return NextResponse.json({ error: 'فشل حفظ الملف على الخادم' }, { status: 500 })
  }
}
