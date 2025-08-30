// src/components/landingpage/MoreThanPlanSection.tsx

import { MORE_THAN_PLAN_CARDS } from "@/mockdata/landingpage/morethanplan";
import { Card, CardContent } from "@/components/ui/card";

export default function MoreThanPlanSection() {
  return (
    <section id="more-than-plan" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            More Than Just a Plan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Elevate your journey with features designed to keep you inspired, informed, and on track.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {MORE_THAN_PLAN_CARDS.map((card, index) => (
            <Card
              key={index}
              className="group overflow-hidden rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
                {/* Image */}
                <div className="flex-shrink-0">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-32 h-32 object-cover rounded-xl shadow-md"
                  />
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">{card.description}</p>
                  <ul className="mt-4 space-y-2 text-sm text-foreground">
                    {card.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
