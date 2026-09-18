import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getAllProductCategories } from '@/lib/products'
import { cn } from '@/lib/utils'
import type { SiteSettingsMap } from '@/lib/content-store'

export async function Products({ settings = {} as Partial<SiteSettingsMap> }: { settings?: Partial<SiteSettingsMap> }) {
  const categories = await getAllProductCategories()

  const badge = settings.productsSectionBadge || 'تشكيلتنا'
  const title = settings.productsSectionTitle || 'منتجاتنا'
  const desc =
    settings.productsSectionDesc || 'كل ما يحتاجه بيتك من قطع أثاث فاخرة بأفضل الخامات وأدق التفاصيل.'

  return (
    <section id="products" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-gold">{badge}</span>
          <h2 className="mt-3 font-heading text-4xl font-extrabold text-foreground md:text-5xl">{title}</h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">{desc}</p>
        </div>

        <div className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:auto-rows-[260px]">
          {categories.map((cat, idx) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              className={cn(
                'group relative overflow-hidden rounded-2xl',
                idx === 0 ? 'md:col-span-2 md:row-span-2' : '',
              )}
            >
              <Image
                src={cat.heroImage || '/placeholder.svg'}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent transition-opacity group-hover:from-primary" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
                <h3 className="font-heading text-2xl font-bold text-primary-foreground md:text-3xl">
                  {cat.name}
                </h3>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold text-gold-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowLeft className="size-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
