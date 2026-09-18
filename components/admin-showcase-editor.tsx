'use client'

import { useState } from 'react'
import {
  createDelivery,
  createReview,
  updateDeliveryVisibility,
  updateReviewVisibility,
  deleteDelivery,
  deleteReview,
  updateSiteSettings,
} from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AdminImageUpload } from '@/components/admin-image-upload'
import { toast } from 'sonner'
import { Plus, Trash2, Save, Star } from 'lucide-react'

type Review = {
  id: number
  customerName: string
  location: string
  quote: string
  rating: number
  poster: string
  videoUrl: string
  showOnSite: boolean
}

type Delivery = {
  id: number
  title: string
  description: string
  imageUrl: string
  videoUrl: string
  packageName: string
  showOnSite: boolean
}

export function ShowcaseEditor({
  reviews,
  deliveries,
  settings = {},
}: {
  reviews: Review[]
  deliveries: Delivery[]
  settings?: Record<string, string>
}) {
  const [reviewRows, setReviewRows] = useState(reviews)
  const [deliveryRows, setDeliveryRows] = useState(deliveries)
  const [review, setReview] = useState({
    customerName: '',
    location: '',
    quote: '',
    rating: 5,
    poster: '',
    videoUrl: '',
  })
  const [delivery, setDelivery] = useState({
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    packageName: '',
  })
  const [sectionHeaders, setSectionHeaders] = useState({
    showcaseBadge: settings.showcaseBadge || 'ثقة تتسلمها بإيدك',
    showcaseTitle: settings.showcaseTitle || 'شغلنا وقت التسليم وآراء عملائنا',
    showcaseDesc: settings.showcaseDesc || 'شوف النتيجة الحقيقية واسمع من عملائنا قبل ما تاخد قرارك.',
  })
  const [busy, setBusy] = useState(false)

  const saveHeaders = async () => {
    try {
      await updateSiteSettings(sectionHeaders)
      toast.success('تم حفظ نصوص رأس قسم التسليمات والآراء')
    } catch {
      toast.error('تعذر حفظ النصوص')
    }
  }

  const addReview = async () => {
    if (!review.customerName || !review.quote) return toast.error('أدخل اسم العميل ونص التقييم')
    setBusy(true)
    try {
      const created = await createReview(review)
      setReviewRows((rows) => [...rows, created])
      setReview({ customerName: '', location: '', quote: '', rating: 5, poster: '', videoUrl: '' })
      toast.success('تمت إضافة التقييم بنجاح')
    } catch {
      toast.error('فشل إضافة التقييم')
    } finally {
      setBusy(false)
    }
  }

  const addDelivery = async () => {
    if (!delivery.title || !delivery.imageUrl) return toast.error('أدخل العنوان وارفع صورة التسليم')
    setBusy(true)
    try {
      const created = await createDelivery(delivery)
      setDeliveryRows((rows) => [...rows, created])
      setDelivery({ title: '', description: '', imageUrl: '', videoUrl: '', packageName: '' })
      toast.success('تمت إضافة التسليم بنجاح')
    } catch {
      toast.error('فشل إضافة التسليم')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-8">
      {/* Section headers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">نصوص رأس قسم التسليمات والتقييمات</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-semibold">
            <span>شارة القسم (Badge)</span>
            <Input
              value={sectionHeaders.showcaseBadge}
              onChange={(e) => setSectionHeaders({ ...sectionHeaders, showcaseBadge: e.target.value })}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            <span>العنوان الرئيسي</span>
            <Input
              value={sectionHeaders.showcaseTitle}
              onChange={(e) => setSectionHeaders({ ...sectionHeaders, showcaseTitle: e.target.value })}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">
            <span>الوصف التوضيحي</span>
            <Input
              value={sectionHeaders.showcaseDesc}
              onChange={(e) => setSectionHeaders({ ...sectionHeaders, showcaseDesc: e.target.value })}
            />
          </label>
          <div className="flex justify-end md:col-span-2">
            <Button onClick={saveHeaders}>
              <Save className="size-4" />
              حفظ نصوص الرأس
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span>إضافة تسليم حقيقي جديد</span>
              <Plus className="size-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input
              placeholder="عنوان التسليم (مثال: تسليم شقة عريس كاملة - سموحة)"
              value={delivery.title}
              onChange={(e) => setDelivery({ ...delivery, title: e.target.value })}
            />
            <Input
              placeholder="اسم الباقة (مثال: باقة البيت الكامل)"
              value={delivery.packageName}
              onChange={(e) => setDelivery({ ...delivery, packageName: e.target.value })}
            />
            <Textarea
              rows={2}
              placeholder="وصف تفصيلي للتسليم..."
              value={delivery.description}
              onChange={(e) => setDelivery({ ...delivery, description: e.target.value })}
            />
            <AdminImageUpload
              label="صورة التسليم"
              value={delivery.imageUrl}
              onChange={(url) => setDelivery({ ...delivery, imageUrl: url })}
            />
            <AdminImageUpload
              label="فيديو التسليم (اختياري)"
              value={delivery.videoUrl}
              onChange={(url) => setDelivery({ ...delivery, videoUrl: url })}
              isVideo={true}
              accept="video/*"
            />
            <Button disabled={busy} onClick={addDelivery}>
              <Plus className="size-4" />
              حفظ ونشر التسليم
            </Button>

            <div className="grid gap-2 border-t pt-4">
              <h4 className="text-sm font-bold">التسليمات المضافة ({deliveryRows.length})</h4>
              {deliveryRows.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center gap-3 rounded-xl border bg-muted/20 p-2.5 transition-colors"
                >
                  <img src={row.imageUrl || '/placeholder.svg'} alt={row.title} className="size-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{row.title}</p>
                    <p className="text-xs text-muted-foreground">{row.packageName}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant={row.showOnSite ? 'default' : 'outline'}
                      onClick={async () => {
                        await updateDeliveryVisibility(row.id, !row.showOnSite)
                        setDeliveryRows((all) =>
                          all.map((item) => (item.id === row.id ? { ...item, showOnSite: !row.showOnSite } : item)),
                        )
                        toast.success('تم تحديث حالة الظهور')
                      }}
                    >
                      {row.showOnSite ? 'ظاهر' : 'مخفي'}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={async () => {
                        if (confirm('حذف هذا التسليم؟')) {
                          await deleteDelivery(row.id)
                          setDeliveryRows((all) => all.filter((item) => item.id !== row.id))
                          toast.success('تم حذف التسليم')
                        }
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span>إضافة تقييم ورأي عميل</span>
              <Plus className="size-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="اسم العميل (مثال: أحمد وسارة)"
                value={review.customerName}
                onChange={(e) => setReview({ ...review, customerName: e.target.value })}
              />
              <Input
                placeholder="المكان (مثال: سموحة، الإسكندرية)"
                value={review.location}
                onChange={(e) => setReview({ ...review, location: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">التقييم:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReview({ ...review, rating: star })}
                  className="p-0.5 text-gold transition-transform hover:scale-125"
                >
                  <Star
                    className={`size-5 ${star <= review.rating ? 'fill-gold' : 'text-muted-foreground'}`}
                  />
                </button>
              ))}
            </div>
            <Textarea
              rows={2}
              placeholder="نص كلام ورأي العميل..."
              value={review.quote}
              onChange={(e) => setReview({ ...review, quote: e.target.value })}
            />
            <AdminImageUpload
              label="صورة العميل أو القطعة المسلمة"
              value={review.poster}
              onChange={(url) => setReview({ ...review, poster: url })}
            />
            <AdminImageUpload
              label="فيديو تجربة العميل (اختياري)"
              value={review.videoUrl}
              onChange={(url) => setReview({ ...review, videoUrl: url })}
              isVideo={true}
              accept="video/*"
            />
            <Button disabled={busy} onClick={addReview}>
              <Plus className="size-4" />
              حفظ التقييم
            </Button>

            <div className="grid gap-2 border-t pt-4">
              <h4 className="text-sm font-bold">آراء العملاء ({reviewRows.length})</h4>
              {reviewRows.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center gap-3 rounded-xl border bg-muted/20 p-2.5 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{row.customerName}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{row.quote}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant={row.showOnSite ? 'default' : 'outline'}
                      onClick={async () => {
                        await updateReviewVisibility(row.id, !row.showOnSite)
                        setReviewRows((all) =>
                          all.map((item) => (item.id === row.id ? { ...item, showOnSite: !row.showOnSite } : item)),
                        )
                        toast.success('تم تحديث حالة الظهور')
                      }}
                    >
                      {row.showOnSite ? 'ظاهر' : 'مخفي'}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={async () => {
                        if (confirm('حذف هذا التقييم؟')) {
                          await deleteReview(row.id)
                          setReviewRows((all) => all.filter((item) => item.id !== row.id))
                          toast.success('تم حذف التقييم')
                        }
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
