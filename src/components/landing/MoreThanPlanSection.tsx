import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MORE_THAN_PLAN_CARDS } from '@/mockdata/landingpage/morethanplan';

function BlurImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="absolute inset-0">
      {!loaded && <div className="w-full h-full bg-gray-200 animate-pulse rounded-2xl" />}
      <img
        src={src}
        alt={alt}
        className={cn(
          'w-full h-full object-cover rounded-2xl transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
      {/* Light overlay */}
      <div className="absolute inset-0 bg-black/20 rounded-2xl" />
    </div>
  );
}

export default function MoreThanPlanSection() {
  return (
    <section className="relative pt-20 pb-32 bg-gradient-to-b from-[#DDF5F0]/70 via-[#B2E0D9]/50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-16 items-center"
          data-reveal
        >
          <div>
            <p className="mb-2 font-semibold text-primary">Everything You Need</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-foreground">
              More Than Just a Plan
            </h2>
          </div>
          <div>
            <p className="text-lg text-muted-foreground">
              Go beyond workouts. Learn, connect, reflect, and track your full
              wellness journey with tools designed to support lasting change.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div
          className={cn(
            'flex gap-6 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 scroll-px-4',
            'lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:mx-0 lg:px-0'
          )}
          data-reveal
        >
          {MORE_THAN_PLAN_CARDS.map((card, index) => (
            <div
              key={card.title}
              className={cn(
                'relative flex-shrink-0 w-[90%] sm:w-80 lg:w-auto',
                'rounded-2xl shadow-lg snap-center overflow-hidden',
                'bg-white/90 backdrop-blur-sm'
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Background image with overlay */}
              <BlurImage src={card.image} alt={card.title} />

              {/* Content */}
              <div className="relative z-10 p-6 sm:p-8 text-foreground">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                  {card.title}
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground mb-4">
                  {card.description}
                </p>
                <ul className="space-y-2 border-t border-border pt-4">
                  {card.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <svg
                        className="w-4 h-4 text-primary flex-shrink-0 mt-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <p
          className="mt-8 text-center text-sm text-muted-foreground"
          data-reveal
        >
          *Access to features like Coach Feedback and advanced tracking is
          available on our Premium plan.
        </p>
      </div>
    </section>
  );
}
