import { MORE_THAN_PLAN } from '@/mockdata/landingpage/morethanplan';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function MoreThanPlanSection() {
  return (
    <section className="relative pt-12 pb-20 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-12 items-start"
          data-reveal
        >
          <div>
            <p className="mb-2 font-semibold text-primary">Everything You Need</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-foreground">
              More Than Just a Plan
            </h2>
          </div>
          <div>
            <p className="text-lg text-foreground">
              Go beyond workouts. Learn, connect, reflect, and track your full wellness journey with tools designed to support lasting change.
            </p>
          </div>
        </div>

        {/* Emoji Gradient Cards */}
        <div
          className={cn(
            'flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory px-4 sm:px-6',
            'lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible'
          )}
          data-reveal
        >
          {MORE_THAN_PLAN.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                'reveal flex-shrink-0 w-[90%] sm:w-80 lg:w-auto relative rounded-3xl shadow-xl min-h-[400px] snap-center transition-transform duration-300 hover:-translate-y-2',
                `bg-gradient-to-t ${feature.gradient}`
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative z-10 p-6 flex flex-col h-full justify-between text-left">
                {/* Emoji */}
                <div className="mb-4 text-6xl flex justify-center transition-transform duration-300 hover:scale-110">
                  {feature.emoji}
                </div>

                {/* Badge */}
                <Badge
                  variant="secondary"
                  className="bg-white/30 backdrop-blur-sm border-0 text-foreground font-semibold w-fit"
                >
                  {feature.category}
                </Badge>

                {/* Title & Description */}
                <div className="space-y-3 mt-4">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-base leading-relaxed text-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p
          className="mt-8 text-center text-sm text-muted-foreground"
          data-reveal
        >
          *Access to certain features may vary based on your selected plan.
        </p>
      </div>
    </section>
  );
}
