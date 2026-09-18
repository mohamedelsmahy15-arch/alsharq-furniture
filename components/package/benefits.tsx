import { Package } from '@/lib/packages'

export function PackageBenefits({ pkg }: { pkg: Package }) {
  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-12 max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-widest text-gold">
            لماذا هذه الباقة
          </span>
          <h2 className="mt-3 font-heading text-4xl font-extrabold text-primary-foreground md:text-5xl">
            مميزات حصرية
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pkg.benefitsAr.map((benefit, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-gold/50 hover:bg-white/10"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-gold/15 text-2xl group-hover:bg-gold/25">
                ✓
              </div>
              <h3 className="font-heading text-lg font-bold text-primary-foreground">
                {benefit.title}
              </h3>
              <p className="mt-3 text-sm text-primary-foreground/70">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
