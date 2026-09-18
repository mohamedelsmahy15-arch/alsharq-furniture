import { db } from '@/lib/db'
import {
  productCategories as productCategoriesTable,
  products as productsTable,
  productGallery,
  productSpecs,
  productRelatedCategories,
} from '@/lib/db/schema'
import { asc, eq, inArray } from 'drizzle-orm'
import { siteSettings } from '@/lib/db/schema'

export interface ProductSpec {
  label: string
  value: string
}

export interface Product {
  id: number
  name: string
  image: string
  note?: string | null
  price: number
  originalPrice: number
  inStock: boolean
  longDescription: string
  gallery: string[]
  specs: ProductSpec[]
  categorySlug: string
}

export interface ProductCategory {
  id: number
  slug: string
  name: string
  heroImage: string
  description: string
  products: Product[]
  relatedCategories: string[]
}

async function hydrateProduct(
  row: typeof productsTable.$inferSelect,
  categorySlug: string,
): Promise<Product> {
  const [gallery, specs] = await Promise.all([
    db.select().from(productGallery).where(eq(productGallery.productId, row.id)).orderBy(asc(productGallery.sortOrder)),
    db.select().from(productSpecs).where(eq(productSpecs.productId, row.id)).orderBy(asc(productSpecs.sortOrder)),
  ])

  return {
    id: row.id,
    name: row.name,
    image: row.image,
    note: row.note,
    price: row.price,
    originalPrice: row.originalPrice,
    inStock: row.inStock,
    longDescription: row.longDescription,
    gallery: gallery.map((g) => g.imageUrl),
    specs: specs.map((s) => ({ label: s.label, value: s.value })),
    categorySlug,
  }
}

async function hydrateCategory(row: typeof productCategoriesTable.$inferSelect): Promise<ProductCategory> {
  const [productRows, relatedRows] = await Promise.all([
    db.select().from(productsTable).where(eq(productsTable.categoryId, row.id)).orderBy(asc(productsTable.sortOrder)),
    db.select().from(productRelatedCategories).where(eq(productRelatedCategories.categoryId, row.id)),
  ])

  const products = await Promise.all(productRows.map((p) => hydrateProduct(p, row.slug)))

  let relatedSlugs: string[] = []
  if (relatedRows.length > 0) {
    const relatedCategories = await db
      .select({ id: productCategoriesTable.id, slug: productCategoriesTable.slug })
      .from(productCategoriesTable)
      .where(inArray(productCategoriesTable.id, relatedRows.map((r) => r.relatedCategoryId)))
    relatedSlugs = relatedCategories.map((r) => r.slug)
  }

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    heroImage: row.heroImage,
    description: row.description,
    products,
    relatedCategories: relatedSlugs,
  }
}

export async function getProductCategory(slug: string): Promise<ProductCategory | null> {
  const { getFullSiteData } = await import('@/lib/content-store')
  const store = await getFullSiteData()
  if (store.settings.productsComingSoon === 'true') return null

  if (process.env.DATABASE_URL) {
    try {
      const [row] = await db.select().from(productCategoriesTable).where(eq(productCategoriesTable.slug, slug))
      if (row) return hydrateCategory(row)
    } catch (err) {
      console.warn('[products] DB error in getProductCategory, falling back:', err)
    }
  }

  const cat = store.categories.find((c) => c.slug === slug)
  if (!cat) return null

  const prods = store.products
    .filter((p) => p.categoryId === cat.id)
    .map((p) => ({
      id: p.id,
      name: p.name,
      image: p.image,
      note: p.note,
      price: p.price,
      originalPrice: p.originalPrice,
      inStock: p.inStock,
      longDescription: p.longDescription,
      gallery: p.gallery,
      specs: p.specs,
      categorySlug: cat.slug,
    }))

  return {
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    heroImage: cat.heroImage,
    description: cat.description,
    products: prods,
    relatedCategories: store.categories.filter((c) => c.slug !== slug).map((c) => c.slug),
  }
}

export async function getAllProductCategories(): Promise<ProductCategory[]> {
  const { getFullSiteData } = await import('@/lib/content-store')
  const store = await getFullSiteData()
  if (store.settings.productsComingSoon === 'true') return []

  if (process.env.DATABASE_URL) {
    try {
      const rows = await db.select().from(productCategoriesTable).orderBy(asc(productCategoriesTable.sortOrder))
      if (rows.length > 0) {
        return Promise.all(rows.map(hydrateCategory))
      }
    } catch (err) {
      console.warn('[products] DB error in getAllProductCategories, falling back:', err)
    }
  }

  return store.categories.map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    heroImage: cat.heroImage,
    description: cat.description,
    products: store.products
      .filter((p) => p.categoryId === cat.id)
      .map((p) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        note: p.note,
        price: p.price,
        originalPrice: p.originalPrice,
        inStock: p.inStock,
        longDescription: p.longDescription,
        gallery: p.gallery,
        specs: p.specs,
        categorySlug: cat.slug,
      })),
    relatedCategories: store.categories.filter((c) => c.slug !== cat.slug).map((c) => c.slug),
  }))
}

export async function getProductById(id: number): Promise<Product | null> {
  if (process.env.DATABASE_URL) {
    try {
      const [row] = await db.select().from(productsTable).where(eq(productsTable.id, id))
      if (row) {
        const [category] = await db
          .select({ slug: productCategoriesTable.slug })
          .from(productCategoriesTable)
          .where(eq(productCategoriesTable.id, row.categoryId))
        return hydrateProduct(row, category?.slug ?? '')
      }
    } catch (err) {
      console.warn('[products] DB error in getProductById, falling back:', err)
    }
  }

  const { getFullSiteData } = await import('@/lib/content-store')
  const store = await getFullSiteData()
  const p = store.products.find((prod) => prod.id === id)
  if (!p) return null
  const cat = store.categories.find((c) => c.id === p.categoryId)

  return {
    id: p.id,
    name: p.name,
    image: p.image,
    note: p.note,
    price: p.price,
    originalPrice: p.originalPrice,
    inStock: p.inStock,
    longDescription: p.longDescription,
    gallery: p.gallery,
    specs: p.specs,
    categorySlug: cat?.slug ?? '',
  }
}
