import { SiteHeader } from '@/components/site-header'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      {children}
      <FloatingWhatsApp />
    </>
  )
}
