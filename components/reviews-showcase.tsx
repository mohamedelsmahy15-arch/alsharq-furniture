'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Play, Quote, Star, X } from 'lucide-react'
import type { HomepageShowcase } from '@/lib/reviews'

type Props = { showcase: HomepageShowcase; settings?: Record<string, string> }

export function ReviewsShowcase({ showcase, settings = {} }: Props) {
  const [preview, setPreview] = useState<string | null>(null)
  const badge = settings.showcaseBadge || 'ثقة تتسلمها بإيدك'
  const title = settings.showcaseTitle || 'شغلنا وقت التسليم وآراء عملائنا'
  const desc = settings.showcaseDesc || 'شوف النتيجة الحقيقية واسمع من عملائنا قبل ما تاخد قرارك.'

  return (
    <section id="reviews" className="bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-bold tracking-widest text-gold">{badge}</span>
          <h2 className="mt-3 font-heading text-4xl font-extrabold text-foreground md:text-5xl">{title}</h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">{desc}</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-3xl border bg-card p-5 shadow-sm md:p-7">
            <div className="mb-5 flex items-end justify-between"><div><p className="text-sm font-bold text-gold">تسليمات حقيقية</p><h3 className="mt-1 text-2xl font-bold">شوف الشغل على أرض الواقع</h3></div><span className="text-sm text-muted-foreground">{showcase.deliveries.length} أعمال</span></div>
            <div className="grid gap-4 sm:grid-cols-3">{showcase.deliveries.map((item) => <button type="button" key={item.id} onClick={() => setPreview(item.imageUrl)} className="group text-right"><div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted"><Image src={item.imageUrl || '/placeholder.svg'} alt={item.title} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /></div><p className="mt-3 font-bold">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.packageName}</p></button>)}</div>
          </div>
          <div className="grid gap-4">{showcase.reviews.map((review) => <article key={review.id} className="rounded-3xl border bg-card p-5 shadow-sm"><div className="flex gap-4"><div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-muted"><Image src={review.poster || '/placeholder.svg'} alt={`تقييم ${review.customerName}`} fill sizes="80px" className="object-cover" /></div><div className="min-w-0"><div className="flex gap-0.5">{Array.from({ length: review.rating }).map((_, index) => <Star key={index} className="size-4 fill-gold text-gold" />)}</div><p className="mt-2 font-bold">{review.customerName}</p><p className="text-xs text-muted-foreground">{review.location}</p></div></div><div className="mt-4 flex gap-3"><Quote className="size-6 shrink-0 text-gold/60" /><p className="text-sm leading-7 text-muted-foreground">{review.quote}</p></div>{review.videoUrl && <button type="button" onClick={() => setPreview(review.videoUrl)} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary"><Play className="size-4 fill-current" />شاهد تجربة العميل</button>}</article>)}</div>
        </div>
      </div>
      {preview && <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4" role="dialog" aria-modal="true"><button type="button" aria-label="إغلاق المعاينة" onClick={() => setPreview(null)} className="absolute inset-0 cursor-default" /><div className="relative z-10 max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-card p-2"><button type="button" aria-label="إغلاق" onClick={() => setPreview(null)} className="absolute left-4 top-4 z-20 rounded-full bg-card/90 p-2"><X className="size-5" /></button>{preview.endsWith('.mp4') || preview.includes('video') ? <video src={preview} controls autoPlay className="max-h-[82vh] max-w-full rounded-xl" /> : <Image src={preview} alt="معاينة من أعمالنا" width={1200} height={900} className="max-h-[82vh] w-auto rounded-xl object-contain" />}</div></div>}
    </section>
  )
}
