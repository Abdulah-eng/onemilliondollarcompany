import { HOW_IT_WORKS } from '@/mockdata/landingpage/howitworks';

export default function HowItWorksSection() {
  return (
    <section className="relative py-20 lg:pb-40 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Text Content */}
          <div className="relative z-10 text-center lg:text-left" data-reveal>
            <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-foreground">
              How It Works
            </h2>
            <p className="max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl text-muted-foreground">
              Everything starts with your goals — then we build everything around them. Our simple four-step process ensures a personalized and effective journey to success.
            </p>
          </div>

          {/* Right Image Content */}
          <div className="flex justify-center lg:justify-end" data-reveal>
            <div className="w-full max-w-md lg:max-w-none h-[450px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/src/assets/how-it-works-bg.webp" // Add your image here
                alt="Person tracking their progress on a phone"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* Overlapping Steps Card */}
          <div 
            className="lg:absolute bottom-0 left-1/2 lg:-translate-x-1/2 lg:translate-y-1/2 w-full max-w-4xl mx-auto mt-8 lg:mt-0"
            data-reveal
          >
            <div className="bg-card/80 dark:bg-background/60 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border dark:border-slate-800">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                {HOW_IT_WORKS.map((step) => (
                  <div key={step.title} className="flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                      {step.badge}
                    </div>
                    <h3 className="mb-1 font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground hidden sm:block">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
