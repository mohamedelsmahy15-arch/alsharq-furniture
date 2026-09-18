'use client'

import { Package } from '@/lib/packages'
import Image from 'next/image'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export function PackageGallery({ pkg }: { pkg: Package }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  const goNext = () => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % pkg.gallery.length)
    }
  }

  const goPrev = () => {
    if (selectedIdx !== null) {
      setSelectedIdx(
        (selectedIdx - 1 + pkg.gallery.length) % pkg.gallery.length,
      )
    }
  }

  return (
    <>
      <section className="bg-card py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-12">
            <span className="text-sm font-bold uppercase tracking-widest text-gold">
              معرض الصور
            </span>
            <h2 className="mt-3 font-heading text-4xl font-extrabold text-card-foreground md:text-5xl">
              اكتشف التفاصيل
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {pkg.gallery.map((image, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 transition hover:border-gold/50"
              >
                <Image
                  src={image}
                  alt={`صورة ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <button
            onClick={() => setSelectedIdx(null)}
            className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="size-6" />
          </button>

          <button
            onClick={goPrev}
            className="absolute left-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronLeft className="size-6" />
          </button>

          <div className="relative aspect-[4/3] max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-2xl">
            <Image
              src={pkg.gallery[selectedIdx]}
              alt="صورة مكبرة"
              fill
              sizes="90vw"
              className="object-cover"
              priority
            />
          </div>

          <button
            onClick={goNext}
            className="absolute right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronRight className="size-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
            {selectedIdx + 1} / {pkg.gallery.length}
          </div>
        </div>
      )}
    </>
  )
}
