import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const MORE_THAN_PLAN = [
  {
    title: 'Knowledge Library',
    description:
      'Explore how-to guides, recipe collections, and mental health exercises—all in one place to level up your wellness journey.',
    category: 'Library',
    emoji: '📚',
    gradient: 'from-teal-100/40 via-green-100/30 to-teal-200/20',
  },
  {
    title: 'Personal Follow-Up',
    description:
      'Stay on track with tailored programs and direct coach support to ensure you achieve your goals without getting off course.',
    category: 'Coaching',
    emoji: '👩‍🏫',
    gradient: 'from-indigo-100/40 via-purple-100/30 to-indigo-200/20',
  },
  {
    title: 'Insights & Blog',
    description:
      'Read tips, tricks, and insights on fitness, nutrition, and mental health to stay informed and inspired every day.',
    category: 'Blog',
    emoji: '📝',
    gradient: 'from-yellow-100/40 via-orange-100/30 to-yellow-200/20',
  },
  {
    title: 'Reflect & Track',
    description:
      'Log your progress and reflect on your journey, keeping track of your history to measure growth and success.',
    category: 'Tracking',
    emoji: '📊',
    gradient: 'from-pink-100/40 via-rose-100/30 to-pink-200/20',
  },
];

export default function MoreThanPlanSection() {
  return (
    <section className="relative pt-12 pb-20 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-12 items-start" data-reveal>
          <div>
            <p className="mb-2 font-semibold text-primary">Everything You Need</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-foreground">
              More Than Just a Plan
            </h2>
          </div>
          <div>
            <p className="text-lg text-muted-foreground">
              Our platform supports every aspect of your wellness journey, from learning new exercises and recipes to tracking your progress and staying connected with your coach.
            </p>
          </div>
        </div>

        {/* Emoji Cards */}
        <div
          className={cn(
            "flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory px-4 sm:px-6",
            "lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible"
          )}
          data-reveal
        >
          {MORE_THAN_PLAN.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "reveal flex-shrink-0 w-[90%] sm:w-80 lg:w-auto relative rounded-3xl shadow-xl min-h-[400px] snap-center transition-transform duration-300 hover:-translate-y-2",
                `bg-gradient-to-t ${feature.gradient}`
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative z-10 p-6 flex flex-col h-full justify-between text-left">
                <div className="mb-4 text-6xl flex justify-center">{feature.emoji}</div>
                
                <Badge
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm border-0 text-white font-semibold w-fit"
                >
                  {feature.category}
                </Badge>

                <div className="space-y-3 mt-4">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{feature.title}</h3>
                  <p className="text-base opacity-90 leading-relaxed text-foreground">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-sm text-muted-foreground" data-reveal>
          *Access to certain features may vary based on your selected plan.
        </p>
      </div>
    </section>
  );
}
