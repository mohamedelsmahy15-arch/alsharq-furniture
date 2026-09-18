'use client'

import { useState } from 'react'
import type { FurnitureCategory } from '@/lib/furniture'
import { updateFurnitureOption } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AdminImageUpload, AdminGalleryUpload } from '@/components/admin-image-upload'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

export function FurnitureEditor({ furniture }: { furniture: FurnitureCategory[][] }) {
  return (
    <section className="grid gap-8">
      <div>
        <h2 className="text-xl font-bold">تعديل خيارات تفصيل أثاث الباقات</h2>
        <p className="text-sm text-muted-foreground">
          عدل تفاصيل كل غرفة أو قطعة أثاث تتاح للعميل للاختيار منها داخل كل باقة.
        </p>
      </div>

      {furniture.map((categories, packageIndex) => (
        <div key={packageIndex} className="grid gap-6 rounded-2xl border bg-muted/10 p-6">
          <h3 className="text-lg font-bold text-primary">
            {['باقة التأسيس', 'باقة الراحة', 'باقة البيت الكامل'][packageIndex] || `باقة ${packageIndex + 1}`}
          </h3>
          {categories.map((category) => (
            <div key={category.id} className="grid gap-4">
              <h4 className="font-semibold text-foreground/90 border-r-4 border-gold pr-2">
                {category.name} ({category.description})
              </h4>
              <div className="grid gap-4">
                {category.options.map((option) => (
                  <FurnitureOptionForm key={option.id} option={option} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  )
}

function FurnitureOptionForm({ option }: { option: FurnitureCategory['options'][number] }) {
  const [value, setValue] = useState(option)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      await updateFurnitureOption(value)
      toast.success('تم حفظ الشكل وتحديث وسائطه بنجاح')
    } catch {
      toast.error('فشل حفظ البيانات')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 py-3">
        <CardTitle className="text-base font-bold">{value.name}</CardTitle>
        <Button onClick={save} disabled={saving} size="sm">
          <Save className="size-4" />
          {saving ? 'جاري الحفظ...' : 'حفظ الشكل'}
        </Button>
      </CardHeader>
      <CardContent className="grid gap-5 p-5 md:grid-cols-[220px_1fr]">
        <div className="grid gap-4">
          <AdminImageUpload
            label="الصورة الرئيسية للشكل"
            value={value.imageUrl}
            onChange={(url) => setValue({ ...value, imageUrl: url })}
          />
          <AdminImageUpload
            label="فيديو توضيحي (اختياري)"
            value={value.videoUrl}
            onChange={(url) => setValue({ ...value, videoUrl: url })}
            isVideo={true}
            placeholder="رابط فيديو أو ارفع..."
            accept="video/*"
          />
        </div>

        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs font-semibold">
              <span>اسم الشكل</span>
              <Input
                value={value.name}
                onChange={(e) => setValue({ ...value, name: e.target.value })}
                placeholder="اسم الشكل"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold">
              <span>المميزات (مفصولة بفاصلة ،)</span>
              <Input
                value={value.features.join('، ')}
                onChange={(e) =>
                  setValue({
                    ...value,
                    features: e.target.value
                      .split('،')
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="خشب زان طبيعي، إضاءة مخفية..."
              />
            </label>
          </div>

          <label className="grid gap-1.5 text-xs font-semibold">
            <span>شرح ومواصفات الشكل بالتفصيل</span>
            <Textarea
              rows={2}
              value={value.description}
              onChange={(e) => setValue({ ...value, description: e.target.value })}
              placeholder="شرح ومميزات الشكل..."
            />
          </label>

          <label className="grid gap-1.5 text-xs font-semibold">
            <span>المقاسات والأبعاد (مفصولة بفاصلة ،)</span>
            <Input
              value={value.specs.join('، ')}
              onChange={(e) =>
                setValue({
                  ...value,
                  specs: e.target.value
                    .split('،')
                    .map((item) => item.trim())
                    .filter(Boolean),
                })
              }
              placeholder="سرير 160 سم، دولاب 260 سم..."
            />
          </label>

          <AdminGalleryUpload
            label="معرض صور إضافية لهذا الشكل"
            values={value.media}
            onChange={(urls) => setValue({ ...value, media: urls })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
