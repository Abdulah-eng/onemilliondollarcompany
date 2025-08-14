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

    // lock vertical overflow in the track only
    el.style.overflowY = 'hidden';

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    if (reduceMotion) return;

    let timer: number | undefined;

    const stepOnce = () => {
      if (!el) return;
      const firstCard = el.querySelector<HTMLElement>('[data-card]');
      if (!firstCard) return;

      const cardWidth = firstCard.getBoundingClientRect().width;
      const gap = parseInt(getComputedStyle(el).columnGap || getComputedStyle(el).gap || '16', 10) || 16;

      const { scrollLeft, scrollWidth, clientWidth } = el;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 2;

      if (atEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
      }
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => {
        if (!pauseRef.current) stepOnce();
      }, 3500);
    };

    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = undefined;
    };

    // pause on interactions
    const pause = () => (pauseRef.current = true);
    const resume = () => (pauseRef.current = false);

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume, { passive: true });
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', resume);

    start();

    // restart on resize to re-measure card width
    const onResize = () => {
      pause();
      setTimeout(() => {
        resume();
      }, 200);
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      stop();
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
      el.removeEventListener('focusin', pause);
      el.removeEventListener('focusout', resume);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section
      id="testimonials"
      aria-label="Client testimonials"
      /* Responsive min-height so the tallest card fits on iPad & phones */
      className="
        bg-muted/30
        py-12 sm:py-16
        min-h-[480px] sm:min-h-[520px] md:min-h-[560px]
      "
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="mb-3 text-3xl sm:text-4xl lg:text-5xl font-bold">
            What Clients Are Saying
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            These results are real. So is your potential.
          </p>
        </div>

        {/* Always horizontal: snap carousel, no vertical scroll inside */}
        <div
          ref={trackRef}
          className="
            -mx-4 px-4
            flex items-stretch gap-4 md:gap-6
            overflow-x-auto overflow-y-hidden
            snap-x snap-mandatory scroll-px-4
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          "
          role="list"
        >
          {TESTIMONIALS.map((t, idx) => (
            <article
              data-card
              key={`${t.name}-${idx}`}
              role="listitem"
              tabIndex={0}
              /* Each card grows to the section's available height */
              className="
                snap-center shrink-0
                min-w-[92%] xs:min-w-[85%] sm:min-w-[72%] md:min-w-[58%] lg:min-w-[44%] xl:min-w-[36%]
                h-full
                bg-background rounded-2xl shadow
                p-6 sm:p-7 md:p-8
                flex flex-col justify-between
                transition-transform duration-300 hover:scale-[1.02]
                focus:outline-none focus:ring-2 focus:ring-primary
              "
            >
              {/* Top */}
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

              {/* Quote */}
              <blockquote className="my-2 sm:my-3 italic text-muted-foreground leading-relaxed">
                <p>“{t.text}”</p>
              </blockquote>

              {/* Bottom */}
              <div className="mt-4 flex items-center text-sm">
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
