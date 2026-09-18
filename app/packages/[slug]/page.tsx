import { notFound } from 'next/navigation'
import { getPackage } from '@/lib/packages'
import { PackageHero } from '@/components/package/hero'
import { PackageContents } from '@/components/package/contents'
import { PackageBenefits } from '@/components/package/benefits'
import { PackageGallery } from '@/components/package/gallery'
import { PackageFAQ } from '@/components/package/faq'
import { PackageRelated } from '@/components/package/related'
import { PackageCTA } from '@/components/package/cta'
import { FurnitureConfigurator } from '@/components/package/furniture-configurator'
import { getPackageFurniture } from '@/lib/furniture'
import { getSiteSettings } from '@/lib/content-store'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const pkg = await getPackage(slug)

  if (!pkg) {
    return {
      title: 'Package Not Found',
    }
  }

  return {
    title: `${pkg.titleAr} | الشرق الأوسط للأثاث`,
    description: pkg.descriptionAr,
  }
}

export default async function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const pkg = await getPackage(slug)

  if (!pkg) {
    notFound()
  }

  const [furniture, settings] = await Promise.all([
    getPackageFurniture(pkg.id),
    getSiteSettings(),
  ])

  const heroSettings = {
    titleAr: settings[`package.${slug}.heroTitleAr`] || pkg.titleAr,
    descriptionAr: settings[`package.${slug}.heroDescriptionAr`] || pkg.descriptionAr,
    highlightsAr:
      settings[`package.${slug}.heroHighlightsAr`]
        ?.split('\n')
        .map((item) => item.trim())
        .filter(Boolean) || pkg.highlightsAr,
  }

  return (
    <main className="min-h-screen bg-background">
      <PackageHero
        pkg={{
          ...pkg,
          titleAr: heroSettings.titleAr,
          descriptionAr: heroSettings.descriptionAr,
          highlightsAr: heroSettings.highlightsAr?.length ? heroSettings.highlightsAr : pkg.highlightsAr,
        }}
      />
      <FurnitureConfigurator categories={furniture} packageTitle={pkg.titleAr} />
      <PackageBenefits pkg={pkg} />
      <PackageGallery pkg={pkg} />
      <PackageContents pkg={pkg} />
      <PackageFAQ pkg={pkg} />
      <PackageCTA pkg={pkg} />
      <PackageRelated pkg={pkg} />
    </main>
  )
}
