import { MORE_THAN_PLAN } from '@/mockdata/landingpage/morethanplan';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function MoreThanPlanSection() {
  return (
    // Dark-mode aware background, content pulled up
    <section className="relative pt-12 pb-20 bg-background dark:bg-slate-900/20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-16 items-center"
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
              Go beyond workouts. Learn, connect, reflect, and track your full wellness journey with tools designed to support lasting change.
            </p>
          </div>
        </div>

        {/* Image Cards (same import style as FeaturesSection) */}
        <div
          className={cn(
            'flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory -mx-4 px-4 scroll-px-4',
            'lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:mx-0 lg:px-0'
          )}
          data-reveal
        >
          {MORE_THAN_PLAN.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                'reveal flex-shrink-0 w-[90%] sm:w-80 lg:w-auto',
                'relative rounded-3xl shadow-2xl min-h-[420px] snap-center'
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/10" />
              </div>

              <div className="relative z-10 p-8 flex flex-col h-full justify-between text-left text-white">
                {feature.category && (
                  <Badge
                    variant="secondary"
                    className="bg-white/10 backdrop-blur-sm border-0 text-white font-semibold w-fit"
                  >
                    {feature.category}
                  </Badge>
                )}

                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-lg">
                    {feature.title}
                  </h3>
                  <p className="text-base leading-relaxed opacity-90 drop-shadow-md">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground" data-reveal>
          *Access to certain features may vary based on your selected plan.
        </p>
      </div>
    </section>
  );
}
