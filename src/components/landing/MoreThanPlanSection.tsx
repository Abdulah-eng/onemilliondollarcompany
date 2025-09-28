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
          'w-full h-full object-cover transition-opacity duration-500', 
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
        // Keeping a slightly opaque background and blur on cards to help with readability
        'p-6 bg-white/90 backdrop-blur-sm border border-gray-100/50 rounded-xl shadow-lg', // Reduced opacity slightly, less blur
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
    // Section background changed to a light gray to complement the image if visible through cards
    <section className="relative py-16 md:py-24 overflow-hidden bg-gray-100"> 
      
      {/* 1. Background Image - Mobile/Tablet (Covers whole section, Blurry) */}
      <div className="absolute inset-0 lg:hidden">
        <div className="relative w-full h-full">
          <BlurImage
            src={HeroImage} 
            alt="Comprehensive wellness platform dashboard"
            // Apply blur and a low opacity to let the image show but not dominate
            className="filter blur-lg opacity-20" // Increased blur, slightly higher opacity for image presence
          />
          {/* Removed the bg-white/80 overlay here */}
        </div>
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
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
        
        {/* Main Content: Container for the grid/layout */}
        <div className="relative">
          {/* 2. Background Image - Desktop Only, positioned on right */}
          <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-0 w-1/2 h-full max-h-[700px]"> 
            <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <BlurImage
                src={HeroImage} 
                alt="Comprehensive wellness platform dashboard"
                className="opacity-25" // Adjusted opacity for desktop, allowing image to be visible but subtle
              />
              {/* Desktop gradient overlay changed to provide a smooth transition from left to right, 
                  matching the gray-100 background of the section */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-100/70 to-transparent" />
            </div>
          </div>
          
          {/* Feature Cards - Horizontal scroll on mobile, overlay on desktop */}
          <div className="relative z-20"> {/* Increased z-index to ensure cards are always above everything */}
            <div
              className={cn(
                // Mobile/Tablet: Horizontal Scroll container setup
                'flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 scroll-smooth pb-8',
                'scroll-p-4', // Padding at the start of the scroll
                // Desktop: Grid layout for better positioning on the left side
                'lg:gap-x-6 lg:gap-y-8 lg:mx-0 lg:px-0 lg:pb-0 lg:grid lg:grid-cols-2 lg:w-1/2 lg:min-w-[400px]'
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
