'use client'

import { Package } from '@/lib/packages'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function PackageFAQ({ pkg }: { pkg: Package }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section className="bg-card py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <div className="mb-12 max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-widest text-gold">
            أسئلة شائعة
          </span>
          <h2 className="mt-3 font-heading text-4xl font-extrabold text-card-foreground md:text-5xl">
            أجوبة على أسئلتك
          </h2>
        </div>

        <div className="space-y-4">
          {pkg.faqItemsAr.map((item, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/2 transition hover:border-gold/30"
            >
              {idx !== 2 ? (
                <>
                  <button
                    onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left font-medium text-card-foreground md:p-6"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`size-5 shrink-0 transition-transform ${
                        openIdx === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openIdx === idx && (
                    <div className="border-t border-white/5 bg-white/2 px-5 py-4 text-card-foreground/80 md:px-6 md:py-5">
                      {item.answer}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex w-full items-center justify-between gap-4 p-5 text-left font-medium text-card-foreground md:p-6">
                    <span>{item.question}</span>
                  </div>
                  <div className="border-t border-white/5 bg-white/2 px-5 py-4 text-card-foreground/80 md:px-6 md:py-5">
                    {item.answer}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
