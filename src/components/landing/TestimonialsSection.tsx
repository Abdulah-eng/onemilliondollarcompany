// File: src/components/landing/TestimonialsSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import { TESTIMONIALS } from '@/mockdata/landingpage/testimonials';

export default function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pauseRef = useRef(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // Horizontal only
    el.style.overflowY = 'hidden';

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) return; // respect user preference

    let timer: number | undefined;

    const start = () => {
      if (timer) window.clearInterval(timer);
      timer = window.setInterval(() => {
        if (pauseRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = el;
        const atEnd = scrollLeft + clientWidth >= scrollWidth - 2;
        if (atEnd) {
          // jump back to start smoothly
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // advance roughly one card (80% of viewport width looks good)
          const step = Math.max(clientWidth * 0.8, 280);
          el.scrollBy({ left: step, behavior: 'smooth' });
        }
      }, 3500);
    };

    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = undefined;
    };

    // pause on hover/touch/keyboard focus
    const pause = () => (pauseRef.current = true);
    const resume = () => (pauseRef.current = false);

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume, { passive: true });
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', resume);

    start();
    return () => {
      stop();
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
      el.removeEventListener('focusin', pause);
      el.removeEventListener('focusout', resume);
    };
  }, []);

  return (
    <section
      id="testimonials"
      aria-label="Client testimonials"
      className="py-20 bg-muted/30 overflow-hidden" // hard-stop any vertical overflow
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="mb-3 text-3xl sm:text-4xl lg:text-5xl font-bold">
            What Clients Are Saying
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            These results are real. So is your potential.
          </p>
        </div>

        {/* Always horizontal: snap carousel, no vertical scroll */}
        <div
          ref={trackRef}
          className="
            -mx-4 px-4
            flex items-stretch gap-4 overflow-x-auto overflow-y-hidden
            snap-x snap-mandatory scroll-p-4
            md:gap-6
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          "
          role="list"
        >
          {TESTIMONIALS.map((t, idx) => (
            <article
              key={`${t.name}-${idx}`}
              role="listitem"
              tabIndex={0}
              className="
                p-6 snap-center shrink-0
                min-w-[90%] sm:min-w-[70%] md:min-w-[55%] lg:min-w-[40%] xl:min-w-[33%]
                bg-background rounded-xl shadow
                flex flex-col justify-between
                transition-transform duration-300 hover:scale-[1.02]
                focus:outline-none focus:ring-2 focus:ring-primary
              "
            >
              {/* Avatar + Info */}
              <header className="mb-4 flex items-center">
                <div className="mr-3 text-3xl">{t.avatar}</div>
                <div>
                  <h3 className="font-semibold">
                    {t.name}, {t.age}
                  </h3>
                  <div
                    role="img"
                    aria-label={`${t.rating} out of 5 stars`}
                    className="text-sm"
                  >
                    {'⭐'.repeat(t.rating || 5)}
                  </div>
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
