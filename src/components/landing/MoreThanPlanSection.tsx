import { useState } from 'react';
import { cn } from '@/lib/utils';
// We only need the data array, not all the individual images
import { MORE_THAN_PLAN_CARDS } from '@/mockdata/landingpage/morethanplan';

// Import only the single image we will use for the main visual
import HeroImage from '@/assets/more-than-plan-blogaccess.webp';

// --- BlurImage Component (Kept as is for image loading) ---

function BlurImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
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

// --- FeatureCard Component for the list of 4 features ---

// This card is now designed to look modern and stack well on desktop, 
// but still function in a horizontally scrollable container on mobile.
function FeatureCard({ title, description, index }) {
  return (
    <div
      key={title}
      // Mobile styling for horizontal scroll
      className={cn(
        'flex-shrink-0 w-[85%] sm:w-72 md:w-full', // Ensure it only takes partial width on mobile
        'p-5 border border-gray-100 rounded-xl bg-white shadow-lg md:shadow-none',
        'hover:shadow-xl hover:border-primary/50 transition duration-300',
        // Delayed reveal animation (optional)
        { 'md:mt-0 mt-4': index > 0 } // Add some top margin between stacked cards on mobile
      )}
    >
      <div className="p-3 rounded-full bg-primary/10 text-primary w-fit mb-3">
        {/* Simple checkmark icon */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-base text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

// --- Main ModernFeatureSection Component ---

export default function ModernFeatureSection() {
  const features = MORE_THAN_PLAN_CARDS.slice(0, 4); // Only need the first 4 features

  return (
    <section className="relative py-12 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <p className="mb-2 font-semibold text-primary">Everything You Need</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-foreground">
            More Than Just a Plan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Go beyond workouts. Learn, connect, reflect, and track your full
            wellness journey with tools designed to support lasting change.
          </p>
        </div>
        
        {/* Content Grid: Mobile Stacks, Desktop is 2-Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Features - HORIZONTAL SCROLL on mobile, STACKED on desktop */}
          <div
            className={cn(
              // Mobile: Horizontal Scroll
              'flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 scroll-smooth pb-4 md:pb-0',
              'scroll-p-4', // Padding at the start of the scroll
              // Desktop: Stacked Vertical
              'md:block md:space-y-6 md:mx-0 md:px-0 md:order-1'
            )}
          >
            {features.map((card, index) => (
              <FeatureCard
                key={card.title}
                title={card.title}
                description={card.description}
                index={index}
              />
            ))}
          </div>

          {/* Right Column: Image - Full width on mobile, right column on desktop */}
          <div className="order-1 md:order-2 p-4 md:p-0">
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square">
              <BlurImage
                src={HeroImage} // Use the single imported image
                alt="Comprehensive wellness platform dashboard"
              />
              {/* Modern, soft shadow effect */}
              <div className="absolute inset-0 rounded-2xl shadow-2xl shadow-primary/30" />
            </div>
          </div>

        </div>

        <p
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          *Access to features like Coach Feedback and advanced tracking is
          available on our Premium plan.
        </p>
      </div>
    </section>
  );
}
