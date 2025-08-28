import { FEATURE_CARDS } from '@/mockdata/landingpage/features';
import { cn } from '@/lib/utils';

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-reveal>
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Fitness. Nutrition. Mental Health.
          </h2>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground">
            Three pillars. One complete transformation.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Ensure horizontal scroll on mobile/tablet and proper grid on desktop */}
          <div className="flex gap-6 overflow-x-auto pb-8 px-2 -mx-2 lg:px-0 lg:-mx-0 lg:contents" data-reveal>
            
            {FEATURE_CARDS.map((feature, index) => (
              <div 
                key={feature.title} 
                // Removed hover effect classes.
                // Adjusted overflow-visible on the outer container to prevent shadow clipping.
                className={cn(
                  "reveal flex-shrink-0 w-[90%] sm:w-80 lg:w-auto relative rounded-3xl shadow-xl overflow-visible", // Changed from overflow-hidden
                  // Themed background is now applied to the inner text container if needed, not the outer card.
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Image as full background with dark overlay */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover" 
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Subtle dark gradient overlay for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                </div>

                {/* Content Container - centered and high contrast */}
                <div className="relative z-10 p-8 flex flex-col h-full justify-end items-center text-center text-white">
                  <h3 className="text-2xl font-bold drop-shadow-lg">{feature.title}</h3>
                  <p className="mt-3 text-base opacity-90 drop-shadow-md">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}
