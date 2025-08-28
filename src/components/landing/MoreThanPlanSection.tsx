import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MORE_THAN_PLAN_FEATURES } from '@/mockdata/landingpage/morethanplan';

export default function MoreThanPlanSection() {
  const [activeTab, setActiveTab] = useState(MORE_THAN_PLAN_FEATURES[0].id);
  const activeFeature = MORE_THAN_PLAN_FEATURES.find(
    (feature) => feature.id === activeTab
  );

  return (
    <section className="relative py-20 bg-background dark:bg-slate-900/20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-12 items-center"
          data-reveal
        >
          <div>
            <p className="mb-2 font-semibold text-primary">Everything You Need</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-foreground">
              More Than Just a Plan
            </h2>
          </div>
          <div>
            <p className="text-lg text-muted-foreground">
              Go beyond workouts. Learn, connect, reflect, and track your full wellness journey with tools designed to support lasting change.
            </p>
          </div>
        </div>

        {/* Interactive Tab Buttons */}
        <div className="mb-12 grid grid-cols-2 lg:grid-cols-4 gap-4" data-reveal>
          {MORE_THAN_PLAN_FEATURES.map((feature) => {
            const IconComponent = feature.icon; // Assign component to a capitalized variable
            return (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={cn(
                  'flex flex-col sm:flex-row items-center justify-center text-center gap-3 p-4 rounded-xl border transition-all duration-300',
                  activeTab === feature.id
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                {/* Render the component and pass props here */}
                <IconComponent className="w-6 h-6" />
                <span className="font-semibold">{feature.tabName}</span>
              </button>
            );
          })}
        </div>

        {/* Content Display based on Active Tab */}
        {activeFeature && (
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
            data-reveal
            key={activeFeature.id} // Re-triggers animation on change
          >
            {/* Text Content */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold tracking-tight text-foreground">
                {activeFeature.title}
              </h3>
              <p className="text-lg text-muted-foreground">
                {activeFeature.description}
              </p>
              <ul className="space-y-3">
                {activeFeature.points.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-6 h-6 text-primary flex-shrink-0 mr-3 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image Content */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[400px]">
              <img
                src={activeFeature.image}
                alt={activeFeature.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        )}

        <p className="mt-12 text-center text-sm text-muted-foreground" data-reveal>
          *Access to features like Coach Feedback and advanced tracking is available on our Premium plan.
        </p>
      </div>
    </section>
  );
}
