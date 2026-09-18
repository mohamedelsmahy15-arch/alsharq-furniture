import { db } from '@/lib/db'
import {
  packages as packagesTable,
  packageHighlights,
  packageContents,
  packageBenefits,
  packageGallery,
  packageFaq,
  packageTestimonials,
  packageRelated,
} from '@/lib/db/schema'
import { asc, eq, inArray } from 'drizzle-orm'

export interface Benefit {
  title: string
  description: string
  icon: string
}

export interface BenefitAr {
  title: string
  description: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQItemAr {
  question: string
  answer: string
}

export interface Testimonial {
  name: string
  role: string
  text: string
  rating: number
  image?: string
}

export interface Package {
  id: number
  slug: string
  title: string
  titleAr: string
  badge?: string | null
  price: number
  description: string
  descriptionAr: string
  shortDescription: string
  shortDescriptionAr: string
  highlights: string[]
  highlightsAr: string[]
  contents: string[]
  contentsAr: string[]
  benefits: Benefit[]
  benefitsAr: BenefitAr[]
  gallery: string[]
  faqItems: FAQItem[]
  faqItemsAr: FAQItemAr[]
  testimonials: Testimonial[]
  image?: string
  relatedPackages: string[]
}

async function hydratePackage(row: typeof packagesTable.$inferSelect): Promise<Package> {
  const [highlights, contents, benefits, gallery, faq, testimonials, related] = await Promise.all([
    db.select().from(packageHighlights).where(eq(packageHighlights.packageId, row.id)).orderBy(asc(packageHighlights.sortOrder)),
    db.select().from(packageContents).where(eq(packageContents.packageId, row.id)).orderBy(asc(packageContents.sortOrder)),
    db.select().from(packageBenefits).where(eq(packageBenefits.packageId, row.id)).orderBy(asc(packageBenefits.sortOrder)),
    db.select().from(packageGallery).where(eq(packageGallery.packageId, row.id)).orderBy(asc(packageGallery.sortOrder)),
    db.select().from(packageFaq).where(eq(packageFaq.packageId, row.id)).orderBy(asc(packageFaq.sortOrder)),
    db.select().from(packageTestimonials).where(eq(packageTestimonials.packageId, row.id)).orderBy(asc(packageTestimonials.sortOrder)),
    db.select().from(packageRelated).where(eq(packageRelated.packageId, row.id)),
  ])

  let relatedSlugs: string[] = []
  if (related.length > 0) {
    const relatedRows = await db
      .select({ id: packagesTable.id, slug: packagesTable.slug })
      .from(packagesTable)
      .where(inArray(packagesTable.id, related.map((r) => r.relatedPackageId)))
    relatedSlugs = relatedRows.map((r) => r.slug)
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    titleAr: row.titleAr,
    badge: row.badge,
    price: row.price,
    description: row.description,
    descriptionAr: row.descriptionAr,
    shortDescription: row.shortDescription,
    shortDescriptionAr: row.shortDescriptionAr,
    highlights: highlights.map((h) => h.textEn),
    highlightsAr: highlights.map((h) => h.textAr),
    contents: contents.map((c) => c.textEn),
    contentsAr: contents.map((c) => c.textAr),
    benefits: benefits.map((b) => ({ title: b.titleEn, description: b.descriptionEn, icon: b.icon })),
    benefitsAr: benefits.map((b) => ({ title: b.titleAr, description: b.descriptionAr })),
    gallery: gallery.map((g) => g.imageUrl),
    faqItems: faq.map((f) => ({ question: f.questionEn, answer: f.answerEn })),
    faqItemsAr: faq.map((f) => ({ question: f.questionAr, answer: f.answerAr })),
    testimonials: testimonials.map((t) => ({
      name: t.name,
      role: t.role,
      text: t.text,
      rating: t.rating,
      image: t.image ?? undefined,
    })),
    relatedPackages: relatedSlugs,
  }
}

export async function getPackage(slug: string): Promise<Package | null> {
  if (process.env.DATABASE_URL) {
    try {
      const [row] = await db.select().from(packagesTable).where(eq(packagesTable.slug, slug))
      if (row) return hydratePackage(row)
    } catch (err) {
      console.warn('[packages] DB query failed, falling back to content-store:', err)
    }
  }

  const { getFullSiteData } = await import('@/lib/content-store')
  const store = await getFullSiteData()
  const found = store.packages.find((p) => p.slug === slug)
  if (!found) return null

  return {
    id: found.id,
    slug: found.slug,
    title: found.title,
    titleAr: found.titleAr,
    badge: found.badge,
    price: found.price,
    description: found.description,
    descriptionAr: found.descriptionAr,
    shortDescription: found.shortDescription,
    shortDescriptionAr: found.shortDescriptionAr,
    highlights: [],
    highlightsAr: found.highlightsAr,
    contents: [],
    contentsAr: found.contentsAr,
    benefits: [],
    benefitsAr: found.benefitsAr,
    gallery: found.gallery,
    faqItems: [],
    faqItemsAr: found.faqItemsAr,
    testimonials: [],
    relatedPackages: store.packages.filter((p) => p.slug !== slug).map((p) => p.slug),
    image: found.image,
  }
}

export async function getAllPackages(): Promise<Package[]> {
  if (process.env.DATABASE_URL) {
    try {
      const rows = await db.select().from(packagesTable).orderBy(asc(packagesTable.sortOrder))
      if (rows.length > 0) {
        return Promise.all(rows.map(hydratePackage))
      }
    } catch (err) {
      console.warn('[packages] DB query failed, falling back to content-store:', err)
    }
  }

  const { getFullSiteData } = await import('@/lib/content-store')
  const store = await getFullSiteData()
  return store.packages.map((found) => ({
    id: found.id,
    slug: found.slug,
    title: found.title,
    titleAr: found.titleAr,
    badge: found.badge,
    price: found.price,
    description: found.description,
    descriptionAr: found.descriptionAr,
    shortDescription: found.shortDescription,
    shortDescriptionAr: found.shortDescriptionAr,
    highlights: [],
    highlightsAr: found.highlightsAr,
    contents: [],
    contentsAr: found.contentsAr,
    benefits: [],
    benefitsAr: found.benefitsAr,
    gallery: found.gallery,
    faqItems: [],
    faqItemsAr: found.faqItemsAr,
    testimonials: [],
    relatedPackages: store.packages.filter((p) => p.slug !== found.slug).map((p) => p.slug),
    image: found.image,
  }))
}
