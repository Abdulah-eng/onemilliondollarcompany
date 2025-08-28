import { MORE_THAN_PLAN } from '@/mockdata/landingpage/morethanplan';
import { cn } from '@/lib/utils';

export default function MoreThanPlanSection() {
  return (
    // ✅ Section is now relative and overflow-hidden to contain the background glows
    <section className="relative pt-12 pb-20 bg-background overflow-hidden">
      
      {/* ✅ NEW: Background "Sun" Glow Effect */}
      {/* This div creates the large, soft orange glow from the bottom-left corner */}
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      {/* This div adds a complementary, subtle glow to the top-right */}
      <div className="absolute top-0 right-0 h-[300px] w-[300px] translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      {/* Content is now relative to sit on top of the background glows */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16 items-center" data-reveal>
          {/* Left Column: Title */}
          <div>
            <p className="mb-2 font-semibold text-primary">Everything You Need</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-foreground">
              More Than Just a Plan
            </h2>
          </div>
          {/* Right Column: Description */}
          <div>
            <p className="text-lg text-muted-foreground">
              We provide a holistic ecosystem to support every aspect of your wellness journey. From tracking your progress to connecting with your coach, all the tools you need are right at your fingertips.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MORE_THAN_PLAN.map((feature, index) => (
            <div
              key={feature.title}
              className="reveal p-8 bg-card/80 backdrop-blur-sm rounded-3xl shadow-lg text-center transition-transform duration-300 hover:-translate-y-2"
              data-reveal
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
