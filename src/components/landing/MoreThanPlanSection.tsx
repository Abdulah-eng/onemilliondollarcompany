import { MORE_THAN_PLAN } from '@/mockdata/landingpage/morethanplan';

export default function MoreThanPlanSection() {
  return (
    // ✅ Added a subtle background gradient for depth
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-reveal>
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold">
            More Than Just a <span className="text-primary">Plan</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            We provide a holistic ecosystem to support every aspect of your wellness journey.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MORE_THAN_PLAN.map((feature, index) => (
            <div
              key={feature.title}
              // ✅ Added staggered animation delay
              className="reveal p-6 bg-card rounded-3xl shadow-card text-center transition-transform duration-300 hover:-translate-y-2"
              data-reveal
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* ✅ Emoji is now wrapped in a styled circle for better visual hierarchy */}
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-4xl">
                {feature.emoji}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
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
