import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Offers } from '@/components/offers'
import { Products } from '@/components/products'
import { ProductsComingSoon } from '@/components/products-coming-soon'
import { WhyUs } from '@/components/why-us'
import { Visit } from '@/components/visit'
import { ReviewsShowcase } from '@/components/reviews-showcase'
import { getHomepageShowcase } from '@/lib/reviews'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { getFullSiteData } from '@/lib/content-store'

export default async function Page() {
  const [showcase, store] = await Promise.all([
    getHomepageShowcase(),
    getFullSiteData(),
  ])
  const settings = store.settings

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader settings={settings} />
      <Hero settings={settings} />
      <Offers settings={settings} packages={store.packages} />
      {settings.productsComingSoon === 'true' ? <ProductsComingSoon /> : <Products settings={settings} />}
      <WhyUs settings={settings} />
      <ReviewsShowcase showcase={showcase} settings={settings} />
      <Visit settings={settings} />
      <FloatingWhatsApp />
    </main>
  )
}
