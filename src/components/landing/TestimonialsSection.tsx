// File: src/components/landing/TestimonialsSection.tsx
import { TESTIMONIALS } from '@/mockdata/landingpage/testimonials';

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="reveal text-center mb-16" data-reveal>
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold">What Clients Are Saying</h2>
          <p className="text-lg sm:text-xl text-muted-foreground">These results are real. So is your potential.</p>
        </div>

        {/* Horizontal scroll on iPad & below; grid on lg+ */}
        <div
          className="
            -mx-4 px-4
            flex gap-4 overflow-x-auto snap-x snap-mandatory
            md:gap-6
            lg:mx-auto lg:px-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible
          "
          role="list"
          aria-label="Client testimonials"
        >
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              role="listitem"
              className="
                reveal p-6 snap-start shrink-0
                min-w-[85%] sm:min-w-[70%] md:min-w-[60%]
                transition-transform md:hover:scale-105
                bg-background rounded-xl
                lg:min-w-0 lg:shrink
              "
              data-reveal
            >
              {/* Avatar + Info */}
              <header className="mb-4 flex items-center">
                <div className="mr-3 text-3xl">{t.avatar}</div>
                <div>
                  <h3 className="font-semibold">{t.name}, {t.age}</h3>
                  <div role="img" aria-label={`${t.rating} out of 5 stars`} className="text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </header>

              {/* Text */}
              <blockquote className="mb-4 italic text-muted-foreground">
                <p>“{t.text}”</p>
              </blockquote>

              {/* Result */}
              <div className="flex items-center text-sm">
                <span className="mr-2">✨</span>
                <span className="font-medium text-primary">{t.result}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
