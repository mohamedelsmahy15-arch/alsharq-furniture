import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { customerReviews, deliveryShowcase } from '@/lib/db/schema'

export async function getHomepageShowcase() {
  if (process.env.DATABASE_URL) {
    try {
      const [reviews, deliveries] = await Promise.all([
        db.select().from(customerReviews).where(eq(customerReviews.showOnSite, true)).orderBy(asc(customerReviews.sortOrder)),
        db.select().from(deliveryShowcase).where(eq(deliveryShowcase.showOnSite, true)).orderBy(asc(deliveryShowcase.sortOrder)),
      ])
      if (reviews.length > 0 || deliveries.length > 0) {
        return { reviews, deliveries }
      }
    } catch (err) {
      console.warn('[reviews] DB query failed, falling back:', err)
    }
  }

  const { getFullSiteData } = await import('@/lib/content-store')
  const store = await getFullSiteData()
  return {
    reviews: store.reviews.filter((r) => r.showOnSite),
    deliveries: store.deliveries.filter((d) => d.showOnSite),
  }
}

export type HomepageShowcase = Awaited<ReturnType<typeof getHomepageShowcase>>
