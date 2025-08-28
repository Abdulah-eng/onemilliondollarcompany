import { MORE_THAN_PLAN } from '@/mockdata/landingpage/morethanplan';
import { cn } from '@/lib/utils';

export default function MoreThanPlanSection() {
  return (
    // ✅ NEW: Subtle corner-to-corner gradient background.
    <section className="py-20 bg-gradient-to-tr from-primary/10 via-background to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16 items-center" data-reveal>
          <div>
            <p className="mb-2 font-semibold text-primary">Everything You Need</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-foreground">
              More Than Just a Plan
            </h2>
          </div>
          <div>
            <p className="text-lg text-muted-foreground">
              We provide a holistic ecosystem to support every aspect of your wellness journey. From tracking your progress to connecting with your coach, all the tools you need are right at your fingertips.
            </p>
          </div>
        </div>

        {/* ✅ UPDATED: This container now scrolls horizontally on mobile and becomes a grid on larger screens. */}
        <div 
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-px-4
                     sm:grid sm:grid-cols-2 sm:overflow-visible
                     lg:grid-cols-4"
          data-reveal
        >
          {MORE_THAN_PLAN.map((feature, index) => (
            <div
              key={feature.title}
              className="reveal p-8 bg-card/80 backdrop-blur-sm rounded-3xl shadow-lg text-center 
                         transition-transform duration-300 hover:-translate-y-2
                         flex-shrink-0 w-[90%] snap-center sm:w-auto" // Added classes for mobile scroll
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-5xl">
                {feature.emoji}
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">{feature.title}</h3>
              <p className="text-base text-muted-foreground">{feature.description}</p>
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
