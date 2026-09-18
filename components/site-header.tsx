'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WhatsAppTriggerButton } from '@/components/whatsapp-trigger-button'
import { useFavorites } from '@/components/favorites-context'

const links = [
  { href: '/#offers', label: 'العروض' },
  { href: '/#products', label: 'المنتجات' },
  { href: '/#why', label: 'لماذا نحن' },
  { href: '/#visit', label: 'المعرض' },
]

export function SiteHeader({ settings = {} }: { settings?: Record<string, string> }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { favorites } = useFavorites()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const siteName = settings.name || 'الشرق الأوسط للأثاث'
  const logoImage = settings.logoImage

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled
          ? 'bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/80'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
        <Link href="/#top" className="flex items-center gap-2">
          {logoImage ? (
            <img src={logoImage} alt={siteName} className="h-10 max-w-[160px] object-contain md:h-12" />
          ) : (
            <span className="font-heading text-lg font-extrabold tracking-tight text-primary-foreground md:text-xl">
              {siteName}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('open-favorites-drawer'))}
            aria-label="فتح اختياراتي ومفضلاتي"
            className="flex items-center gap-2 rounded-full border border-gold/70 bg-primary-foreground/10 px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-colors hover:bg-gold hover:text-gold-foreground sm:px-4 sm:text-sm"
          >
            <Heart className="size-4 fill-current" />
            <span>اختياراتي ومفضلاتي</span>
            <span className="min-w-5 rounded-full bg-gold px-1.5 py-0.5 text-center text-[11px] text-gold-foreground">{favorites.length}</span>
          </button>
          <WhatsAppTriggerButton
            fallbackMessage="السلام عليكم، أرغب في الاستفسار عن الأثاث المتوفر لديكم."
            className="hidden items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-gold-foreground transition-transform hover:scale-105 sm:flex"
          >
            <MessageCircle className="size-4" />
            واتساب
          </WhatsAppTriggerButton>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="القائمة"
            className="flex size-10 items-center justify-center rounded-md text-primary-foreground lg:hidden"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gold/20 bg-primary px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-primary-foreground/90 hover:bg-white/5 hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
