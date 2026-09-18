'use client'

import { BellRing, Sparkles } from 'lucide-react'

export function ProductsComingSoon() {
  return (
    <section id="products" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gold/15 text-gold">
          <BellRing className="size-8" aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.24em] text-gold">قريباً</p>
        <h2 className="mt-3 font-heading text-4xl font-extrabold text-foreground md:text-6xl">منتجاتنا قريباً</h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-8 text-muted-foreground">نجهّز تشكيلة جديدة بعناية. ستظهر المنتجات والتفاصيل قريبًا، بينما تظل الباقات وخدمة التواصل متاحة لكم.</p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-sm"><Sparkles className="size-4 text-gold" aria-hidden="true" /> نعمل على تجهيز الجديد لكم</div>
      </div>
    </section>
  )
}
