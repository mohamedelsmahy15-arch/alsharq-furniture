'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { MessageCircle, X } from 'lucide-react'
import { waLink } from '@/lib/site-defaults'

type Interest = {
  label: string
  message: string
}

const interests: Interest[] = [
  {
    label: '🛏️ غرفة نوم',
    message: 'السلام عليكم، أنا مهتم بغرفة نوم، حابب أعرف الموديلات المتاحة والأسعار.',
  },
  {
    label: '🍽️ سفرة',
    message: 'السلام عليكم، أنا مهتم بسفرة، حابب أعرف الموديلات المتاحة والأسعار.',
  },
  {
    label: '🛋️ ركنة أو انتريه',
    message: 'السلام عليكم، أنا مهتم بركنة أو انتريه، حابب أعرف الموديلات المتاحة والأسعار.',
  },
  {
    label: '🧸 غرفة أطفال',
    message: 'السلام عليكم، أنا مهتم بغرفة أطفال، حابب أعرف الموديلات المتاحة والأسعار.',
  },
  {
    label: '🏠 تأثيث كامل (باقة)',
    message: 'السلام عليكم، أنا مهتم بتأثيث بيتي بالكامل، حابب أعرف تفاصيل الباقات المتاحة.',
  },
  {
    label: '💬 حاجة تانية',
    message: 'السلام عليكم، حابب أستفسر عن الأثاث والعروض المتاحة لديكم.',
  },
]

type WhatsAppModalContextValue = {
  open: (fallbackMessage?: string) => void
}

const WhatsAppModalContext = createContext<WhatsAppModalContextValue | null>(null)

export function useWhatsAppModal() {
  const ctx = useContext(WhatsAppModalContext)
  if (!ctx) {
    throw new Error('useWhatsAppModal must be used within WhatsAppModalProvider')
  }
  return ctx
}

export function WhatsAppModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [fallback, setFallback] = useState<string | undefined>(undefined)

  const open = useCallback((fallbackMessage?: string) => {
    setFallback(fallbackMessage)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  return (
    <WhatsAppModalContext.Provider value={{ open }}>
      {children}

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={close}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-card p-6 shadow-2xl sm:rounded-3xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-gold">
                  جاهز تبدأ؟
                </p>
                <h3 className="mt-1 font-heading text-2xl font-extrabold text-card-foreground">
                  إيه أكتر حاجة مهتم بيها؟
                </h3>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="إغلاق"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-card-foreground/70 transition hover:bg-white/10 hover:text-card-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {interests.map((it) => (
                <a
                  key={it.label}
                  href={waLink(it.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-4 text-center text-sm font-bold text-card-foreground transition hover:border-gold hover:bg-gold/10 hover:text-gold"
                >
                  {it.label}
                </a>
              ))}
            </div>

            <a
              href={waLink(fallback ?? interests[interests.length - 1].message)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="mt-5 flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-bold text-gold-foreground transition-transform hover:scale-[1.02]"
            >
              <MessageCircle className="size-4" />
              تواصل مباشرة على واتساب
            </a>
          </div>
        </div>
      )}
    </WhatsAppModalContext.Provider>
  )
}
