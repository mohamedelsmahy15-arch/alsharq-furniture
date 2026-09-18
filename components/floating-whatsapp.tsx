import { MessageCircle } from 'lucide-react'
import { WhatsAppTriggerButton } from '@/components/whatsapp-trigger-button'

export function FloatingWhatsApp() {
  return (
    <WhatsAppTriggerButton
      fallbackMessage="السلام عليكم، أرغب في الاستفسار عن الأثاث والعروض."
      ariaLabel="تواصل عبر واتساب"
      className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full bg-gold px-4 py-3.5 font-bold text-gold-foreground shadow-2xl shadow-gold/30 transition-transform hover:scale-105 md:px-5"
    >
      <MessageCircle className="size-6 shrink-0" />
      <span className="hidden text-sm sm:inline">تواصل واتساب</span>
    </WhatsAppTriggerButton>
  )
}
