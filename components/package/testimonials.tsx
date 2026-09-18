import { Package } from '@/lib/packages'
import { Star } from 'lucide-react'

export function PackageTestimonials({ pkg }: { pkg: Package }) {
  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-12 max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-widest text-gold">
            آراء العملاء
          </span>
          <h2 className="mt-3 font-heading text-4xl font-extrabold text-primary-foreground md:text-5xl">
            ماذا يقول العملاء
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pkg.testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-gold/50 hover:bg-white/10"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-gold text-gold"
                  />
                ))}
              </div>
              <p className="mb-4 text-base font-medium leading-relaxed text-primary-foreground">
                "{testimonial.text}"
              </p>
              <div>
                <p className="font-bold text-primary-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-primary-foreground/70">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
