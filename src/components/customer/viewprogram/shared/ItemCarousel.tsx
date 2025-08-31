import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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
                // ✅ Size reduced from w-24 h-24 to w-20 h-20
                "relative flex-shrink-0 w-20 h-20 rounded-full transition-all duration-200 focus:outline-none",
                isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "ring-0"
              )}
            >
              <div
                className="absolute inset-0 bg-cover bg-center rounded-full"
                style={{ backgroundImage: `url(${item.imageUrl})` }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-full" />
              
              {item.isCompleted && (
                 <div className="absolute inset-0 bg-primary/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                    {/* ✅ Checkmark size reduced */}
                    <Check className="h-8 w-8 text-primary-foreground" />
                 </div>
              )}

              {/* ✅ Label text updated to allow wrapping */}
              <span className="absolute bottom-2 left-0 right-0 px-2 text-center text-xs font-semibold text-white whitespace-normal leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
