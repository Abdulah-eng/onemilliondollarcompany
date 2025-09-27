'use client';

import React, { useState } from 'react';
import { Search, Filter, X, Zap, Utensils, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { LibraryCategory } from '@/mockdata/library/mockLibrary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility

interface LibraryHeaderProps {
  activeCategory: LibraryCategory | null; // Allow null for "All"
  onCategoryChange: (cat: LibraryCategory | null) => void;
  onSearch: (term: string) => void;
  itemCount: number;
  totalItemCount: number;
}

const CATEGORY_MAP: { [key in LibraryCategory]: { label: string; emoji: string; icon: React.ElementType } } = {
  'exercise': { label: 'Fitness 💪', emoji: '💪', icon: Zap },
  'recipe': { label: 'Recipes 🍎', emoji: '🍎', icon: Utensils },
  'mental health': { label: 'Wellness 🧘', emoji: '🧘', icon: Heart },
};
const allCategories: LibraryCategory[] = ['exercise', 'recipe', 'mental health'];

const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  activeCategory,
  onCategoryChange,
  onSearch,
  itemCount,
  totalItemCount,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  const clearCategory = () => {
    onCategoryChange(null);
  };

  const activeCategoryLabel = activeCategory ? CATEGORY_MAP[activeCategory].label : 'All Content ✨';

  return (
    <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-30 pt-6 pb-4 -mx-4 px-4 md:-mx-8 md:px-8">
      <h1 className="text-4xl font-extrabold mb-4 text-center md:text-left">Your Library {activeCategory ? CATEGORY_MAP[activeCategory].emoji : '📚'}</h1>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Main Search Input */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={`Search ${activeCategory ? CATEGORY_MAP[activeCategory].label : 'all content'}...`}
            className="w-full pl-12 pr-10 h-14 rounded-2xl border-2 shadow-inner bg-card/80 transition-all text-base"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full text-muted-foreground hover:bg-muted"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Filter/Category Popover (Modern Dropdown/Filter) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("h-14 rounded-2xl flex-shrink-0 border-2 px-4 space-x-2", 
                activeCategory ? 'border-primary text-primary hover:bg-primary/10' : 'text-foreground'
              )}
              aria-label="Filter content"
            >
              <Filter className="h-5 w-5" />
              <span className='hidden sm:inline'>{activeCategory ? CATEGORY_MAP[activeCategory].emoji : 'Filter'}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 space-y-3 rounded-xl shadow-2xl" align="end">
            <h4 className="font-bold text-lg">Filter by Type 💡</h4>
            <div className="flex flex-col gap-2">
                {/* Option to clear filter/show all */}
                <Button
                    variant={!activeCategory ? 'default' : 'ghost'}
                    className='w-full justify-start text-base'
                    onClick={clearCategory}
                >
                    <Zap className="h-5 w-5 mr-3" /> All Content
                </Button>
              {allCategories.map((cat) => {
                const { label, icon: Icon } = CATEGORY_MAP[cat];
                return (
                    <Button
                        key={cat}
                        variant={activeCategory === cat ? 'default' : 'ghost'}
                        className='w-full justify-start text-base'
                        onClick={() => onCategoryChange(cat)}
                    >
                        <Icon className="h-5 w-5 mr-3" /> {label}
                    </Button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filter Display */}
      <div className="mt-3 flex items-center space-x-2 text-sm text-muted-foreground">
        <span className="font-medium text-lg text-foreground">{itemCount} items</span>
        <span className='text-xl font-light text-muted-foreground'>|</span>
        <Badge
            className={cn(
                "capitalize px-3 py-1 text-sm font-semibold transition-all shadow-sm",
                !activeCategory ? 'bg-primary/10 text-primary border-primary/30' : 'bg-muted text-muted-foreground hover:bg-muted-foreground/20 cursor-pointer'
            )}
            onClick={activeCategory ? clearCategory : undefined}
        >
            {activeCategoryLabel}
            {activeCategory && <X className="h-3 w-3 ml-2" />}
        </Badge>
      </div>
    </div>
  );
};

export default LibraryHeader;
