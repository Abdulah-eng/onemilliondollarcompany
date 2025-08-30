// src/components/customer/library/exercises/ExerciseGuide.tsx

import { ExerciseGuide as ExerciseGuideData } from "@/mockdata/library/mockexercises";

interface ExerciseGuideProps {
  guide: ExerciseGuideData;
}

export default function ExerciseGuide({ guide }: ExerciseGuideProps) {
  return (
    <div className="space-y-6 rounded-2xl bg-card border p-6 text-card-foreground">
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted">
        <img src={guide.imageUrl} alt={guide.name} className="h-full w-full object-cover" />
      </div>

      <h2 className="text-2xl font-bold">{guide.name}</h2>

      <div>
        <h3 className="mb-2 text-lg font-semibold">💪 What it's good for:</h3>
        <p className="text-muted-foreground">{guide.description}</p>
        <p className="mt-4 font-semibold">Perfect if you want to:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
          {guide.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold">🧠 How to do it:</h3>
        <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
          {guide.instructions.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
      </div>

      {guide.proTip && (
        <div>
          <h3 className="mb-2 text-lg font-semibold">💡 Pro tip:</h3>
          <p className="text-muted-foreground">{guide.proTip}</p>
        </div>
      )}

      <div>
        <h3 className="mb-2 text-lg font-semibold">⚠️ Avoid these mistakes:</h3>
        <ul className="space-y-1 text-muted-foreground">
          {guide.commonMistakes.map((mistake, i) => <li key={i}>❌ {mistake}</li>)}
        </ul>
      </div>
      
      <div>
        <h3 className="mb-2 text-lg font-semibold">🎯 For best results:</h3>
        <ul className="space-y-1 text-muted-foreground">
          {guide.forBestResults.map((tip, i) => <li key={i}>✅ {tip}</li>)}
        </ul>
      </div>
    </div>
  );
}
