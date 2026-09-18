// One-time seed script: migrates static data from scripts/seed-data/*-old.ts
// into the Neon database. Run with: npx tsx scripts/seed.ts
import { db, pool } from '../lib/db'
import {
  packages as packagesTable,
  packageHighlights,
  packageContents,
  packageBenefits,
  packageGallery,
  packageFaq,
  packageTestimonials,
  packageRelated,
  productCategories as productCategoriesTable,
  products as productsTable,
  siteSettings,
  optionTags,
} from '../lib/db/schema'
import { packages } from './seed-data/packages-old'
import { productCategories } from './seed-data/products-old'
import { site } from './seed-data/site-old'

async function main() {
  console.log('[seed] Seeding packages...')
  const packageIdBySlug: Record<string, number> = {}

  for (const [index, pkg] of Object.values(packages).entries()) {
    const [row] = await db
      .insert(packagesTable)
      .values({
        slug: pkg.slug,
        title: pkg.title,
        titleAr: pkg.titleAr,
        badge: pkg.badge ?? null,
        price: pkg.price,
        description: pkg.description,
        descriptionAr: pkg.descriptionAr,
        shortDescription: pkg.shortDescription,
        shortDescriptionAr: pkg.shortDescriptionAr,
        sortOrder: index,
      })
      .returning({ id: packagesTable.id })
    packageIdBySlug[pkg.slug] = row.id
  }

  for (const pkg of Object.values(packages)) {
    const packageId = packageIdBySlug[pkg.slug]

    for (const [i, textAr] of pkg.highlightsAr.entries()) {
      await db.insert(packageHighlights).values({
        packageId,
        textEn: pkg.highlights[i] ?? '',
        textAr,
        sortOrder: i,
      })
    }

    for (const [i, textAr] of pkg.contentsAr.entries()) {
      await db.insert(packageContents).values({
        packageId,
        textEn: pkg.contents[i] ?? '',
        textAr,
        sortOrder: i,
      })
    }

    for (const [i, benefitAr] of pkg.benefitsAr.entries()) {
      const benefitEn = pkg.benefits[i]
      await db.insert(packageBenefits).values({
        packageId,
        icon: benefitEn?.icon ?? '✓',
        titleEn: benefitEn?.title ?? '',
        titleAr: benefitAr.title,
        descriptionEn: benefitEn?.description ?? '',
        descriptionAr: benefitAr.description,
        sortOrder: i,
      })
    }

    for (const [i, imageUrl] of pkg.gallery.entries()) {
      await db.insert(packageGallery).values({ packageId, imageUrl, sortOrder: i })
    }

    for (const [i, faqAr] of pkg.faqItemsAr.entries()) {
      const faqEn = pkg.faqItems[i]
      await db.insert(packageFaq).values({
        packageId,
        questionEn: faqEn?.question ?? '',
        questionAr: faqAr.question,
        answerEn: faqEn?.answer ?? '',
        answerAr: faqAr.answer,
        sortOrder: i,
      })
    }

    for (const [i, t] of pkg.testimonials.entries()) {
      await db.insert(packageTestimonials).values({
        packageId,
        name: t.name,
        role: t.role,
        text: t.text,
        rating: t.rating,
        image: t.image ?? null,
        sortOrder: i,
      })
    }
  }

  // Second pass for related packages, now that all package IDs exist
  for (const pkg of Object.values(packages)) {
    const packageId = packageIdBySlug[pkg.slug]
    for (const relatedSlug of pkg.relatedPackages) {
      const relatedPackageId = packageIdBySlug[relatedSlug]
      if (relatedPackageId) {
        await db.insert(packageRelated).values({ packageId, relatedPackageId })
      }
    }
  }

  console.log('[seed] Seeding product categories + products...')
  const categoryIdBySlug: Record<string, number> = {}

  for (const [index, category] of Object.values(productCategories).entries()) {
    const [row] = await db
      .insert(productCategoriesTable)
      .values({
        slug: category.slug,
        name: category.name,
        heroImage: category.heroImage,
        description: category.description,
        sortOrder: index,
      })
      .returning({ id: productCategoriesTable.id })
    categoryIdBySlug[category.slug] = row.id

    for (const [i, product] of category.products.entries()) {
      await db.insert(productsTable).values({
        categoryId: row.id,
        name: product.name,
        image: product.image,
        note: product.note ?? null,
        price: product.price,
        originalPrice: product.originalPrice,
        inStock: product.inStock,
        sortOrder: i,
      })
    }
  }

  console.log('[seed] Seeding site settings...')
  await db.insert(siteSettings).values([
    { key: 'name', value: site.name },
    { key: 'city', value: site.city },
    { key: 'whatsapp', value: site.whatsapp },
    { key: 'phoneDisplay', value: site.phoneDisplay },
    { key: 'address', value: site.address },
    { key: 'hours', value: site.hours },
    { key: 'mapLink', value: site.mapLink },
    { key: 'mapEmbed', value: site.mapEmbed },
  ])

  console.log('[seed] Seeding option tags (notes)...')
  const noteOptions = new Set<string>()
  for (const category of Object.values(productCategories)) {
    for (const product of category.products) {
      if (product.note) noteOptions.add(product.note)
    }
  }
  for (const label of noteOptions) {
    await db.insert(optionTags).values({ group: 'product_note', label })
  }

  console.log('[seed] Done.')
  await pool.end()
}

main().catch((err) => {
  console.error('[seed] Failed:', err)
  process.exit(1)
})
