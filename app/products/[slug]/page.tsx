import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MessageCircle, CheckCircle2, XCircle, Tag } from 'lucide-react'
import { getProductCategory, getAllProductCategories } from '@/lib/products'
import { WhatsAppTriggerButton } from '@/components/whatsapp-trigger-button'

function formatPrice(n: number) {
  return n.toLocaleString('ar-EG') + ' جنيه'
}

function savingsPercent(price: number, original: number) {
  return Math.round(((original - price) / original) * 100)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = await getProductCategory(slug)

  if (!category) {
    return { title: 'التصنيف غير موجود' }
  }

  return {
    title: `${category.name} | الشرق الأوسط للأثاث`,
    description: category.description,
  }
}

export default async function ProductCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = await getProductCategory(slug)

  if (!category) {
    notFound()
  }

  const relatedResults = await Promise.all(
    category.relatedCategories.map((s) => getProductCategory(s)),
  )
  const related = relatedResults.filter((c): c is NonNullable<typeof c> => Boolean(c))

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative flex min-h-[45vh] items-end bg-primary pb-12 pt-28">
        <Image
          src={category.heroImage || '/placeholder.svg'}
          alt={category.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/30" />
        <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8">
          <Link
            href="/#products"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/70 transition-colors hover:text-gold"
          >
            <ArrowRight className="size-4" />
            كل التصنيفات
          </Link>
          <h1 className="font-heading text-4xl font-extrabold text-primary-foreground md:text-5xl">
            {category.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">
            {category.description}
          </p>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.products.map((product) => {
              const saving = savingsPercent(product.price, product.originalPrice)
              const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://v0.dev'
              const waMsg = `السلام عليكم، شفت "${product.name}" من تصنيف ${category.name} وعجبني.\n\nالسعر المعلن: ${formatPrice(product.price)}\n\nحابب أحجز أو أعرف التفاصيل:\n${baseUrl}${product.image}`
              return (
                <div
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-gold hover:shadow-lg hover:shadow-gold/10"
                >
                  {/* صورة المنتج */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* شارة التوفير */}
                    <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow">
                      <Tag className="size-3" />
                      وفّر {saving}%
                    </span>
                    {/* شارة الملاحظة */}
                    {product.note && (
                      <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground">
                        {product.note}
                      </span>
                    )}
                    {/* طبقة نفذت */}
                    {!product.inStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/70 backdrop-blur-[2px]">
                        <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20">
                          نفذت الكمية
                        </span>
                      </div>
                    )}
                  </div>

                  {/* تفاصيل المنتج */}
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-heading text-lg font-bold text-card-foreground">
                      {product.name}
                    </h3>

                    {/* حالة التوفر */}
                    <div className="mt-2 flex items-center gap-1.5">
                      {product.inStock ? (
                        <>
                          <CheckCircle2 className="size-4 text-emerald-500" />
                          <span className="text-xs font-medium text-emerald-600">متوفر الآن</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="size-4 text-red-400" />
                          <span className="text-xs font-medium text-red-400">نفذت الكمية</span>
                        </>
                      )}
                    </div>

                    {/* الأسعار */}
                    <div className="mt-3 flex items-end gap-2">
                      <span className="font-heading text-2xl font-extrabold text-gold">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="text-xs font-bold text-red-500">
                        وفّرت {formatPrice(product.originalPrice - product.price)}
                      </span>
                    </div>

                    {/* زر احجز الآن */}
                    <WhatsAppTriggerButton
                      fallbackMessage={waMsg}
                      disabled={!product.inStock}
                      className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition-all ${
                        product.inStock
                          ? 'bg-gold text-gold-foreground hover:scale-105 hover:shadow-md hover:shadow-gold/30'
                          : 'cursor-not-allowed bg-muted text-muted-foreground opacity-60'
                      }`}
                    >
                      <MessageCircle className="size-4" />
                      {product.inStock ? 'احجز الآن' : 'نفذت الكمية'}
                    </WhatsAppTriggerButton>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Related categories */}
      {related.length > 0 && (
        <section className="border-t border-border bg-card py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 className="mb-8 font-heading text-2xl font-extrabold text-card-foreground md:text-3xl">
              تصنيفات هتعجبك كمان
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {related.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products/${cat.slug}`}
                  className="group relative h-48 overflow-hidden rounded-2xl"
                >
                  <Image
                    src={cat.heroImage || '/placeholder.svg'}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-heading text-xl font-bold text-primary-foreground">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-16 text-center md:py-20">
        <p className="text-lg text-muted-foreground">
          مش لاقي اللي بتدور عليه بالظبط؟
        </p>
        <WhatsAppTriggerButton
          fallbackMessage={`السلام عليكم، أنا مهتم بتصنيف ${category.name}، عايز أعرف كل الموديلات المتاحة.`}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-bold text-gold-foreground transition-transform hover:scale-105"
        >
          <MessageCircle className="size-5" />
          اسأل عن كل موديلات {category.name}
        </WhatsAppTriggerButton>
      </section>
    </main>
  )
}

export async function generateStaticParams() {
  const categories = await getAllProductCategories()
  return categories.map((c) => ({ slug: c.slug }))
}
