import { MessageCircle, ArrowLeft } from 'lucide-react'
import { WhatsAppTriggerButton } from '@/components/whatsapp-trigger-button'

export function Hero({ settings = {} }: { settings?: Record<string, string> }) {
  const heroVideo = settings.heroVideo || '/hero-video.mp4'
  const heroPoster = settings.heroPoster || '/hero-living-room.png'
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <video
        className="absolute inset-0 size-full object-cover"
        src={heroVideo}
        poster={heroPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/40" />
      <div className="absolute inset-0 bg-primary/20" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-4 pb-16 pt-28 text-center md:px-8">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/20 px-4 py-1.5 text-xs font-semibold text-gold backdrop-blur md:text-sm">
          {settings.heroBadge || 'معرض الأثاث الأول في الإسكندرية'}
        </span>

        <h1 className="font-heading text-balance text-5xl font-extrabold leading-tight text-primary-foreground md:text-7xl lg:text-8xl">
          {settings.heroTitle || 'بيتك يبدأ من هنا'}
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg font-medium text-primary-foreground/85 md:text-2xl">
          {settings.heroDescription || 'غرف نوم، ركنات، انتريهات، سفر، غرف أطفال، صالونات'}
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col items-center justify-center gap-4 sm:flex-row">
          <WhatsAppTriggerButton
            fallbackMessage={settings.whatsappDefaultMessage || "السلام عليكم، أرغب في معرفة المزيد عن الأثاث والعروض المتاحة."}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-bold text-gold-foreground transition-transform hover:scale-105 sm:w-auto"
          >
            <MessageCircle className="size-5" />
            {settings.heroWhatsappText || 'تواصل عبر واتساب'}
          </WhatsAppTriggerButton>
          <a
            href="#offers"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-primary-foreground/30 bg-white/5 px-8 py-4 text-base font-bold text-primary-foreground backdrop-blur transition-colors hover:border-gold hover:text-gold sm:w-auto"
          >
            {settings.heroOffersText || 'مشاهدة العروض'}
            <ArrowLeft className="size-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
