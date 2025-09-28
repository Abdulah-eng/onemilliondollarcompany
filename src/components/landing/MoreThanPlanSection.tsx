import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MORE_THAN_PLAN_CARDS } from '@/mockdata/landingpage/morethanplan';

// --- Image Imports for Alternating Layout ---
// NOTE: We need all 4 images for the alternating pattern. 
// If you only want to use ONE image total, we'd go back to the single image layout, 
// but the alternating pattern is much more modern and engaging.
// Assuming your mockdata now looks like the version *before* my last suggestion 
// (which had the image path in the card object), but I'll import directly 
// here to show the necessary structure.
import BlogAccessImage from '@/assets/more-than-plan-blogaccess.webp';
import CoachFeedbackImage from '@/assets/more-than-plan-coachfeedback.webp';
import ReflectTrackImage from '@/assets/more-than-plan-reflectandtrack.webp';
import KnowledgeImage from '@/assets/more-than-plan-knowledge.webp';

const FEATURE_IMAGES = [
  BlogAccessImage,
  CoachFeedbackImage,
  ReflectTrackImage,
  KnowledgeImage,
];

// --- BlurImage Component (Kept as is for image loading) ---

function BlurImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn('relative w-full h-full', className)}>
      {!loaded && (
        <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse rounded-xl" />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          'w-full h-full object-cover rounded-xl transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

// --- FeatureItem Component (The core alternating block) ---

function FeatureItem({ feature, index }) {
  const isImageLeft = index % 2 !== 0; // Odd index (1, 3, ...) puts the image on the left

  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center py-10',
        'border-b border-gray-100 last:border-b-0' // Visual separation
      )}
    >
      {/* Image Column */}
      <div
        className={cn(
          'md:col-span-5',
          'order-1', // Image always first on mobile
          { 'md:order-1': isImageLeft, 'md:order-2': !isImageLeft } // Order swap for desktop
        )}
      >
        <div className="relative w-full aspect-[4/3] lg:aspect-[5/4]">
          <BlurImage
            src={FEATURE_IMAGES[index]}
            alt={feature.title}
          />
          {/* Subtle 3D lift/shadow */}
          <div className="absolute inset-0 rounded-xl shadow-2xl shadow-primary/20" />
        </div>
      </div>

      {/* Text Content Column */}
      <div
        className={cn(
          'md:col-span-7',
          'order-2', // Text always second on mobile
          { 'md:order-2 md:pl-10': isImageLeft, 'md:order-1 md:pr-10': !isImageLeft } // Order swap for desktop
        )}
      >
        <p className="mb-1 text-sm font-medium uppercase tracking-wider text-primary">
          {`Feature ${index + 1}`}
        </p>
        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
          {feature.title}
        </h3>
        <p className="text-lg text-muted-foreground mb-6">
          {feature.description}
        </p>
        
        {/* Simple bullet points list */}
        <ul className="space-y-3 text-base">
          {feature.points.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <svg 
                className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function ModernFeatureSection() {
  return (
    <section className="relative py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header (More focused and clean) */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <p className="mb-2 font-semibold text-primary">Beyond the Workout</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-foreground">
            More Than Just a Plan
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Go beyond workouts. Learn, connect, reflect, and track your full
            wellness journey with tools designed to support lasting change.
          </p>
        </div>
        
        {/* Alternating Feature List */}
        <div>
          {MORE_THAN_PLAN_CARDS.map((card, index) => (
            <FeatureItem key={card.title} feature={card} index={index} />
          ))}
        </div>

        <p className="mt-16 text-center text-sm text-muted-foreground">
          *Access to features like Coach Feedback and advanced tracking is
          available on our Premium plan.
        </p>
      </div>
    </section>
  );
}
