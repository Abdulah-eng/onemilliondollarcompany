import { MORE_THAN_PLAN } from '@/mockdata/landingpage/morethanplan';

export default function MoreThanPlanSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal text-center mb-16" data-reveal>
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold">
            More Than Just a Plan
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MORE_THAN_PLAN.map((f) => (
            <div 
              key={f.title} 
              className="reveal p-6 bg-card rounded-3xl shadow-card text-center transition-transform duration-300 hover:scale-105" 
              data-reveal
            >
              <div className="mb-4 text-4xl">{f.emoji}</div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">*Access may vary based on plan</p>
      </div>
    </section>
  );
}