import { MORE_THAN_PLAN } from '@/mockdata/landingpage/morethanplan';
import { cn } from '@/lib/utils';

export default function MoreThanPlanSection() {
  return (
    // ✅ Section background now correctly adapts to dark mode with a deep teal color
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

        {/* ✅ REDESIGNED GRADIENT CARDS */}
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
                'reveal flex-shrink-0 w-[90%] sm:w-80 lg:w-auto relative rounded-3xl shadow-xl min-h-[400px] snap-center transition-transform duration-300 hover:-translate-y-2',
                'p-8 flex flex-col text-center items-center',
                `bg-gradient-to-br ${feature.gradient}` // Applying the new vibrant gradients
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Content now uses white text with shadows for contrast */}
              <div className="flex-grow flex flex-col items-center justify-center text-white">
                <div className="text-6xl mb-4 drop-shadow-lg">
                  {feature.emoji}
                </div>
                <h3 className="text-3xl font-bold tracking-tight drop-shadow-md">
                  {feature.title}
                </h3>
                <p className="mt-2 text-white/90 max-w-xs drop-shadow-sm">
                  {feature.description}
                </p>
              </div>
              <p className="text-sm font-semibold text-white/60 mt-auto">{feature.category}</p>
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
