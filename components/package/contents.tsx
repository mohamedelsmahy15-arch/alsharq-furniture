import { Package } from '@/lib/packages'
import { Check } from 'lucide-react'

export function PackageContents({ pkg }: { pkg: Package }) {
  const midpoint = Math.ceil(pkg.contentsAr.length / 2)
  const column1 = pkg.contentsAr.slice(0, midpoint)
  const column2 = pkg.contentsAr.slice(midpoint)

  return (
    <section className="bg-card py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-12 max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-widest text-gold">
            محتويات الباقة
          </span>
          <h2 className="mt-3 font-heading text-4xl font-extrabold text-card-foreground md:text-5xl">
            ما تحصل عليه
          </h2>
          <p className="mt-4 text-lg text-card-foreground/70">
            كل القطع المختارة بعناية لتكوين منزل الأحلام الخاص بك.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            {column1.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-4 rounded-lg border border-white/5 bg-white/2 p-4 transition hover:bg-white/5"
              >
                <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <Check className="size-4" />
                </div>
                <p className="font-medium text-card-foreground">{item}</p>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {column2.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-4 rounded-lg border border-white/5 bg-white/2 p-4 transition hover:bg-white/5"
              >
                <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <Check className="size-4" />
                </div>
                <p className="font-medium text-card-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
