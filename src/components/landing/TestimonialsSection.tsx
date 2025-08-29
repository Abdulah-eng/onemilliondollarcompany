'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { TESTIMONIALS } from '@/mockdata/landingpage/testimonials';

export default function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pauseRef = useRef(false);

  // The auto-scroll logic remains the same, as it's robust enough
  // to handle the new grid layout.
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
      className="bg-background dark:bg-black py-20 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16" data-reveal>
          <p className="text-primary font-semibold mb-2">Testimonials</p>
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-foreground">
            Real Stories, Real Results
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Find out how our members have transformed their lives with our holistic approach.
          </p>
        </div>

        {/* Masonry-style auto-scrolling grid */}
        <div
          ref={trackRef}
          role="list"
          className="
            h-[500px] grid grid-rows-2 grid-flow-col gap-6
            auto-cols-[calc(100%-2rem)] sm:auto-cols-[380px] md:auto-cols-[420px]
            overflow-x-auto overflow-y-hidden snap-x snap-mandatory
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-px-4
          "
        >
          {TESTIMONIALS.map((t, idx) => (
            <article
              data-card
              key={`${t.name}-${idx}`}
              role="listitem"
              tabIndex={0}
              className={cn(
                'snap-center shrink-0 p-8 rounded-3xl shadow-lg flex flex-col',
                t.size === 'large' ? 'row-span-2' : 'row-span-1',
                t.dark
                  ? 'bg-foreground text-background'
                  : 'bg-card text-foreground border'
              )}
            >
              {t.highlight && (
                <div className="mb-4">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
                    {t.highlight}
                  </h3>
                </div>
              )}

              <blockquote className="flex-grow space-y-4">
                <p
                  className={cn(
                    'text-5xl leading-none',
                    t.dark ? 'text-background/50' : 'text-muted-foreground/50'
                  )}
                >
                  “
                </p>
                <p
                  className={cn(
                    'text-base leading-relaxed',
                    t.dark ? 'text-background/80' : 'text-muted-foreground'
                  )}
                >
                  {t.quote}
                </p>
              </blockquote>

              <footer className="mt-8 flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{t.name}</h4>
                  <p
                    className={cn(
                      'text-sm',
                      t.dark ? 'text-background/60' : 'text-muted-foreground'
                    )}
                  >
                    {t.title}
                  </p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
