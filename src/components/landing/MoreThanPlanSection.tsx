import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MORE_THAN_PLAN_CARDS } from '@/mockdata/landingpage/morethanplan';

// Import the background image
import HeroImage from '@/assets/more-than-plan-hero.webp';

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

// --- Feature Card Component (Optimized for overlay on background) ---

function FeatureCard({ feature, index }) {
  return (
    <div
      key={feature.title}
      className={cn(
        'flex-shrink-0 w-11/12 sm:w-[320px] lg:w-[380px] snap-center',
        // Modern Card Look with semi-transparent background for overlay effect
        'p-6 bg-white/95 backdrop-blur-sm border border-gray-100/50 rounded-xl shadow-lg',
        'transition-all duration-300 hover:shadow-2xl hover:border-primary/50 hover:bg-white',
        // Spacing for mobile scroll and desktop overlay
        'lg:mb-6' 
      )}
    >
      <div className="p-3 rounded-full bg-primary/10 text-primary w-fit mb-4">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {feature.title}
      </h3>
      <p className="text-base text-muted-foreground">
        {feature.description}
      </p>
    </div>
  );
}

// --- Main Component ---

export default function ModernFeatureSection() {
  const features = MORE_THAN_PLAN_CARDS.slice(0, 4); 

  return (
    <section className="relative py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header (Top-centered) */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <p className="mb-2 font-semibold text-primary">Everything You Need</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-foreground">
            More Than Just a Plan
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Go beyond workouts. Learn, connect, reflect, and track your full
            wellness journey with tools designed to support lasting change.
          </p>
        </div>
        
        {/* Main Content: Single container with background image on right and overlaying cards */}
        <div className="relative">
          {/* Background Image - Desktop Only, positioned on right */}
          <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full">
            <div className="relative w-full h-full min-h-[600px]">
              <BlurImage
                src={HeroImage} 
                alt="Comprehensive wellness platform dashboard"
                className="opacity-30"
              />
              {/* Gradient overlay for better card readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent" />
            </div>
          </div>
          
          {/* Feature Cards - Horizontal scroll on mobile, overlay on desktop */}
          <div className="relative z-10">
            <div
              className={cn(
                // Mobile/Tablet: Horizontal Scroll container setup
                'flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 scroll-smooth pb-8',
                'scroll-p-4', // Padding at the start of the scroll
                // Desktop: Side by side with positioning for overlay effect
                'lg:gap-6 lg:mx-0 lg:px-0 lg:pb-0 lg:overflow-x-visible'
              )}
            >
              {features.map((card, index) => (
                <FeatureCard key={card.title} feature={card} index={index} />
              ))}
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          *Access to features like Coach Feedback and advanced tracking is
          available on our Premium plan.
        </p>
      </div>
    </section>
  );
}
