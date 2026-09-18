import { db } from '@/lib/db'
import { furnitureOptions, packageFurnitureCategories } from '@/lib/db/schema'
import { asc, eq } from 'drizzle-orm'

export type FurnitureOption = {
  id: number
  categoryId: number
  name: string
  description: string
  imageUrl: string
  features: string[]
  specs: string[]
  media: string[]
  videoUrl: string
}

export type FurnitureCategory = {
  id: number
  slug: string
  name: string
  description: string
  options: FurnitureOption[]
}

const catalogImages: Record<string, string[]> = {
  bedroom: ['/packages/foundation/1-bedroom.png', '/packages/complete-home/1-grand-bedroom.png', '/packages/complete-home/5-guest-bedroom.png'],
  'kids-room': ['/packages/foundation/2-kids-room.png', '/packages/complete-home/4-kids-luxury.png', '/packages/foundation/7-kids-corner.png'],
  dining: ['/packages/foundation/3-dining.png', '/packages/complete-home/3-royal-dining.png', '/packages/foundation/8-dining-detail.png'],
  living: ['/packages/comfort/3-living-full.png', '/packages/complete-home/2-grand-living.png', '/packages/comfort/7-complete-view.png'],
  corner: ['/packages/comfort/2-corner-sofa.png', '/packages/complete-home/8-lounge-seating.png', '/packages/comfort/4-sofa-detail.png'],
}

function parseList(value: string) {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

export async function getPackageFurniture(packageId: number): Promise<FurnitureCategory[]> {
  if (process.env.DATABASE_URL) {
    try {
      const categories = await db.select().from(packageFurnitureCategories).where(eq(packageFurnitureCategories.packageId, packageId)).orderBy(asc(packageFurnitureCategories.sortOrder))
      if (categories.length > 0) {
        const allOptions = await Promise.all(categories.map((category) => db.select().from(furnitureOptions).where(eq(furnitureOptions.categoryId, category.id)).orderBy(asc(furnitureOptions.sortOrder))))
        return categories.map((category, index) => ({
          id: category.id,
          slug: category.slug,
          name: category.name,
          description: category.description,
          options: allOptions[index].map((option) => ({
            id: option.id,
            categoryId: option.categoryId,
            name: option.name,
            description: option.description,
            imageUrl: option.imageUrl || catalogImages[category.slug]?.[option.sortOrder - 1] || '',
            features: parseList(option.features),
            specs: parseList(option.specs),
            media: parseList(option.media).length ? parseList(option.media) : (catalogImages[category.slug] ?? []).filter((image) => image !== (option.imageUrl || catalogImages[category.slug]?.[option.sortOrder - 1])),
            videoUrl: option.videoUrl,
          })),
        }))
      }
    } catch (err) {
      console.warn('[furniture] DB error in getPackageFurniture, falling back:', err)
    }
  }

  const { getFullSiteData } = await import('@/lib/content-store')
  const store = await getFullSiteData()
  return [
    {
      id: 1,
      slug: 'bedroom',
      name: 'غرفة النوم الرئيسية',
      description: 'اختر تصميم ولون غرفة النوم التي تفضلها',
      options: store.furnitureOptions.filter((f) => f.categorySlug === 'bedroom' || f.categoryId === 1).map((f) => ({
        id: f.id,
        categoryId: f.categoryId,
        name: f.name,
        description: f.description,
        imageUrl: f.imageUrl,
        features: f.features,
        specs: f.specs,
        media: f.media,
        videoUrl: f.videoUrl,
      })),
    },
    {
      id: 2,
      slug: 'kids-room',
      name: 'غرفة الأطفال والشباب',
      description: 'تصاميم مرحة وأنيقة لغرف الأطفال',
      options: store.furnitureOptions.filter((f) => f.categorySlug === 'kids-room' || f.categoryId === 2).map((f) => ({
        id: f.id,
        categoryId: f.categoryId,
        name: f.name,
        description: f.description,
        imageUrl: f.imageUrl,
        features: f.features,
        specs: f.specs,
        media: f.media,
        videoUrl: f.videoUrl,
      })),
    },
    {
      id: 3,
      slug: 'dining',
      name: 'غرفة السفرة',
      description: 'طاولات طعام فاخرة وكراسي مريحة',
      options: store.furnitureOptions.filter((f) => f.categorySlug === 'dining' || f.categoryId === 3).map((f) => ({
        id: f.id,
        categoryId: f.categoryId,
        name: f.name,
        description: f.description,
        imageUrl: f.imageUrl,
        features: f.features,
        specs: f.specs,
        media: f.media,
        videoUrl: f.videoUrl,
      })),
    },
  ]
}
