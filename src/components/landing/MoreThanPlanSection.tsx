import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MORE_THAN_PLAN_CARDS } from '@/mockdata/landingpage/morethanplan';

function BlurImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="absolute inset-0">
      {!loaded && (
        <div className="w-full h-full bg-gray-800 absolute inset-0" />
      )}

      <img
        src={src}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
    </div>
  );
}

export default function MoreThanPlanSection() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-[#14B8A6]/5 via-[#DFF7F3]/20 to-[#FAF5F0] overflow-hidden">
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
              Go beyond workouts. Learn, connect, reflect, and track your full wellness journey with tools designed to support lasting change.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div
          className={cn(
            'flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory -mx-4 px-4 scroll-px-4',
            'lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:mx-0 lg:px-0'
          )}
          data-reveal
        >
          {MORE_THAN_PLAN_CARDS.map((card, index) => (
            <div
              key={card.title}
              className={cn(
                'reveal flex-shrink-0 w-[90%] sm:w-80 lg:w-auto',
                'relative rounded-3xl shadow-2xl min-h-[500px] snap-center overflow-hidden',
                'flex flex-col justify-end p-8 text-white'
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <BlurImage src={card.image} alt={card.title} />

              <div className="relative z-10 space-y-4">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-lg">
                  {card.title}
                </h3>
                <p className="text-base leading-relaxed opacity-90 drop-shadow-md">
                  {card.description}
                </p>
                <ul className="space-y-2 border-t border-white/20 pt-4">
                  {card.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start gap-3 text-sm">
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
                        ></path>
                      </svg>
                      <span className="opacity-80">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground" data-reveal>
          *Access to features like Coach Feedback and advanced tracking is available on our Premium plan.
        </p>
      </div>
    </section>
  );
}
