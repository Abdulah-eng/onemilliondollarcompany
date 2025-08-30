// src/components/customer/library/exercises/ExerciseGuide.tsx

import { ExerciseGuide as ExerciseGuideData } from "@/mockdata/library/mockexercises";
// ✅ Import the new optimized media component
import OptimizedMedia from "@/components/ui/OptimizedMedia";
// ✅ Import Accordion components from your UI library
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ExerciseGuideProps {
  guide: ExerciseGuideData;
}

// A small helper component for cleanly styled list items
const InfoListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <span className="mt-1 text-primary">▪</span>
    <span className="flex-1 text-muted-foreground">{children}</span>
  </li>
);

export default function ExerciseGuide({ guide }: ExerciseGuideProps) {
  return (
    <div className="space-y-6">
      {/* ✅ 1. Optimized Media Player */}
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-muted shadow-lg">
        <OptimizedMedia
          imageUrl={guide.imageUrl}
          videoUrl={guide.videoUrl}
          alt={guide.name}
        />
      </div>

      <div className="px-2">
        <h2 className="text-3xl font-bold tracking-tight">{guide.name}</h2>
        <p className="mt-2 text-muted-foreground">{guide.description}</p>
      </div>

      {/* ✅ 2. Appealing Accordion Layout */}
      <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-semibold">💪 What it's good for</AccordionTrigger>
          <AccordionContent className="pt-2">
            <ul className="space-y-2">
              {guide.benefits.map((benefit, i) => <InfoListItem key={i}>{benefit}</InfoListItem>)}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg font-semibold">🧠 How to do it</AccordionTrigger>
          <AccordionContent className="pt-2">
            <ol className="space-y-4">
              {guide.instructions.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-xs text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </AccordionContent>
        </AccordionItem>

        {guide.proTip && (
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold">💡 Pro tip</AccordionTrigger>
            <AccordionContent className="pt-2 text-muted-foreground">
              {guide.proTip}
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-lg font-semibold">⚠️ Avoid these mistakes</AccordionTrigger>
          <AccordionContent className="pt-2">
            <ul className="space-y-2">
              {guide.commonMistakes.map((mistake, i) => (
                 <li key={i} className="flex items-start gap-3">
                    <span className="mt-1">❌</span>
                    <span className="flex-1 text-muted-foreground">{mistake}</span>
                 </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-5" className="border-b-0">
          <AccordionTrigger className="text-lg font-semibold">🎯 For best results</AccordionTrigger>
          <AccordionContent className="pt-2">
            <ul className="space-y-2">
              {guide.forBestResults.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1">✅</span>
                  <span className="flex-1 text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
