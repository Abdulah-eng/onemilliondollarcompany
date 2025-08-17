import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MultiSelectButtonProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export const MultiSelectButton = ({ children, selected = false, onClick }: MultiSelectButtonProps) => {
  return (
    <Button
      type="button"
      variant={selected ? "default" : "outline"}
      onClick={onClick}
      className={cn(
        "h-auto px-4 py-2 text-sm font-semibold transition-all",
        selected 
          ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700" 
          : "bg-white text-gray-700 border-gray-300 hover:bg-emerald-50 hover:border-emerald-400"
      )}
    >
      {children}
    </Button>
  );
};
