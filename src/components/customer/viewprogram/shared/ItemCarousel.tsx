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
            <button
              key={item.id}
              onClick={() => onSelectItem(item.id)}
              className={cn(
                "relative flex-shrink-0 w-24 h-24 rounded-full transition-all duration-200 focus:outline-none",
                // A ring is better for highlighting circles than a border
                isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "ring-0"
              )}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center rounded-full"
                style={{ backgroundImage: `url(${item.imageUrl})` }}
              />
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-full" />
              
              {/* Muted Overlay and Checkmark when Completed */}
              {item.isCompleted && (
                 <div className="absolute inset-0 bg-primary/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Check className="h-10 w-10 text-primary-foreground" />
                 </div>
              )}

              {/* Label Text */}
              <span className="absolute bottom-3 left-0 right-0 px-1 text-center text-xs font-semibold text-white truncate">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
