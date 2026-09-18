'use client'

import { Package } from '@/lib/packages'
import { MessageCircle, Phone, MapPin } from 'lucide-react'
import { phone, address, mapLink } from '@/lib/site-defaults'
import { useState } from 'react'
import { WhatsAppTriggerButton } from '@/components/whatsapp-trigger-button'

export function PackageCTA({ pkg }: { pkg: Package }) {
  const [formOpen, setFormOpen] = useState(false)

  return (
    <>
      <section className="relative bg-primary py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-12 max-w-2xl">
            <h2 className="font-heading text-4xl font-extrabold text-primary-foreground md:text-5xl">
              📞 جاهز تبدأ؟
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              اختر الطريقة التي تناسبك للتواصل معنا والحصول على عرض حصري.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <WhatsAppTriggerButton
              fallbackMessage={`السلام عليكم، أهتم بـ"${pkg.titleAr}" بقيمة ${pkg.price} ألف. أريد تفاصيل أكثر.`}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-gold hover:bg-white/10"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold group-hover:bg-gold/25">
                <MessageCircle className="size-6" />
              </div>
              <div>
                <h3 className="font-bold text-primary-foreground">
                  واتساب
                </h3>
                <p className="text-sm text-primary-foreground/70">
                  رد سريع ومباشر
                </p>
              </div>
            </WhatsAppTriggerButton>

            <a
              href={`tel:${phone}`}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-gold hover:bg-white/10"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold group-hover:bg-gold/25">
                <Phone className="size-6" />
              </div>
              <div>
                <h3 className="font-bold text-primary-foreground">
                  اتصل بنا
                </h3>
                <p className="text-sm text-primary-foreground/70">
                  استشارة مباشرة
                </p>
              </div>
            </a>

            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-gold hover:bg-white/10"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold group-hover:bg-gold/25">
                <MapPin className="size-6" />
              </div>
              <div>
                <h3 className="font-bold text-primary-foreground">
                  زر المعرض
                </h3>
                <p className="text-sm text-primary-foreground/70">
                  {address}
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Consultation Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-8">
            <h3 className="font-heading text-2xl font-bold text-card-foreground">
              طلب استشارة
            </h3>
            <p className="mt-2 text-sm text-card-foreground/70">
              سنتواصل معك في أقرب وقت
            </p>
            <form className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="اسمك"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-card-foreground placeholder-card-foreground/50"
              />
              <input
                type="tel"
                placeholder="رقم الهاتف"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-card-foreground placeholder-card-foreground/50"
              />
              <textarea
                placeholder="رسالتك"
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-card-foreground placeholder-card-foreground/50"
              />
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="w-full rounded-lg bg-gold px-4 py-2 font-bold text-gold-foreground transition hover:shadow-lg hover:shadow-gold/30"
              >
                إرسال الطلب
              </button>
            </form>
            <button
              onClick={() => setFormOpen(false)}
              className="mt-4 w-full rounded-lg bg-white/5 px-4 py-2 font-medium text-card-foreground"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </>
  )
}
