'use client'

import { useMemo, useState } from 'react'
import type { FurnitureCategory } from '@/lib/furniture'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageIcon, ExternalLink } from 'lucide-react'
import { FavoriteButton } from '@/components/favorites-context'
import { RoomDetailsModal } from '@/components/package/room-details-modal'
import Link from 'next/link'

export function FurnitureConfigurator({ categories, packageTitle }: { categories: FurnitureCategory[]; packageTitle: string }) {
  const [selected, setSelected] = useState<Record<number, number>>(() => Object.fromEntries(categories.map((category) => [category.id, category.options[0]?.id]).filter(([, optionId]) => optionId !== undefined)) as Record<number, number>)
  const [detailsCategory, setDetailsCategory] = useState<number | null>(null)
  const selectedOptions = useMemo(() => categories.map((category) => ({ category, option: category.options.find((item) => item.id === selected[category.id]) })).filter((item) => item.option), [categories, selected])
  if (!categories.length) return null
  const details = categories.find((category) => category.id === detailsCategory)

  return <section className="border-y bg-muted/30 px-3 py-10 sm:px-4 md:py-14" dir="rtl"><div className="mx-auto max-w-5xl"><div className="mb-6 max-w-xl"><Badge variant="secondary" className="mb-2 text-xs">اختياراتك داخل الباقة</Badge><h2 className="text-balance text-2xl font-bold md:text-3xl">الغرف المتاحة داخل الباقة</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">شاهد الصور والتفاصيل المتاحة حاليًا. الأشكال المعروضة هنا يتم تحديثها من لوحة التحكم.</p></div><div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">{categories.map((category) => { const active = category.options.find((option) => option.id === selected[category.id]) ?? category.options[0]; const favorite = active ? { id: `furniture-${active.id}`, name: active.name, category: category.name, packageTitle, imageUrl: active.imageUrl, description: active.description } : null; return <Card key={category.id} className="overflow-hidden rounded-xl"><button className="relative flex aspect-[16/10] w-full items-center justify-center bg-muted" onClick={() => setDetailsCategory(category.id)} aria-label={`شاهد تفاصيل ${category.name}`}>{active?.imageUrl ? <img src={active.imageUrl} alt={category.name} className="size-full object-cover" /> : <ImageIcon className="size-12 text-muted-foreground" aria-hidden="true" />}<span className="absolute bottom-3 right-3 rounded-full bg-background/90 px-3 py-1.5 text-xs font-bold shadow">شاهد الغرفة كاملة</span></button><CardHeader className="gap-1 p-4 pb-2"><CardTitle className="text-base">{category.name}</CardTitle><CardDescription className="text-xs leading-5">{category.description}</CardDescription></CardHeader><CardContent className="flex flex-col gap-2 p-4 pt-2"><Button size="sm" onClick={() => setDetailsCategory(category.id)}>شاهد الصور والمكونات</Button><div className="flex items-center justify-between gap-2"><span className="text-xs text-muted-foreground">أشكال أخرى متاحة في قائمة المنتجات</span><Link href="/#products" className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-primary hover:underline">المنتجات <ExternalLink className="size-3" /></Link></div>{favorite && <FavoriteButton item={favorite} />}</CardContent></Card> })}</div><div className="mt-8 rounded-xl border bg-background p-4"><p className="mb-3 text-sm font-bold">ملخص الغرف داخل الباقة</p><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{selectedOptions.map(({ category, option }) => option && <button key={category.id} onClick={() => setDetailsCategory(category.id)} className="flex items-center gap-3 rounded-lg border p-2 text-right hover:bg-muted"><img src={option.imageUrl || option.media[0] || ''} alt={category.name} className="size-12 rounded-md object-cover" /><span className="min-w-0"><span className="block text-xs font-bold">{category.name}</span><span className="block truncate text-xs text-muted-foreground">اضغط لعرض التفاصيل</span></span></button>)}</div></div></div>{details && <RoomDetailsModal category={details} packageTitle={packageTitle} onClose={() => setDetailsCategory(null)} />}</section>
}

export { FavoriteButton } from '@/components/favorites-context'
