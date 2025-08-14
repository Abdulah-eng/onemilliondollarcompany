import { HOW_IT_WORKS } from '@/mockdata/landingpage/howitworks';

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal text-center mb-16" data-reveal>
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold">How It Works</h2>
          <p className="mx-auto max-w-3xl text-lg sm:text-xl text-muted-foreground">
            Everything starts with your goals — then we build everything around them.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((s) => (
            <div 
              key={s.title} 
              className="reveal relative p-6 bg-card rounded-3xl shadow-card text-center transition-transform duration-300 hover:scale-105" 
              data-reveal
            >
              <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {s.badge}
              </div>
              <div className="mb-4 text-5xl">{s.emoji}</div>
              <h3 className="mb-3 text-xl font-semibold">{s.title}</h3>
              <p className="text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}