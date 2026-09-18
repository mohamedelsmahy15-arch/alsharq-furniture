import { SiteHeader } from '@/components/site-header'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'

export default function ProductsLayout({
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
