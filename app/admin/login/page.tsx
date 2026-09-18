import { enterAdminPanel } from '@/app/actions/admin-access'
import { hasAdminAccess } from '@/lib/admin-access'
import { redirect } from 'next/navigation'

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await hasAdminAccess()) redirect('/admin')
  const params = await searchParams
  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <section className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-primary">معرض الشرق الأوسط للأثاث</p>
          <h1 className="mt-2 text-3xl font-extrabold">دخول لوحة التحكم</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            لوحة إدارة وتعديل كامل نصوص وصور وبيانات الموقع.
          </p>
        </div>
        <form action={enterAdminPanel} className="grid gap-4">
          <label className="grid gap-2 text-sm font-semibold" htmlFor="phone">
            رقم هاتف المدير
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="username"
              placeholder="أدخل رقم هاتف المدير"
              required
              className="h-12 rounded-xl border bg-background px-4 outline-none ring-offset-background focus:ring-2 focus:ring-primary"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold" htmlFor="password">
            كلمة مرور لوحة التحكم
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              autoComplete="current-password"
              className="h-12 rounded-xl border bg-background px-4 outline-none ring-offset-background focus:ring-2 focus:ring-primary"
            />
          </label>
          {params.error && (
            <p role="alert" className="text-sm font-semibold text-destructive">
              رقم الهاتف أو كلمة المرور غير صحيحة.
            </p>
          )}
          <button
            type="submit"
            className="h-12 rounded-xl bg-primary font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            دخول لوحة التحكم
          </button>
        </form>
        <a
          href="/"
          className="mt-6 block text-center text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          العودة للموقع
        </a>
      </section>
    </main>
  )
}
