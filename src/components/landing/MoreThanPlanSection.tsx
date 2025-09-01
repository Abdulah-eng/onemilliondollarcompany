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
    </div>
  );
}

export default function MoreThanPlanSection() {
  return (
    <section className="relative pt-20 pb-32 bg-white">
      {/* Connector Gradient - overlaps with Features section */}
      <div className="absolute inset-x-0 top-0 h-[140px] bg-gradient-to-b from-[#BFEDE6]/40 via-[#B2E0D9]/25 to-transparent z-0" />
      {/* Main Section Gradient */}
      <div className="absolute inset-x-0 top-28 h-[320px] bg-gradient-to-b from-[#DDF5F0]/50 via-[#B2E0D9]/20 to-transparent z-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            'lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:mx-0 lg:px-0',
            // ✅ INCREASED PADDING for more shadow room
            'pb-12'
          )}
          data-reveal
        >
          {MORE_THAN_PLAN_CARDS.map((card, index) => (
            <div
              key={card.title}
              className={cn(
                'relative flex-shrink-0 w-[90%] sm:w-80 lg:w-auto',
                'rounded-2xl snap-center overflow-hidden transition-all duration-300 group',
                // ✅ REPLACED with a custom, softer, multi-layered shadow
                // This shadow is larger, more blurred, and uses your primary color for a subtle glow.
                'shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1),_0_20px_50px_-20px_rgba(34,139,121,0.2)]',
                'hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15),_0_25px_60px_-20px_rgba(34,139,121,0.25)] hover:-translate-y-1'
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 transition-all duration-300 group-hover:scale-105">
                 <BlurImage src={card.image} alt={card.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-2xl" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-8 min-h-[400px]">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 text-white">
                    {card.title}
                  </h3>
                  <p className="text-base leading-relaxed mb-4 text-white/80">
                    {card.description}
                  </p>
                  <ul className="space-y-2 border-t border-white/20 pt-4 text-white">
                    {card.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <svg
                          className="w-4 h-4 text-primary flex-shrink-0 mt-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
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
