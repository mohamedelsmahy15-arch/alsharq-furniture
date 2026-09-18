'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message ?? 'حدث خطأ ما، حاول مرة أخرى')
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-primary px-4">
      <Card className="w-full max-w-sm border-white/10 bg-card p-6">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-widest text-gold">
            لوحة التحكم
          </p>
          <h1 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-card-foreground">
            {isSignUp ? 'إنشاء حساب أدمن' : 'مرحباً بعودتك'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSignUp
              ? 'أنشئ حسابك لبدء إدارة محتوى الموقع'
              : 'سجّل دخولك لإدارة الباقات والمنتجات وإعدادات الموقع'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" dir="rtl">
          {isSignUp && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">الاسم</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              dir="ltr"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              dir="ltr"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
          >
            {loading
              ? 'جاري التحقق...'
              : isSignUp
                ? 'إنشاء الحساب'
                : 'تسجيل الدخول'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignUp ? 'لديك حساب بالفعل؟ ' : 'مش عندك حساب؟ '}
          <Link
            href={isSignUp ? '/sign-in' : '/sign-up'}
            className="font-medium text-gold underline-offset-4 hover:underline"
          >
            {isSignUp ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </Link>
        </p>
      </Card>
    </main>
  )
}
