'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, Star, Quote } from 'lucide-react'

type Testimonial = {
  name: string
  location: string
  quote: string
  poster: string
  videoUrl?: string
}

const testimonials: Testimonial[] = [
  {
    name: 'أحمد و سارة',
    location: 'سموحة، الإسكندرية',
    quote: 'أثثنا بيت العمر بالكامل من المعرض. الخامات ممتازة والتعامل راقٍ جدًا والالتزام في الموعد.',
    poster: '/offer-2.png',
    videoUrl: '',
  },
  {
    name: 'منة الله',
    location: 'العصافرة، الإسكندرية',
    quote: 'غرفة النوم طلعت أحلى من الصور بكتير. شكرًا على الذوق والصبر معايا في الاختيار.',
    poster: '/product-bedroom.png',
    videoUrl: '',
  },
  {
    name: 'محمود فؤاد',
    location: 'المنتزه، الإسكندرية',
    quote: 'الركنة فخمة وعملية والسعر كان أحسن من اللي دورت عليه في أماكن تانية. أنصح بيهم.',
    poster: '/product-corner-sofa.png',
    videoUrl: '',
  },
]

function VideoCard({ t }: { t: Testimonial }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-primary">
        {playing && t.videoUrl ? (
          <video
            src={t.videoUrl}
            controls
            autoPlay
            playsInline
            className="size-full object-cover"
          />
        ) : (
          <>
            <Image
              src={t.poster || '/placeholder.svg'}
              alt={`فيديو تقييم ${t.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/40" />
            <button
              type="button"
              onClick={() => t.videoUrl && setPlaying(true)}
              aria-label={`تشغيل فيديو تقييم ${t.name}`}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="flex size-16 items-center justify-center rounded-full bg-gold text-gold-foreground shadow-lg transition-transform hover:scale-110">
                <Play className="size-7 translate-x-0.5 fill-current" />
              </span>
            </button>
            <div className="absolute bottom-0 right-0 p-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-gold text-gold" />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="p-5">
        <Quote className="size-6 text-gold/40" />
        <p className="mt-2 text-pretty text-sm leading-relaxed text-card-foreground/90">
          {t.quote}
        </p>
        <div className="mt-4 border-t border-border pt-4">
          <p className="font-bold text-card-foreground">{t.name}</p>
          <p className="text-sm text-muted-foreground">{t.location}</p>
        </div>
      </div>
    </div>
  )
}

export function Reviews() {
  return (
    <section id="reviews" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-gold">
            تقييمات حقيقية
          </span>
          <h2 className="mt-3 font-heading text-4xl font-extrabold text-foreground md:text-5xl">
            آراء عملائنا
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            شاهد تجارب عملائنا الحقيقية معنا — ثقتهم هي أغلى ما نملك.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <VideoCard key={t.name} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
