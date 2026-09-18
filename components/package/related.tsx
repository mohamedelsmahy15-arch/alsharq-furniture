import { Package, getPackage } from '@/lib/packages'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { waLink } from '@/lib/site'

export async function PackageRelated({ pkg }: { pkg: Package }) {
  const relatedResults = await Promise.all(pkg.relatedPackages.map((slug) => getPackage(slug)))
  const relatedPkgs = relatedResults.filter((p): p is Package => p !== null)

  if (relatedPkgs.length === 0) return null

  return (
    <section className="bg-card py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-12">
          <span className="text-sm font-bold uppercase tracking-widest text-gold">
            باقات أخرى
          </span>
          <h2 className="mt-3 font-heading text-4xl font-extrabold text-card-foreground md:text-5xl">
            قد تعجبك أيضاً
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {relatedPkgs.map((relatedPkg) => (
            <div
              key={relatedPkg.slug}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/2 transition hover:border-gold hover:bg-white/5"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={relatedPkg.gallery[0]}
                  alt={relatedPkg.titleAr}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-bold text-card-foreground">
                  {relatedPkg.titleAr}
                </h3>
                <p className="mt-2 text-sm text-card-foreground/70">
                  {relatedPkg.shortDescriptionAr}
                </p>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-card-foreground/60">من</p>
                    <p className="font-heading text-2xl font-bold text-gold">
                      {relatedPkg.price}
                    </p>
                  </div>
                  <Link
                    href={`/packages/${relatedPkg.slug}`}
                    className="flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 font-medium text-gold transition hover:bg-gold hover:text-gold-foreground"
                  >
                    عرض الباقة
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
