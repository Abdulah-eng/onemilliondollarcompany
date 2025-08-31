// src/components/customer/viewprogram/shared/ItemCarousel.tsx

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

// A generic interface for any item that can be displayed in the carousel
export interface CarouselItem {
  id: string;
  imageUrl: string;
  label: string;
  isCompleted: boolean;
}

interface ItemCarouselProps {
  items: CarouselItem[];
  selectedItemId: string;
  onSelectItem: (id: string) => void;
}

export default function ItemCarousel({ items, selectedItemId, onSelectItem }: ItemCarouselProps) {
  return (
    <div className="relative">
      {/* Allow horizontal scrolling but keep vertical overflow visible so ring isn't clipped */}
      <div className="flex space-x-4 overflow-x-auto overflow-y-visible pb-6 scrollbar-hide -mx-4 px-4">
        {items.map((item) => {
          const isSelected = item.id === selectedItemId;

          return (
            // Give each item a bit of horizontal padding and allow overflow (so ring can extend)
            <div key={item.id} className="flex-shrink-0 flex flex-col items-center px-2 overflow-visible">
                <button
                    onClick={() => onSelectItem(item.id)}
                    aria-pressed={isSelected}
                    className={cn(
                        "relative flex-shrink-0 w-20 h-20 rounded-full transition-all duration-200 focus:outline-none mb-2 overflow-visible",
                        // make sure selected item has higher z-index so ring shows above overlays
                        isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background z-10" : "ring-0"
                    )}
                >
                    {/* Background Image Container */}
                    <div
                        className={cn(
                            "absolute inset-0 bg-cover bg-center rounded-full",
                            isSelected && "p-1.5" // internal padding so image doesn't overlap the ring
                        )}
                        style={{ backgroundImage: `url(${item.imageUrl})` }}
                    />
                    
                    {/* Gradient Overlay for visual effect (non-interactive) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full pointer-events-none" />
                    
                    {/* Muted Overlay and Checkmark when Completed */}
                    {item.isCompleted && (
                        <div className="absolute inset-0 bg-primary/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Check className="h-8 w-8 text-primary-foreground" />
                        </div>
                    )}
                </button>

                {/* Label Text - now placed outside and below the button */}
                <span className="text-center text-xs font-semibold text-foreground max-w-[80px] leading-tight">
                    {item.label}
                </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
