import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MORE_THAN_PLAN_CARDS } from '@/mockdata/landingpage/morethanplan.js';

// --- BlurImage Component (Reverted to simple image container for flexibility) ---

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

// --- Combined Feature Card Component ---
// This component renders a single feature's text/points
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

// --- MoreThanPlanSection Component (Refactored for 2-Row Layout) ---

export default function MoreThanPlanSection() {
  if (MORE_THAN_PLAN_CARDS.length < 4) {
    // Basic check for data integrity based on the 2x2 requirement
    console.error("MORE_THAN_PLAN_CARDS must contain at least 4 items for this layout.");
    return null;
  }
  
  // Split the data into two groups of two
  const firstHalf = MORE_THAN_PLAN_CARDS.slice(0, 2);
  const secondHalf = MORE_THAN_PLAN_CARDS.slice(2, 4);
  
  // Use the image from the first card in each half as the section image
  const image1 = firstHalf[0].image;
  const image2 = secondHalf[0].image;

  return (
    <section className="relative pt-20 pb-28 bg-gradient-to-b from-[#BFEDE6]/40 via-[#DDF5F0]/35 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header (Kept as is) */}
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
        
        {/* Row 1: Text Left, Image Right (Features 1 & 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-24 lg:mb-32" data-reveal>
          
          {/* Text Container (Left) */}
          <div className="space-y-8 lg:space-y-10">
            {firstHalf.map((card, index) => (
              <FeatureCard key={card.title} card={card} index={index} />
            ))}
          </div>

          {/* Image Container (Right) */}
          <div 
            className={cn(
              'relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[5/4]',
              'shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1),_0_20px_45px_-20px_rgba(34,139,121,0.2)]'
            )}
          >
            {/* Using image from the first card in the group for the visual */}
            <BlurImage src={image1} alt={firstHalf[0].title} /> 
          </div>

        </div>

        {/* -------------------------------------------------------------------- */}

        {/* Row 2: Image Left, Text Right (Features 3 & 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start lg:grid-flow-col-dense" data-reveal>
          
          {/* Image Container (Left) - Uses order-1 on large screens */}
          <div 
            className={cn(
              'relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[5/4] lg:order-1',
              'shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1),_0_20px_45px_-20px_rgba(34,139,121,0.2)]'
            )}
          >
            {/* Using image from the first card in the group for the visual */}
            <BlurImage src={image2} alt={secondHalf[0].title} />
          </div>

          {/* Text Container (Right) - Uses order-2 on large screens */}
          <div className="space-y-8 lg:space-y-10 lg:order-2">
            {secondHalf.map((card, index) => (
              <FeatureCard key={card.title} card={card} index={index} />
            ))}
          </div>

        </div>

        {/* -------------------------------------------------------------------- */}

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
