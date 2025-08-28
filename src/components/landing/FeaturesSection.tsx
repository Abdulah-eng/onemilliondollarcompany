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
          <div className="flex gap-6 overflow-x-auto pb-8 lg:contents" data-reveal>
            
            {FEATURE_CARDS.map((feature, index) => (
              <div 
                key={feature.title} 
                className={cn(
                  "reveal flex-shrink-0 w-[90%] sm:w-80 lg:w-auto bg-gradient-to-br rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl",
                  feature.themeClass
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col h-full">
                  <div className="w-full h-56">
                    {/* ✅ IMAGE IS NOW OPTIMIZED FOR PERFORMANCE */}
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover" 
                      loading="lazy"   // Prevents images from loading until they are close to the viewport
                      decoding="async" // Helps prevent rendering lag
                    />
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                    <p className="mt-3 text-base text-current opacity-80 flex-grow">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}
