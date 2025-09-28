import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MORE_THAN_PLAN_CARDS } from '@/mockdata/landingpage/morethanplan.js';

// --- BlurImage Component (Slightly modified to fit new container structure) ---

function BlurImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn('relative w-full h-full', className)}>
      {!loaded && (
        // Added 'absolute inset-0' to the loading state to cover the container
        <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse rounded-2xl" />
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

// --- MoreThanPlanSection Component (Refactored to Alternate Layout) ---

export default function MoreThanPlanSection() {
  return (
    <section className="relative pt-20 pb-28 bg-gradient-to-b from-[#BFEDE6]/40 via-[#DDF5F0]/35 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header (Kept as is) */}
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

        {/* Cards - Refactored for Alternating Layout */}
        <div className="space-y-16 lg:space-y-24">
          {MORE_THAN_PLAN_CARDS.map((card, index) => {
            // Determine if the card is an even or odd index for layout swapping
            const isOdd = index % 2 !== 0;

            // Conditional classes for the main grid container
            const cardGridClasses = cn(
              'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center',
              {
                // For odd indices (1st, 3rd, etc.): Image Left, Text Right
                'lg:grid-flow-col-dense': isOdd, 
              }
            );

            // Conditional classes for image/text order inside the grid
            const imageOrderClass = isOdd ? 'lg:order-1' : 'lg:order-2';
            const textOrderClass = isOdd ? 'lg:order-2' : 'lg:order-1';

            return (
              <div
                key={card.title}
                className={cardGridClasses}
                data-reveal
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* 1. Image Container */}
                <div 
                  className={cn(
                    'relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[5/4]',
                    'shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1),_0_20px_45px_-20px_rgba(34,139,121,0.2)]',
                    imageOrderClass // Swaps order for odd indices
                  )}
                >
                  <BlurImage src={card.image} alt={card.title} />
                </div>

                {/* 2. Text Content */}
                <div 
                  className={cn('py-4 lg:py-0', textOrderClass)} // Swaps order for odd indices
                >
                  <p className="mb-2 font-semibold text-primary/80">Feature {index + 1}</p>
                  <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
                    {card.description}
                  </p>
                  
                  {/* Bullet Points */}
                  <ul className="space-y-3 text-foreground/90">
                    {card.points.map((point: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-base"
                      >
                        <svg
                          className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
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
            );
          })}
        </div>

        {/* Footer Text (Kept as is) */}
        <p
          className="mt-16 text-center text-sm text-muted-foreground"
          data-reveal
        >
          *Access to features like Coach Feedback and advanced tracking is
          available on our Premium plan.
        </p>
      </div>
    </section>
  );
}
