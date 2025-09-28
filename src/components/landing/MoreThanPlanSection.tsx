import { useState } from 'react';
import { cn } from '@/lib/utils';
// Assuming you'll use the first card's image as the main image
import { MORE_THAN_PLAN_CARDS } from '@/mockdata/landingpage/morethanplan';

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

function FeatureCard({ title, description, icon: Icon }) {
  return (
    <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl shadow-sm bg-white hover:border-primary/50 transition duration-300">
      <div className="p-2.5 rounded-full bg-primary/10 text-primary flex-shrink-0 mt-0.5">
        {/* Replace with your actual icon component or SVG */}
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7" // Example icon path
          />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

// --- Main ModernFeatureSection Component ---

export default function ModernFeatureSection() {
  const mainImage = MORE_THAN_PLAN_CARDS[0].image; // Use the first feature's image for the main visual

  return (
    <section className="relative py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header (Kept similar to original) */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Features (Mobile First: Full Width) */}
          <div className="space-y-6 order-2 md:order-1">
            {MORE_THAN_PLAN_CARDS.map((card) => (
              // Using a FeatureCard component for cleaner presentation
              <FeatureCard
                key={card.title}
                title={card.title}
                description={card.description}
                // NOTE: The original mock data doesn't have an icon field, so a simple checkmark icon is used in FeatureCard
                // If you have actual icons, pass them here: icon={card.IconComponent}
              />
            ))}
          </div>

          {/* Right Column: Image (Mobile First: Full Width, Order 1) */}
          <div className="order-1 md:order-2">
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square">
              {/* Aspect ratio ensures the image container maintains a modern, blocky shape */}
              <BlurImage
                src={mainImage}
                alt="Comprehensive wellness platform features"
                className="w-full h-full"
              />
              {/* Optional: Add a subtle shadow/depth to the image */}
              <div className="absolute inset-0 rounded-2xl shadow-2xl shadow-primary/20" />
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
