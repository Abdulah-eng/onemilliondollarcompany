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
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        {items.map((item) => {
          const isSelected = item.id === selectedItemId;

          return (
            <div key={item.id} className="flex-shrink-0 flex flex-col items-center">
                <button
                    onClick={() => onSelectItem(item.id)}
                    className={cn(
                        "relative flex-shrink-0 w-20 h-20 rounded-full transition-all duration-200 focus:outline-none mb-2",
                        // The button itself will now always provide a small amount of "safe space"
                        // inside, ensuring the ring and offset render correctly.
                        // We remove the conditional padding from here.
                        isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "ring-0"
                    )}
                >
                    {/* Background Image Container */}
                    {/* ✅ FIXED: Added padding to the image container itself when selected.
                             This creates the internal space needed for the ring to draw without clipping. */}
                    <div
                        className={cn(
                            "absolute inset-0 bg-cover bg-center rounded-full",
                            isSelected && "p-1.5" // Adjust this padding value if needed
                        )}
                        style={{ backgroundImage: `url(${item.imageUrl})` }}
                    />
                    
                    {/* Gradient Overlay for visual effect (optional, can be removed) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full" />
                    
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
