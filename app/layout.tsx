import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import { WhatsAppModalProvider } from '@/components/whatsapp-modal'
import { Toaster } from '@/components/ui/sonner'
import { FavoritesProvider } from '@/components/favorites-context'
import './globals.css'

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'الشرق الأوسط للأثاث | معرض الأثاث الفاخر بالإسكندرية',
  description:
    'معرض الشرق الأوسط للأثاث بالإسكندرية. غرف نوم، ركنات، انتريهات، سفر، وغرف أطفال بأفضل الخامات. عروض العرسان تبدأ من 70 ألف. تواصل واتساب أو زر المعرض.',
  generator: 'v0.app',
  keywords: [
    'أثاث',
    'معرض أثاث',
    'الإسكندرية',
    'غرف نوم',
    'ركنات',
    'انتريهات',
    'عروض عرسان',
    'الشرق الأوسط للأثاث',
  ],
  openGraph: {
    title: 'الشرق الأوسط للأثاث | معرض الأثاث الفاخر بالإسكندرية',
    description:
      'بيتك يبدأ من هنا. غرف نوم، ركنات، انتريهات، سفر، وغرف أطفال بأفضل الخامات.',
    type: 'website',
    locale: 'ar_EG',
  },
}

export const viewport = {
  themeColor: '#0f0f0f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} bg-background`}>
      <body className="font-sans antialiased">
        <WhatsAppModalProvider>
          <FavoritesProvider>
            {children}
            <Toaster />
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </FavoritesProvider>
        </WhatsAppModalProvider>
      </body>
    </html>
  )
}
