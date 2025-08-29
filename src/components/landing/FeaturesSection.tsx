import { FEATURE_CARDS } from '@/mockdata/landingpage/features';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function FeaturesSection() {
  return (
    <section className="relative py-20 bg-white dark:bg-black overflow-hidden">
      {/* Top Gradient Blend */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-emerald-50 to-transparent dark:from-emerald-900/30" />
      
      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-reveal>
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Fitness. Nutrition. Mental Health.
          </h2>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground">
            Three pillars. One complete transformation.
          </p>
        </div>
      </div>

      {/* Card Layout */}
      <div className="relative z-10">
        <div
          className={cn(
            'flex gap-6 overflow-x-auto pb-12 px-4 sm:px-6 lg:px-8',
            'lg:grid lg:grid-cols-3 lg:gap-8 lg:max-w-7xl lg:mx-auto lg:overflow-visible',
            'scrollbar-hide scroll-px-4 snap-x snap-mandatory'
          )}
          data-reveal
        >
          {FEATURE_CARDS.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                'reveal flex-shrink-0 w-[90%] sm:w-80 lg:w-auto',
                'relative rounded-3xl shadow-2xl min-h-[450px] snap-center'
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10"></div>
              </div>

              <div className="relative z-10 p-8 flex flex-col h-full justify-between text-left text-white">
                <Badge
                  variant="secondary"
                  className="bg-white/10 backdrop-blur-sm border-0 text-white font-semibold w-fit"
                >
                  {feature.category}
                </Badge>

                <div className="space-y-3">
                  <h3 className="text-3xl font-bold tracking-tight drop-shadow-lg">{feature.title}</h3>
                  <p className="text-base opacity-90 leading-relaxed drop-shadow-md">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient Blend */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-cyan-50 to-transparent dark:from-cyan-900/30" />
    </section>
  );
}
