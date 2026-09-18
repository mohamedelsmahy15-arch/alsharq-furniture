'use client'

import { useState } from 'react'
import type { PackageData } from '@/lib/content-store'
import { savePackage, deletePackage, updateSiteSettings } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AdminImageUpload, AdminGalleryUpload } from '@/components/admin-image-upload'
import { toast } from 'sonner'
import { Save, Plus, Trash2, HelpCircle } from 'lucide-react'

export function PackagesEditor({
  packages,
  settings,
}: {
  packages: PackageData[]
  settings: Record<string, string>
}) {
  const [list, setList] = useState<PackageData[]>(packages)
  const [headerSettings, setHeaderSettings] = useState({
    offersSectionBadge: settings.offersSectionBadge || 'باقات البيت الفاخر',
    offersSectionTitle: settings.offersSectionTitle || 'باقات العرسان والأسرة',
    offersSectionDesc:
      settings.offersSectionDesc ||
      'اختر الباقة التي تناسبك — كل واحدة مصممة لتحويل بيتك إلى حلم يعيش فيه.',
    guarantees:
      settings.guarantees ||
      JSON.stringify([
        { title: 'توصيل وتركيب', description: 'إلى باب منزلك مع تركيب احترافي', icon: 'Truck' },
        { title: 'ضمان على الجودة', description: 'ضمان شامل على جميع المنتجات', icon: 'Shield' },
        { title: 'أنظمة سداد', description: 'خطط دفع مرنة تناسب ميزانيتك', icon: 'CreditCard' },
        { title: 'استشارة مجانية', description: 'فريق متخصص يساعدك في الاختيار', icon: 'Phone' },
      ]),
  })

  const [savingHeader, setSavingHeader] = useState(false)

  const saveHeader = async () => {
    setSavingHeader(true)
    try {
      await updateSiteSettings(headerSettings)
      toast.success('تم حفظ إعدادات وضمانات قسم الباقات')
    } catch {
      toast.error('تعذر حفظ الإعدادات')
    } finally {
      setSavingHeader(false)
    }
  }

  const addPackage = () => {
    const nextId = Math.max(0, ...list.map((p) => p.id)) + 1
    const newPkg: PackageData = {
      id: nextId,
      slug: `package-${nextId}`,
      title: `Package ${nextId}`,
      titleAr: `باقة جديدة ${nextId}`,
      badge: null,
      price: 50,
      description: '',
      descriptionAr: 'شرح الباقة الجديدة',
      shortDescription: '',
      shortDescriptionAr: 'وصف مختصر للباقة',
      image: '/package-1-collage.png',
      highlightsAr: ['غرفة نوم مودرن', 'غرفة أطفال', 'سفرة كاملة'],
      contentsAr: ['محتوى الباقة بالتفصيل'],
      benefitsAr: [{ title: 'ضمان الجودة', description: 'خامات زان طبيعي' }],
      gallery: [],
      faqItemsAr: [{ question: 'هل يمكن تعديل الألوان؟', answer: 'نعم بالتأكيد.' }],
      sortOrder: list.length + 1,
    }
    setList([...list, newPkg])
  }

  return (
    <div className="grid gap-8">
      {/* Header & Guarantees card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">نصوص رأس قسم الباقات وشريط الضمانات</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-semibold">
            <span>شارة القسم (Badge)</span>
            <Input
              value={headerSettings.offersSectionBadge}
              onChange={(e) =>
                setHeaderSettings({ ...headerSettings, offersSectionBadge: e.target.value })
              }
              placeholder="باقات البيت الفاخر"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            <span>عنوان القسم الرئيسي</span>
            <Input
              value={headerSettings.offersSectionTitle}
              onChange={(e) =>
                setHeaderSettings({ ...headerSettings, offersSectionTitle: e.target.value })
              }
              placeholder="باقات العرسان والأسرة"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">
            <span>وصف القسم التوضيحي</span>
            <Textarea
              value={headerSettings.offersSectionDesc}
              onChange={(e) =>
                setHeaderSettings({ ...headerSettings, offersSectionDesc: e.target.value })
              }
              placeholder="اختر الباقة التي تناسبك..."
            />
          </label>
          <div className="flex justify-end md:col-span-2">
            <Button onClick={saveHeader} disabled={savingHeader}>
              <Save className="size-4" />
              {savingHeader ? 'جاري الحفظ...' : 'حفظ نصوص رأس القسم'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Packages list */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">إدارة باقات الأثاث والعروض</h2>
          <p className="text-sm text-muted-foreground">
            عدل أسعار، نصوص، مميزات، وصور كل باقة تظهر لزوار الموقع.
          </p>
        </div>
        <Button onClick={addPackage}>
          <Plus className="size-4" />
          إضافة باقة جديدة
        </Button>
      </div>

      <div className="grid gap-6">
        {list.map((pkg, index) => (
          <SinglePackageEditor
            key={pkg.id}
            pkg={pkg}
            onSave={async (updated) => {
              await savePackage(updated)
              setList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
              toast.success(`تم حفظ ${updated.titleAr}`)
            }}
            onDelete={async () => {
              if (confirm(`هل أنت متأكد من حذف ${pkg.titleAr}؟`)) {
                await deletePackage(pkg.id)
                setList((prev) => prev.filter((p) => p.id !== pkg.id))
                toast.success('تم حذف الباقة بنجاح')
              }
            }}
          />
        ))}
      </div>
    </div>
  )
}

function SinglePackageEditor({
  pkg,
  onSave,
  onDelete,
}: {
  pkg: PackageData
  onSave: (p: PackageData) => Promise<void>
  onDelete: () => Promise<void>
}) {
  const [data, setData] = useState<PackageData>(pkg)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(data)
    } catch {
      toast.error('تعذر الحفظ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="overflow-hidden border-2 transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30">
        <div>
          <CardTitle className="text-lg font-bold">{data.titleAr || data.title}</CardTitle>
          <span className="text-xs font-mono text-muted-foreground">slug: {data.slug}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave} disabled={saving} size="sm">
            <Save className="size-4" />
            {saving ? 'جاري الحفظ...' : 'حفظ الباقة'}
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="size-4" />
            حذف
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 p-6">
        {/* Basic fields */}
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-1.5 text-sm font-semibold">
            <span>اسم الباقة بالعربي</span>
            <Input
              value={data.titleAr}
              onChange={(e) => setData({ ...data, titleAr: e.target.value })}
              placeholder="مثال: باقة التأسيس"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            <span>شارة الباقة (Badge)</span>
            <Input
              value={data.badge ?? ''}
              onChange={(e) => setData({ ...data, badge: e.target.value || null })}
              placeholder="مثال: ⭐ الأكثر اختياراً"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            <span>السعر (ألف جنيه)</span>
            <Input
              type="number"
              value={data.price}
              onChange={(e) => setData({ ...data, price: Number(e.target.value) })}
              placeholder="65"
            />
          </label>
        </div>

        {/* Descriptions */}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-semibold">
            <span>الوصف المختصر (يظهر في كرت الصفحة الرئيسية)</span>
            <Textarea
              rows={2}
              value={data.shortDescriptionAr}
              onChange={(e) => setData({ ...data, shortDescriptionAr: e.target.value })}
              placeholder="ابدأ بيتك بأهم احتياجاته بأفضل قيمة..."
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            <span>الوصف الشامل (يظهر في صفحة الباقة)</span>
            <Textarea
              rows={2}
              value={data.descriptionAr}
              onChange={(e) => setData({ ...data, descriptionAr: e.target.value })}
              placeholder="تأسيس متكامل يشمل غرفة نوم، غرفة أطفال..."
            />
          </label>
        </div>

        {/* Main collage image upload */}
        <div className="rounded-xl border bg-muted/20 p-4">
          <AdminImageUpload
            label="صورة الواجهة / الكولاج للباقة"
            value={data.image}
            onChange={(url) => setData({ ...data, image: url })}
            placeholder="/package-1-collage.png"
          />
        </div>

        {/* Highlights & Contents lists */}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-semibold">
            <span>مميزات الباقة الرئيسية (اكتب كل ميزة في سطر منفصل)</span>
            <Textarea
              rows={5}
              value={data.highlightsAr.join('\n')}
              onChange={(e) =>
                setData({
                  ...data,
                  highlightsAr: e.target.value
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="غرفة نوم مودرن كاملة&#10;غرفة أطفال كاملة&#10;سفرة 6 كراسي"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            <span>محتويات الباقة بالتفصيل (اكتب كل بند في سطر منفصل)</span>
            <Textarea
              rows={5}
              value={data.contentsAr.join('\n')}
              onChange={(e) =>
                setData({
                  ...data,
                  contentsAr: e.target.value
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="دولاب + سرير + تسريحة&#10;سفرة كاملة مع 6 كراسي"
            />
          </label>
        </div>

        {/* Gallery upload */}
        <AdminGalleryUpload
          label="معرض صور غرف وتفاصيل الباقة"
          values={data.gallery}
          onChange={(urls) => setData({ ...data, gallery: urls })}
        />
      </CardContent>
    </Card>
  )
}
