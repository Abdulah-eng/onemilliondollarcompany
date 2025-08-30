// src/components/landingpage/MoreThanPlanSection.tsx

import { MORE_THAN_PLAN_CARDS } from "@/mockdata/landingpage/morethanplan";

export default function MoreThanPlanSection() {
  return (
    <section id="more-than-plan" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            More Than Just a Plan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Extra tools and guidance that go beyond workouts and meals.
          </p>
        </div>

        {/* Scrollable cards */}
        <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
          {MORE_THAN_PLAN_CARDS.map((card, index) => (
            <div
              key={index}
              className="relative flex-none w-80 rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              {/* Image with overlay */}
              <div className="relative h-48">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {card.description}
                </p>

                {/* Points */}
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {card.points.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
