'use server'

import { requireAdminAccess } from '@/lib/admin-access'
import {
  getFullSiteData,
  saveSiteSettings,
  saveAllPackages,
  saveAllProducts,
  saveAllCategories,
  saveAllReviews,
  saveAllDeliveries,
  saveAllFurnitureOptions,
  restoreEntireStore,
  type PackageData,
  type ProductData,
  type CategoryData,
  type ReviewData,
  type DeliveryData,
  type FurnitureOptionData,
  type FullSiteData,
} from '@/lib/content-store'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  await requireAdminAccess()
  return { name: 'مدير الموقع' }
}

// ---------------- Site Settings ----------------
export async function updateSiteSettings(values: Record<string, string>) {
  await requireAdmin()
  await saveSiteSettings(values)
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/packages/[slug]', 'page')
  revalidatePath('/products/[slug]', 'page')
}

// ---------------- Products ----------------
export async function updateProduct(input: {
  id: number
  categoryId: number
  name: string
  price: number
  originalPrice: number
  image: string
  note: string | null
  longDescription: string
  inStock: boolean
  gallery?: string[]
  specs?: { label: string; value: string }[]
}) {
  await requireAdmin()
  const store = await getFullSiteData()
  const idx = store.products.findIndex((p) => p.id === input.id)
  if (idx !== -1) {
    store.products[idx] = {
      ...store.products[idx],
      ...input,
      gallery: input.gallery ?? store.products[idx].gallery,
      specs: input.specs ?? store.products[idx].specs,
    }
  } else {
    store.products.push({
      id: input.id,
      categoryId: input.categoryId,
      name: input.name,
      price: input.price,
      originalPrice: input.originalPrice,
      image: input.image,
      note: input.note,
      longDescription: input.longDescription,
      inStock: input.inStock,
      gallery: input.gallery ?? [input.image],
      specs: input.specs ?? [],
      sortOrder: store.products.length + 1,
    })
  }
  await saveAllProducts(store.products)
  revalidatePath('/admin')
  revalidatePath('/')
  revalidatePath('/products/[slug]', 'page')
}

export async function createProduct(input: {
  categoryId: number
  name: string
  price: number
  originalPrice: number
  image: string
  longDescription: string
  note?: string | null
  inStock?: boolean
  gallery?: string[]
  specs?: { label: string; value: string }[]
}) {
  await requireAdmin()
  const store = await getFullSiteData()
  const nextId = Math.max(0, ...store.products.map((p) => p.id)) + 1
  const newProduct: ProductData = {
    id: nextId,
    categoryId: input.categoryId,
    name: input.name,
    price: input.price,
    originalPrice: input.originalPrice,
    image: input.image,
    note: input.note ?? null,
    inStock: input.inStock ?? true,
    longDescription: input.longDescription,
    gallery: input.gallery?.length ? input.gallery : [input.image],
    specs: input.specs ?? [],
    sortOrder: store.products.length + 1,
  }
  store.products.push(newProduct)
  await saveAllProducts(store.products)
  revalidatePath('/admin')
  revalidatePath('/')
  revalidatePath('/products/[slug]', 'page')
  return newProduct
}

export async function deleteProduct(id: number) {
  await requireAdmin()
  const store = await getFullSiteData()
  store.products = store.products.filter((p) => p.id !== id)
  await saveAllProducts(store.products)
  revalidatePath('/admin')
  revalidatePath('/')
  revalidatePath('/products/[slug]', 'page')
}

// ---------------- Categories ----------------
export async function updateCategory(input: {
  id: number
  slug?: string
  name: string
  heroImage: string
  description: string
}) {
  await requireAdmin()
  const store = await getFullSiteData()
  const idx = store.categories.findIndex((c) => c.id === input.id)
  if (idx !== -1) {
    store.categories[idx] = {
      ...store.categories[idx],
      ...input,
      slug: input.slug || store.categories[idx].slug,
    }
    await saveAllCategories(store.categories)
  }
  revalidatePath('/admin')
  revalidatePath('/')
  revalidatePath('/products/[slug]', 'page')
}

export async function createCategory(input: {
  slug: string
  name: string
  heroImage: string
  description: string
}) {
  await requireAdmin()
  const store = await getFullSiteData()
  const nextId = Math.max(0, ...store.categories.map((c) => c.id)) + 1
  const newCat: CategoryData = {
    id: nextId,
    slug: input.slug || `category-${nextId}`,
    name: input.name,
    heroImage: input.heroImage,
    description: input.description,
    sortOrder: store.categories.length + 1,
  }
  store.categories.push(newCat)
  await saveAllCategories(store.categories)
  revalidatePath('/admin')
  revalidatePath('/')
  revalidatePath('/products/[slug]', 'page')
  return newCat
}

export async function deleteCategory(id: number) {
  await requireAdmin()
  const store = await getFullSiteData()
  store.categories = store.categories.filter((c) => c.id !== id)
  await saveAllCategories(store.categories)
  revalidatePath('/admin')
  revalidatePath('/')
  revalidatePath('/products/[slug]', 'page')
}

// ---------------- Packages & Offers ----------------
export async function savePackage(input: PackageData) {
  await requireAdmin()
  const store = await getFullSiteData()
  const idx = store.packages.findIndex((p) => p.id === input.id || p.slug === input.slug)
  if (idx !== -1) {
    store.packages[idx] = { ...store.packages[idx], ...input }
  } else {
    store.packages.push(input)
  }
  await saveAllPackages(store.packages)
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/packages/[slug]', 'page')
}

export async function deletePackage(id: number) {
  await requireAdmin()
  const store = await getFullSiteData()
  store.packages = store.packages.filter((p) => p.id !== id)
  await saveAllPackages(store.packages)
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/packages/[slug]', 'page')
}

