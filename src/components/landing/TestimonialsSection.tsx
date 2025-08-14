import { TESTIMONIALS } from '@/mockdata/landingpage/testimonials';

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal text-center mb-16" data-reveal>
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold">What Clients Are Saying</h2>
          <p className="text-lg sm:text-xl text-muted-foreground">These results are real. So is your potential.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <article 
              key={t.name} 
              className="reveal p-6 bg-card rounded-3xl shadow-card transition-transform duration-300 hover:scale-105" 
              data-reveal
            >
              <header className="mb-4 flex items-center">
                <div className="mr-3 text-3xl">{t.avatar}</div>
                <div>
                  <h3 className="font-semibold">{t.name}, {t.age}</h3>
                  <div role="img" aria-label={`${t.rating} out of 5 stars`} className="text-sm">
                    ⭐⭐⭐⭐⭐
                  </div>
                </div>
              </header>
              <blockquote className="mb-4 italic text-muted-foreground">
                <p>"{t.text}"</p>
              </blockquote>
              <div className="flex items-center text-sm">
                <span className="mr-2">✨</span>
                <span className="font-medium text-primary">{t.result}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}