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

    el.style.overflowY = 'hidden';

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduceMotion) return;

    let timer: number | undefined;

    const stepOnce = () => {
      const card = el.querySelector<HTMLElement>('[data-card]');
      if (!card) return;
      const cardWidth = card.getBoundingClientRect().width;
      const gap = parseInt(getComputedStyle(el).gap || '16', 10) || 16;

      const { scrollLeft, scrollWidth, clientWidth } = el;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 2;
      if (atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
      else el.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => {
        if (!pauseRef.current) stepOnce();
      }, 3500);
    };
    const stop = () => {
      if (timer) window.clearInterval(timer);
    };

    const pause = () => (pauseRef.current = true);
    const resume = () => (pauseRef.current = false);

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume, { passive: true });
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', resume);

    const onResize = () => {
      pause();
      setTimeout(resume, 200);
    };
    window.addEventListener('resize', onResize, { passive: true });

    start();
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
      className="bg-muted/30 py-12 sm:py-16 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="mb-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            What Clients Are Saying
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            These results are real. So is your potential.
          </p>
        </div>

        {/* Track — NO horizontal padding. Use scroll padding instead. */}
        <div
          ref={trackRef}
          role="list"
          className="
            w-full flex items-stretch gap-4 md:gap-6
            overflow-x-auto overflow-y-hidden
            snap-x snap-mandatory
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            scroll-px-4
          "
        >
          {TESTIMONIALS.map((t, idx) => (
            <article
              data-card
              key={`${t.name}-${idx}`}
              role="listitem"
              tabIndex={0}
              className="
                snap-center shrink-0
                w-[calc(100vw-2rem)] xs:w-[calc(100vw-2rem)]
                sm:w-[calc(100vw-3rem)] md:w-[calc(100vw-4rem)]
                lg:w-[min(560px,calc(100vw-6rem))] xl:w-[640px]
                bg-card rounded-2xl shadow
                p-6 sm:p-7 md:p-8
                flex flex-col justify-between
                transition-transform duration-300 hover:scale-[1.02]
                focus:outline-none focus:ring-2 focus:ring-primary
              "
            >
              <header className="mb-4 flex items-center">
                <div className="mr-3 text-3xl">{t.avatar}</div>
                <div>
                  <h3 className="font-semibold text-foreground">{t.name}, {t.age}</h3>
                  <div role="img" aria-label={`${t.rating} out of 5 stars`} className="text-sm text-primary">
                    {'⭐'.repeat(t.rating || 5)}
                  </div>
                </div>
              </header>

              <blockquote className="my-2 sm:my-3 italic text-muted-foreground leading-relaxed">
                <p className="whitespace-normal break-words hyphens-auto">
                  “{t.text}”
                </p>
              </blockquote>

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
