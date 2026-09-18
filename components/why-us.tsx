import { ShieldCheck, Gem, Award, Headphones, Star, CheckCircle } from 'lucide-react'
import type { SiteSettingsMap } from '@/lib/content-store'

const iconMap: Record<string, any> = {
  ShieldCheck,
  Gem,
  Award,
  Headphones,
  Star,
  CheckCircle,
}

export function WhyUs({ settings = {} as Partial<SiteSettingsMap> }: { settings?: Partial<SiteSettingsMap> }) {
  let reasons = [
    {
      icon: 'ShieldCheck',
      title: 'الثقة',
      desc: 'سمعة بُنيت على مدار سنوات وآلاف العملاء الراضين عن جودة وخدمة المعرض.',
    },
    {
      icon: 'Gem',
      title: 'الخامات',
      desc: 'أفضل أنواع الأخشاب والأقمشة المختارة بعناية لتدوم معك لسنوات طويلة.',
    },
    {
      icon: 'Award',
      title: 'الخبرة',
      desc: 'فريق متخصص في تصميم وتجهيز البيوت يساعدك على اختيار الأنسب لمساحتك.',
    },
    {
      icon: 'Headphones',
      title: 'خدمة ما بعد البيع',
      desc: 'متابعة وصيانة وضمان حقيقي بعد الاستلام — راحتك تهمنا دائمًا.',
    },
  ]

  if (settings.whyUsReasons) {
    try {
      const parsed = JSON.parse(settings.whyUsReasons)
      if (Array.isArray(parsed) && parsed.length > 0) {
        reasons = parsed
      }
    } catch {}
  }

  const badge = settings.whyUsBadge || 'لماذا نحن'
  const title = settings.whyUsTitle || 'لماذا الشرق الأوسط للأثاث؟'

  return (
    <section id="why" className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-gold">{badge}</span>
          <h2 className="mt-3 font-heading text-4xl font-extrabold text-foreground md:text-5xl">{title}</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => {
            const Icon = iconMap[r.icon] || ShieldCheck
            return (
              <div
                key={r.title}
                className="group rounded-2xl border border-border bg-card p-7 text-center transition-shadow hover:shadow-xl"
              >
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-gold-foreground">
                  <Icon className="size-7" />
                </div>
                <h3 className="mt-5 font-heading text-xl font-bold text-card-foreground">{r.title}</h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
