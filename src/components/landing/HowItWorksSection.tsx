import { cn } from '@/lib/utils';
import { HOW_IT_WORKS } from '@/mockdata/landingpage/howitworks';
import howItWorksBg from '@/assets/how-it-works-bg.webp';

export default function HowItWorksSection() {
  return (
    <section className="relative py-12 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* DESKTOP LAYOUT */}
        <div className="hidden lg:block">
          <div className="relative grid grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div className="relative z-10 text-left" data-reveal>
              <h2 className="mb-4 text-5xl font-extrabold tracking-tighter text-foreground">
                How It Works
              </h2>
              <p className="max-w-xl text-xl text-muted-foreground">
                Everything starts with your goals — then we build everything around them. Our simple four-step process ensures a personalized and effective journey to success.
              </p>
            </div>

            {/* Image */}
            <div className="flex justify-end" data-reveal>
              <div className="w-full h-[450px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={howItWorksBg}
                  alt="Person tracking progress"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Steps Overlay */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-4xl mx-auto pb-12"
              data-reveal
            >
              <div className="bg-card/80 dark:bg-background/60 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border dark:border-slate-800">
                <div className="grid grid-cols-4 gap-6 text-center">
                  {HOW_IT_WORKS.map((step) => (
                    <div key={step.title} className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                        {step.badge}
                      </div>
                      <h3 className="mb-1 font-semibold text-foreground">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE & TABLET LAYOUT */}
        <div className="lg:hidden">
          <div className="text-center mb-12" data-reveal>
            <h2 className="mb-4 text-3xl sm:text-4xl font-extrabold tracking-tighter text-foreground">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Our simple four-step process ensures a personalized and effective journey to success.
            </p>
          </div>
          <div
            className={cn(
              'flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory',
              '-mx-4 px-4 scroll-px-4'
            )}
            data-reveal
          >
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.title}
                className="relative flex-shrink-0 w-[85%] sm:w-72 snap-center p-6 bg-card rounded-3xl shadow-lg text-center"
              >
                {/* Step Badge instead of emoji */}
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                  {step.badge}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