// ---------------- Furniture Configurator Options ----------------
export async function updateFurnitureOption(input: {
  id: number
  categoryId?: number
  name: string
  description: string
  imageUrl: string
  features: string[]
  specs: string[]
  media: string[]
  videoUrl: string
}) {
  await requireAdmin()
  const store = await getFullSiteData()
  const idx = store.furnitureOptions.findIndex((o) => o.id === input.id)
  if (idx !== -1) {
    store.furnitureOptions[idx] = {
      ...store.furnitureOptions[idx],
      ...input,
    }
  } else {
    store.furnitureOptions.push({
      id: input.id,
      categoryId: input.categoryId ?? 1,
      name: input.name,
      description: input.description,
      imageUrl: input.imageUrl,
      features: input.features,
      specs: input.specs,
      media: input.media,
      videoUrl: input.videoUrl,
      sortOrder: store.furnitureOptions.length + 1,
    })
  }
  await saveAllFurnitureOptions(store.furnitureOptions)
  revalidatePath('/admin')
  revalidatePath('/packages/[slug]', 'page')
}

export async function deleteFurnitureOption(id: number) {
  await requireAdmin()
  const store = await getFullSiteData()
  store.furnitureOptions = store.furnitureOptions.filter((o) => o.id !== id)
  await saveAllFurnitureOptions(store.furnitureOptions)
  revalidatePath('/admin')
  revalidatePath('/packages/[slug]', 'page')
}

// ---------------- Reviews ----------------
export async function createReview(input: {
  customerName: string
  location: string
  quote: string
  rating: number
  poster: string
  videoUrl: string
}) {
  await requireAdmin()
  const store = await getFullSiteData()
  const nextId = Math.max(0, ...store.reviews.map((r) => r.id)) + 1
  const newRev: ReviewData = {
    id: nextId,
    ...input,
    showOnSite: true,
    sortOrder: store.reviews.length + 1,
  }
  store.reviews.push(newRev)
  await saveAllReviews(store.reviews)
  revalidatePath('/')
  revalidatePath('/admin')
  return newRev
}

export async function updateReview(input: {
  id: number
  customerName: string
  location: string
  quote: string
  rating: number
  poster: string
  videoUrl: string
}) {
  await requireAdmin()
  const store = await getFullSiteData()
  const idx = store.reviews.findIndex((r) => r.id === input.id)
  if (idx !== -1) {
    store.reviews[idx] = { ...store.reviews[idx], ...input }
    await saveAllReviews(store.reviews)
  }
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function deleteReview(id: number) {
  await requireAdmin()
  const store = await getFullSiteData()
  store.reviews = store.reviews.filter((r) => r.id !== id)
  await saveAllReviews(store.reviews)
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function updateReviewVisibility(id: number, showOnSite: boolean) {
  await requireAdmin()
  const store = await getFullSiteData()
  const idx = store.reviews.findIndex((r) => r.id === id)
  if (idx !== -1) {
    store.reviews[idx].showOnSite = showOnSite
    await saveAllReviews(store.reviews)
  }
  revalidatePath('/')
  revalidatePath('/admin')
}

// ---------------- Deliveries ----------------
export async function createDelivery(input: {
  title: string
  description: string
  imageUrl: string
  packageName: string
  videoUrl?: string
}) {
  await requireAdmin()
  const store = await getFullSiteData()
  const nextId = Math.max(0, ...store.deliveries.map((d) => d.id)) + 1
  const newDel: DeliveryData = {
    id: nextId,
    title: input.title,
    description: input.description,
    imageUrl: input.imageUrl,
    videoUrl: input.videoUrl ?? '',
    packageName: input.packageName,
    showOnSite: true,
    sortOrder: store.deliveries.length + 1,
  }
  store.deliveries.push(newDel)
  await saveAllDeliveries(store.deliveries)
  revalidatePath('/')
  revalidatePath('/admin')
  return newDel
}

export async function updateDelivery(input: {
  id: number
  title: string
  description: string
  imageUrl: string
  videoUrl: string
  packageName: string
}) {
  await requireAdmin()
  const store = await getFullSiteData()
  const idx = store.deliveries.findIndex((d) => d.id === input.id)
  if (idx !== -1) {
    store.deliveries[idx] = { ...store.deliveries[idx], ...input }
    await saveAllDeliveries(store.deliveries)
  }
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function deleteDelivery(id: number) {
  await requireAdmin()
  const store = await getFullSiteData()
  store.deliveries = store.deliveries.filter((d) => d.id !== id)
  await saveAllDeliveries(store.deliveries)
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function updateDeliveryVisibility(id: number, showOnSite: boolean) {
  await requireAdmin()
  const store = await getFullSiteData()
  const idx = store.deliveries.findIndex((d) => d.id === id)
  if (idx !== -1) {
    store.deliveries[idx].showOnSite = showOnSite
    await saveAllDeliveries(store.deliveries)
  }
  revalidatePath('/')
  revalidatePath('/admin')
}

// ---------------- Backup & Restore ----------------
export async function exportSiteData(): Promise<string> {
  await requireAdmin()
  const store = await getFullSiteData()
  return JSON.stringify(store, null, 2)
}

export async function importSiteData(jsonString: string): Promise<{ success: boolean; message: string }> {
  await requireAdmin()
  try {
    const parsed = JSON.parse(jsonString) as FullSiteData
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'ملف البيانات غير صالح' }
    }
    await restoreEntireStore(parsed)
    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/packages/[slug]', 'page')
    revalidatePath('/products/[slug]', 'page')
    return { success: true, message: 'تم استرجاع ومزامنة البيانات بنجاح' }
  } catch (err: any) {
    return { success: false, message: 'فشل استيراد الملف: ' + (err?.message || 'خطأ غير معروف') }
  }
}
