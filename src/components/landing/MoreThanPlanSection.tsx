import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MORE_THAN_PLAN_CARDS } from '@/mockdata/landingpage/morethanplan';

function BlurImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="absolute inset-0">
      {!loaded && (
        <div className="w-full h-full bg-gray-200 animate-pulse rounded-2xl" />
      )}
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
    <section className="relative pt-20 pb-28 bg-gradient-to-b from-[#BFEDE6]/40 via-[#DDF5F0]/35 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-14 items-center"
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
            'flex gap-2 overflow-x-auto snap-x snap-mandatory -mx-2 px-2 scroll-px-2',
            'lg:grid lg:grid-cols-4 lg:gap-2 lg:overflow-visible lg:mx-0 lg:px-0',
            'pb-8'
          )}
          data-reveal
        >
          {MORE_THAN_PLAN_CARDS.map((card, index) => (
            <div
              key={card.title}
              className={cn(
                'relative flex-shrink-0 w-[90%] sm:w-72 lg:w-auto',
                'rounded-2xl snap-center overflow-hidden transition-all duration-300 group',
                'shadow-[0_8px_20px_-10px_rgba(0,0,0,0.1),_0_15px_30px_-15px_rgba(34,139,121,0.15)]',
                'hover:shadow-[0_8px_25px_-12px_rgba(0,0,0,0.15),_0_20px_40px_-20px_rgba(34,139,121,0.2)] hover:-translate-y-0.5'
              )}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="absolute inset-0 transition-all duration-300 group-hover:scale-105">
                <BlurImage src={card.image} alt={card.title} />
                {/* Softer but still strong gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent rounded-2xl" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-end h-full p-5 sm:p-6 min-h-[300px]">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 text-white drop-shadow-lg">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-snug mb-3 text-white/85 line-clamp-3 drop-shadow-md">
                    {card.description}
                  </p>
                  <ul className="space-y-1.5 border-t border-white/25 pt-3 text-white">
                    {card.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm drop-shadow-md">
                        <svg
                          className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"
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
