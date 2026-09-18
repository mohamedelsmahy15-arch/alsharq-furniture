import Image from 'next/image'
import { Check, Truck, Shield, CreditCard, Phone, Sparkles, Award } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getAllPackages } from '@/lib/packages'
import type { SiteSettingsMap } from '@/lib/content-store'

const iconMap: Record<string, any> = {
  Truck,
  Shield,
  CreditCard,
  Phone,
  Sparkles,
  Award,
}

export async function Offers({
  settings = {} as Partial<SiteSettingsMap>,
  packages: initialPackages,
}: {
  settings?: Partial<SiteSettingsMap>
  packages?: any[]
}) {
  const packagesList = initialPackages ?? (await getAllPackages())

  let guarantees = [
    {
      icon: 'Truck',
      title: 'توصيل وتركيب',
      description: 'إلى باب منزلك مع تركيب احترافي',
    },
    {
      icon: 'Shield',
      title: 'ضمان على الجودة',
      description: 'ضمان شامل على جميع المنتجات',
    },
    {
      icon: 'CreditCard',
      title: 'أنظمة سداد',
      description: 'خطط دفع مرنة تناسب ميزانيتك',
    },
    {
      icon: 'Phone',
      title: 'استشارة مجانية',
      description: 'فريق متخصص يساعدك في الاختيار',
    },
  ]

  if (settings?.guarantees) {
    try {
      const parsed = JSON.parse(settings.guarantees)
      if (Array.isArray(parsed) && parsed.length > 0) {
        guarantees = parsed
      }
    } catch {}
  }

  const badgeText = settings?.offersSectionBadge || 'باقات البيت الفاخر'
  const titleText = settings?.offersSectionTitle || 'باقات العرسان والأسرة'
  const descText =
    settings?.offersSectionDesc || 'اختر الباقة التي تناسبك — كل واحدة مصممة لتحويل بيتك إلى حلم يعيش فيه.'

  return (
    <section id="offers" className="bg-primary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-gold">{badgeText}</span>
          <h2 className="mt-3 font-heading text-4xl font-extrabold text-primary-foreground md:text-5xl">
            {titleText}
          </h2>
          <p className="mt-4 text-pretty text-lg text-primary-foreground/70">{descText}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {packagesList.map((pkg) => {
            const isFeatured = pkg.badge?.includes('الأكثر') || pkg.slug === 'comfort'
            const packageImg = pkg.image || (pkg.gallery && pkg.gallery[0]) || '/placeholder.svg'
            const features = pkg.highlightsAr?.length ? pkg.highlightsAr : pkg.contentsAr || []

            return (
              <div
                key={pkg.slug}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-transform duration-300 hover:-translate-y-2',
                  isFeatured ? 'border-gold shadow-2xl shadow-gold/20 md:-mt-6 md:mb-6' : 'border-white/10',
                )}
              >
                {pkg.badge && (
                  <div className="absolute right-4 top-4 z-10 rounded-full bg-gold px-4 py-2 text-xs font-bold text-gold-foreground shadow-md">
                    {pkg.badge}
                  </div>
                )}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={packageImg}
                    alt={pkg.titleAr || pkg.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-heading text-2xl font-bold text-card-foreground">
                    {pkg.titleAr || pkg.title}
                  </h3>
                  <p className="mt-2 text-sm text-card-foreground/75">
                    {pkg.shortDescriptionAr || pkg.descriptionAr || pkg.description}
                  </p>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-xs font-medium text-muted-foreground">ابتداءً من</span>
                    <span className="font-heading text-4xl font-extrabold text-gold">{pkg.price}</span>
                    <span className="mb-1 text-sm font-medium text-muted-foreground">ألف جنيه</span>
                  </div>

                  <div className="mt-5 space-y-1 border-t border-white/5 pt-5">
                    <p className="text-xs font-semibold uppercase text-gold">تشمل الباقة:</p>
                  </div>

                  <ul className="mt-4 flex flex-1 flex-col gap-2.5">
                    {features.slice(0, 6).map((f: string) => (
                      <li key={f} className="flex items-start gap-3 text-card-foreground/90">
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                          <Check className="size-3" />
                        </span>
                        <span className="text-sm font-medium">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/packages/${pkg.slug}`}
                    className={cn(
                      'mt-7 flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all hover:scale-105',
                      isFeatured
                        ? 'bg-gold text-gold-foreground shadow-lg shadow-gold/30'
                        : 'bg-card-foreground text-card hover:bg-gold hover:text-gold-foreground',
                    )}
                  >
                    شاهد التفاصيل
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Features / Guarantees Bar */}
        <div className="mt-16 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 md:grid-cols-4 md:p-12">
          {guarantees.map((item) => {
            const Icon = iconMap[item.icon] || Award
            return (
              <div key={item.title} className="flex flex-col items-center text-center">
                <div className="mb-3 rounded-full bg-gold/10 p-3 text-gold">
                  <Icon className="size-6" />
                </div>
                <h4 className="font-heading text-sm font-bold text-card-foreground md:text-base">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs text-card-foreground/70 md:text-sm">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
