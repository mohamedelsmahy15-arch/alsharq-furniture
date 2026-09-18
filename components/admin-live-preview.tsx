'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, MessageCircle } from 'lucide-react'

export function AdminLivePreview({ site }: { site: Record<string, string> }) {
  return (
    <Card className="overflow-hidden border-primary/20 shadow-lg">
      <CardHeader className="border-b bg-muted/40">
        <CardTitle className="flex items-center gap-2 text-lg"><Eye className="size-4 text-primary" /> معاينة مباشرة للموقع</CardTitle>
        <p className="text-xs text-muted-foreground">هذه المعاينة تتحدث فورًا أثناء التعديل، ولا تنشر التغييرات إلا بعد الحفظ.</p>
      </CardHeader>
      <CardContent className="bg-background p-0">
        <div className="border-b bg-primary px-5 py-4 text-primary-foreground">
          <div className="flex items-center justify-between gap-3">
            <strong className="text-lg">{site.name || 'معرض الأثاث'}</strong>
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground">{site.city || 'الإسكندرية'}</span>
          </div>
        </div>
        <div className="grid gap-5 p-6">
          <div className="rounded-2xl bg-muted/60 p-6 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">اختيارات تناسب بيتك</p>
            <h2 className="text-balance text-2xl font-extrabold">أثاثك يبدأ من هنا</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">{site.description || 'اختار من تشكيلتنا وشوف غرفتك كاملة بالتفاصيل.'}</p>
            <button type="button" className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"><MessageCircle className="size-4" /> تواصل عبر واتساب</button>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs font-semibold">
            <div className="rounded-xl border p-3"><strong className="block text-lg text-primary">{site.phoneDisplay || '012...'}</strong> اتصل بنا</div>
            <div className="rounded-xl border p-3"><strong className="block text-lg text-primary">{site.hours || 'يوميًا'}</strong> مواعيدنا</div>
            <div className="rounded-xl border p-3"><strong className="block text-lg text-primary">{site.address || 'العنوان'}</strong> زورونا</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
