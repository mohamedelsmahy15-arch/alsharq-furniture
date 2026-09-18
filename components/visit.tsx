import { MapPin, Phone, MessageCircle, Clock } from 'lucide-react'
import { getSite } from '@/lib/site'
import { WhatsAppTriggerButton } from '@/components/whatsapp-trigger-button'
import type { SiteSettingsMap } from '@/lib/content-store'

export async function Visit({ settings = {} as Partial<SiteSettingsMap> }: { settings?: Partial<SiteSettingsMap> }) {
  const dynamicSite = await getSite()

  const addressVal = settings.address || dynamicSite.address
  const phoneVal = settings.phoneDisplay || dynamicSite.phoneDisplay
  const hoursVal = settings.hours || dynamicSite.hours
  const mapLinkVal = settings.mapLink || dynamicSite.mapLink
  const mapEmbedVal = settings.mapEmbed || dynamicSite.mapEmbed
  const siteNameVal = settings.name || dynamicSite.name
  const siteCityVal = settings.city || dynamicSite.city
  const footerTextVal = settings.footerText || 'جميع الحقوق محفوظة.'

  const badgeText = settings.visitBadge || 'زرنا الآن'
  const titleText = settings.visitTitle || 'المعرض'
  const descText =
    settings.visitDesc ||
    'ندعوك لزيارة المعرض ومعاينة القطع على الطبيعة، أو تواصل معنا مباشرة عبر الواتساب.'

  const items = [
    {
      icon: MapPin,
      label: 'العنوان',
      value: addressVal,
      href: mapLinkVal,
      hintText: 'اضغط لفتح الخريطة ←',
    },
    {
      icon: Phone,
      label: 'الهاتف',
      value: phoneVal,
      href: `tel:+2${phoneVal}`,
      hintText: 'اضغط للاتصال المباشر ←',
    },
    {
      icon: Clock,
      label: 'مواعيد العمل',
      value: hoursVal,
    },
  ]

  return (
    <section id="visit" className="bg-primary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-14 max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-widest text-gold">{badgeText}</span>
          <h2 className="mt-3 font-heading text-4xl font-extrabold text-primary-foreground md:text-5xl">
            {titleText}
          </h2>
          <p className="mt-4 text-pretty text-lg text-primary-foreground/70">{descText}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            {items.map((it) => {
              const isLink = Boolean(it.href)
              const content = (
                <div
                  className={`flex items-start gap-4 rounded-2xl border bg-white/5 p-5 transition-all ${
                    isLink
                      ? 'cursor-pointer border-white/10 hover:border-gold hover:bg-white/10'
                      : 'border-white/10 hover:border-gold/40'
                  }`}
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <it.icon className="size-6" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary-foreground/60">{it.label}</p>
                    <p className="mt-1 whitespace-pre-line text-lg font-bold text-primary-foreground">
                      {it.value}
                    </p>
                    {isLink && 'hintText' in it && (
                      <p className="mt-1 text-xs font-medium text-gold">
                        {(it as { hintText: string }).hintText}
                      </p>
                    )}
                  </div>
                </div>
              )
              return it.href ? (
                <a key={it.label} href={it.href} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <div key={it.label}>{content}</div>
              )
            })}

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:+2${phoneVal}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:border-gold hover:bg-white/20"
              >
                <Phone className="size-5 text-gold" />
                اتصل الآن
              </a>
              <WhatsAppTriggerButton
                fallbackMessage={
                  settings.whatsappDefaultMessage || 'السلام عليكم، أرغب في تحديد موعد لزيارة المعرض.'
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-bold text-gold-foreground transition-transform hover:scale-105"
              >
                <MessageCircle className="size-5" />
                واتساب
              </WhatsAppTriggerButton>
            </div>
          </div>

          <div className="relative min-h-[340px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            {mapEmbedVal ? (
              <iframe
                title="موقع المعرض على الخريطة"
                src={mapEmbedVal}
                className="size-full"
                style={{ border: 0, minHeight: 340 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="flex min-h-[340px] items-center justify-center bg-white/5 p-6 text-center text-primary-foreground/60">
                خريطة المعرض
              </div>
            )}
            {mapLinkVal && (
              <a
                href={mapLinkVal}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-primary/90 px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg backdrop-blur-sm transition-transform hover:scale-105 hover:bg-primary"
              >
                <MapPin className="size-4 text-gold" />
                افتح في الخريطة
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl border-t border-white/10 px-4 pt-8 md:px-8">
        <p className="text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} {siteNameVal} — {siteCityVal}. {footerTextVal}
        </p>
      </div>
    </section>
  )
}
