import { FEATURE_CARDS } from '@/mockdata/landingpage/features';

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal text-center mb-16" data-reveal>
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold">
            Fitness. Nutrition. Mental Health.
          </h2>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground">
            Three pillars. One complete transformation.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {FEATURE_CARDS.map((f) => (
            <div 
              key={f.title} 
              className={`reveal p-8 text-center transition-transform duration-300 hover:scale-105 ${f.bgClass}`} 
              data-reveal
            >
              <div className="mb-6 text-6xl">{f.emoji}</div>
              <h3 className="mb-4 text-xl font-semibold">{f.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}