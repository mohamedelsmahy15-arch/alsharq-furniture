'use client'

import Link from 'next/link'
import { Package } from '@/lib/packages'
import { MessageCircle, Share2, ArrowRight } from 'lucide-react'
import { waLink } from '@/lib/site-defaults'

export function PackageHero({ pkg }: { pkg: Package }) {
  const handleShare = async () => {
    const shareData = {
      title: pkg.titleAr,
      text: pkg.descriptionAr,
      url: typeof window !== 'undefined' ? window.location.href : '',
    }
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // المستخدم قفل نافذة المشاركة، مفيش داعي لأي حاجة
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url)
      alert('تم نسخ رابط الباقة')
    }
  }
  return (
    <section className="relative bg-primary pb-12 pt-24 md:py-20 md:pt-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Link
          href="/#offers"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/70 transition-colors hover:text-gold"
        >
          <ArrowRight className="size-4" />
          كل الباقات
        </Link>

        <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              {pkg.badge && (
                <span className="inline-block rounded-full bg-gold px-4 py-2 text-xs font-bold text-gold-foreground">
                  {pkg.badge}
                </span>
              )}
            </div>
            <h1 className="font-heading text-4xl font-extrabold text-primary-foreground md:text-5xl">
              {pkg.titleAr}
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
              {pkg.descriptionAr}
            </p>
          </div>
          <div className="flex gap-3 md:flex-col md:items-end">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-primary-foreground transition hover:bg-white/20"
            >
              <Share2 className="size-4" />
              <span className="text-sm">مشاركة</span>
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:mb-12 md:grid-cols-3">
          {pkg.highlightsAr.slice(0, 3).map((highlight) => (
            <div
              key={highlight}
              className="rounded-lg border border-white/10 bg-white/5 p-4"
            >
              <p className="text-sm font-medium text-primary-foreground">
                ✓ {highlight}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
          <div>
            <p className="text-sm text-primary-foreground/70">السعر من</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="font-heading text-5xl font-extrabold text-gold">
                {pkg.price}
              </span>
              <span className="mb-2 text-xl font-medium text-primary-foreground/70">
                ألف جنيه
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <a
              href={waLink(
                `السلام عليكم، أهتم بـ"${pkg.titleAr}" بقيمة ${pkg.price} ألف. أريد تفاصيل أكثر.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 font-bold text-gold-foreground transition hover:shadow-lg hover:shadow-gold/30"
            >
              <MessageCircle className="size-5" />
              اتصل بنا عبر واتساب
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
