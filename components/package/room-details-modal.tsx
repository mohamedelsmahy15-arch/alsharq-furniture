'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FavoriteButton } from '@/components/favorites-context'
import type { FurnitureCategory } from '@/lib/furniture'

export function RoomDetailsModal({ category, packageTitle, onClose }: { category: FurnitureCategory; packageTitle: string; onClose: () => void }) {
  const [activeId, setActiveId] = useState(category.options[0]?.id)
  const [imageIndex, setImageIndex] = useState(0)
  const active = category.options.find((option) => option.id === activeId) ?? category.options[0]
  if (!active) return null
  const images = useMemo(() => Array.from(new Set([active.imageUrl, ...active.media].filter(Boolean))), [active.imageUrl, active.media])
  const favorite = { id: `furniture-${active.id}`, name: active.name, category: category.name, packageTitle, imageUrl: active.imageUrl, description: active.description }
  const next = () => setImageIndex((current) => images.length ? (current + 1) % images.length : 0)
  const previous = () => setImageIndex((current) => images.length ? (current - 1 + images.length) % images.length : 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" dir="rtl">
      <Card className="max-h-[94vh] w-full max-w-6xl overflow-y-auto">
        <CardHeader className="sticky top-0 z-10 flex-row items-start justify-between border-b bg-card">
          <div><CardTitle className="text-2xl">{category.name} كاملة</CardTitle><CardDescription>{category.description}</CardDescription></div>
          <Button variant="outline" size="icon" onClick={onClose} aria-label="إغلاق"><X /></Button>
        </CardHeader>
        <CardContent className="grid gap-6 p-4 md:grid-cols-[1.1fr_0.9fr] md:p-6">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
              {images[imageIndex] ? <img src={images[imageIndex]} alt={`${active.name} - صورة ${imageIndex + 1}`} className="size-full object-cover" /> : <div className="flex size-full items-center justify-center text-muted-foreground">الصور ستضاف من لوحة التحكم</div>}
              {images.length > 1 && <><Button size="icon" variant="secondary" className="absolute right-3 top-1/2" onClick={previous} aria-label="الصورة السابقة"><ChevronRight /></Button><Button size="icon" variant="secondary" className="absolute left-3 top-1/2" onClick={next} aria-label="الصورة التالية"><ChevronLeft /></Button></>}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {images.map((image, index) => <button key={`${image}-${index}`} onClick={() => setImageIndex(index)} className={`aspect-square overflow-hidden rounded-lg border-2 ${index === imageIndex ? 'border-primary' : 'border-transparent'}`}><img src={image} alt={`${active.name} - صورة ${index + 1}`} className="size-full object-cover" /></button>)}
            </div>
            {active.videoUrl && <div className="mt-5 overflow-hidden rounded-2xl border bg-muted"><video controls preload="metadata" className="w-full" src={active.videoUrl}>المتصفح لا يدعم تشغيل الفيديو.</video></div>}
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-3"><div><p className="text-sm text-muted-foreground">الشكل المختار</p><h3 className="text-2xl font-bold">{active.name}</h3></div><FavoriteButton item={favorite} /></div>
            <p className="leading-7 text-muted-foreground">{active.description}</p>
            <div><h4 className="mb-2 font-semibold">مكونات وتفاصيل الغرفة</h4><ul className="grid gap-2 text-sm text-muted-foreground">{active.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul></div>
            <div><h4 className="mb-2 font-semibold">المواصفات</h4><ul className="grid gap-2 text-sm text-muted-foreground">{active.specs.map((spec) => <li key={spec}>• {spec}</li>)}</ul></div>
            <div className="rounded-xl bg-muted p-4 text-sm leading-6">المعرض يوضح كل قطعة داخل العرض. اختار الشكل الذي يعجبك، ثم أرسله من زر اختيارات الباقة عبر واتساب.</div>
            <Button variant="outline" onClick={onClose}><MessageCircle data-icon="inline-start" />العودة لاختيارات الباقة</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
