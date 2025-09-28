import { useState } from 'react';
import { cn } from '@/lib/utils';
// Assuming MORE_THAN_PLAN_CARDS is imported correctly
declare const MORE_THAN_PLAN_CARDS: any[]; 

// --- BlurImage Component (No change needed) ---

function BlurImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn('relative w-full h-full', className)}>
      {!loaded && (
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

// --- Combined Feature Card Component (No change needed) ---
function FeatureCard({ card, index }: { card: any; index: number }) {
  return (
    <div key={card.title} className="p-6 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/70">
      <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-3 text-foreground">
        {card.title}
      </h3>
      <p className="text-base leading-relaxed mb-4 text-muted-foreground">
        {card.description}
      </p>
      
      {/* Bullet Points */}
      <ul className="space-y-2 text-foreground/90">
        {card.points.map((point: string, idx: number) => (
          <li
            key={idx}
            className="flex items-start gap-3 text-sm"
          >
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
  );
}

// --- MoreThanPlanSection Component (FIXED for Mobile/Tablet) ---

export default function MoreThanPlanSection() {
  if (MORE_THAN_PLAN_CARDS.length < 4) {
    console.error("MORE_THAN_PLAN_CARDS must contain at least 4 items for this layout.");
    return null;
  }
  
  const firstHalf = MORE_THAN_PLAN_CARDS.slice(0, 2);
  const secondHalf = MORE_THAN_PLAN_CARDS.slice(2, 4);
  
  const image1 = firstHalf[0].image;
  const image2 = secondHalf[0].image;

  return (
    <section className="relative pt-20 pb-28 bg-gradient-to-b from-[#BFEDE6]/40 via-[#DDF5F0]/35 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header (No change needed) */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-20 items-center"
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

        {/* -------------------------------------------------------------------- */}
        
        {/* Row 1: Text Left, Image Right */}
        {/* NO CHANGE NEEDED HERE, as the default flow is already Text then Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-24 lg:mb-32" data-reveal>
          
          {/* Text Container (Order 1 on all screens) */}
          <div className="space-y-8 lg:space-y-10 order-1">
            {firstHalf.map((card, index) => (
              <FeatureCard key={card.title} card={card} index={index} />
            ))}
          </div>

          {/* Image Container (Order 2 on all screens) */}
          <div 
            className={cn(
              'relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[5/4] order-2',
              'shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1),_0_20px_45px_-20px_rgba(34,139,121,0.2)]'
            )}
          >
            <BlurImage src={image1} alt={firstHalf[0].title} /> 
          </div>

        </div>

        {/* -------------------------------------------------------------------- */}

        {/* Row 2: Image Left, Text Right (FIXED for Small Screens) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start lg:grid-flow-col-dense" data-reveal>
          
          {/* Image Container - Set to order-2 on mobile, but order-1 on large screens */}
          <div 
            className={cn(
              'relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[5/4]',
              'shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1),_0_20px_45px_-20px_rgba(34,139,121,0.2)]',
              // KEY FIX: Image is ORDER-2 on mobile/tablet, ORDER-1 on large screen
              'order-2 lg:order-1' 
            )}
          >
            <BlurImage src={image2} alt={secondHalf[0].title} />
          </div>

          {/* Text Container - Set to order-1 on mobile, but order-2 on large screens */}
          <div className="space-y-8 lg:space-y-10 order-1 lg:order-2">
            {secondHalf.map((card, index) => (
              <FeatureCard key={card.title} card={card} index={index} />
            ))}
          </div>

        </div>

        {/* -------------------------------------------------------------------- */}

        {/* Footer Text (No change needed) */}
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
