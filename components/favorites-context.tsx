'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Heart, MessageCircle, Trash2, X } from 'lucide-react'
import { waLink } from '@/lib/site-defaults'
import { Button } from '@/components/ui/button'

type Favorite = { id: string; name: string; category: string; packageTitle?: string; imageUrl?: string; description?: string }
type FavoritesContextValue = { favorites: Favorite[]; toggleFavorite: (item: Favorite) => void; removeFavorite: (id: string) => void; clearFavorites: () => void; isFavorite: (id: string) => boolean }
const FavoritesContext = createContext<FavoritesContextValue | null>(null)
const STORAGE_KEY = 'middle-east-furniture-favorites'

export function useFavorites() { const value = useContext(FavoritesContext); if (!value) throw new Error('useFavorites must be used within FavoritesProvider'); return value }

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [open, setOpen] = useState(false)
  useEffect(() => { try { setFavorites(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')) } catch {} }, [])
  useEffect(() => { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)) }, [favorites])
  useEffect(() => {
    const openDrawer = () => setOpen(true)
    window.addEventListener('open-favorites-drawer', openDrawer)
    return () => window.removeEventListener('open-favorites-drawer', openDrawer)
  }, [])
  const value = useMemo(() => ({ favorites, toggleFavorite: (item: Favorite) => setFavorites((current) => current.some((x) => x.id === item.id) ? current.filter((x) => x.id !== item.id) : [...current, item]), removeFavorite: (id: string) => setFavorites((current) => current.filter((item) => item.id !== id)), clearFavorites: () => setFavorites([]), isFavorite: (id: string) => favorites.some((x) => x.id === id) }), [favorites])
  return <FavoritesContext.Provider value={value}><button onClick={() => setOpen(true)} className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-xl transition-transform hover:scale-105" aria-label="فتح قائمة اختياراتي"><Heart className="size-4 fill-current" /> اختياراتي <span className="rounded-full bg-background px-2 py-0.5 text-xs text-foreground">{favorites.length}</span></button>{open && <FavoritesDrawer onClose={() => setOpen(false)} />}{children}</FavoritesContext.Provider>
}

function FavoritesDrawer({ onClose }: { onClose: () => void }) {
  const { favorites, removeFavorite, clearFavorites } = useFavorites()
  const message = ['مرحباً، أريد الاستفسار عن الاختيارات التالية:', ...favorites.map((item) => `- ${item.category}: ${item.name}${item.packageTitle ? ` (${item.packageTitle})` : ''}${item.imageUrl ? `\n  صورة: ${item.imageUrl}` : ''}`)].join('\n')
  return <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true"><button className="absolute inset-0 bg-foreground/40" onClick={onClose} aria-label="إغلاق القائمة" /><aside className="absolute bottom-0 left-0 top-0 w-full max-w-md overflow-y-auto bg-background p-6 shadow-2xl" dir="rtl"><div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold">اختياراتي ومفضلاتي</h2><p className="mt-1 text-sm text-muted-foreground">راجع ما اخترته واحذف أي قطعة لا تحتاجها.</p></div><Button variant="outline" size="icon" onClick={onClose} aria-label="إغلاق"><X /></Button></div><div className="mt-6 flex flex-col gap-3">{favorites.length > 0 && <div className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3"><span className="text-sm font-semibold">ملخص اختياراتك ({favorites.length})</span><button type="button" className="text-xs font-semibold text-destructive hover:underline" onClick={clearFavorites}>حذف الكل</button></div>}{favorites.length === 0 ? <p className="rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground">لم تضف أي قطعة بعد. اضغط على القلب بجانب أي شكل يعجبك.</p> : favorites.map((item) => <div key={item.id} className="group flex gap-3 rounded-2xl border bg-card p-3 shadow-sm transition-colors hover:border-primary/50"><div className="size-24 shrink-0 overflow-hidden rounded-xl bg-muted">{item.imageUrl ? <img src={item.imageUrl} alt={`صورة ${item.name}`} className="size-full object-cover" /> : <Heart className="m-8 size-8 text-muted-foreground" aria-hidden="true" />}</div><div className="min-w-0 flex-1"><p className="font-semibold">{item.name}</p><p className="mt-1 text-xs text-muted-foreground">{item.category}{item.packageTitle ? ` · ${item.packageTitle}` : ''}</p>{item.description && <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{item.description}</p>}<button type="button" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-destructive hover:underline" onClick={() => removeFavorite(item.id)}><Trash2 className="size-3" />حذف من اختياراتي</button></div></div>)}{favorites.length > 0 && <a href={waLink(message)} target="_blank" rel="noreferrer" className="mt-3 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground"><MessageCircle className="size-4" />إرسال اختياراتي على واتساب</a>}</div></aside></div>
}

export function FavoriteButton({ item }: { item: Favorite }) { const { toggleFavorite, isFavorite } = useFavorites(); const active = isFavorite(item.id); return <Button size="icon" variant={active ? 'default' : 'outline'} aria-label={active ? 'إزالة من اختياراتي' : 'إضافة إلى اختياراتي'} onClick={() => toggleFavorite(item)}><Heart className={active ? 'size-4 fill-current' : 'size-4'} /></Button> }
export type { Favorite }
