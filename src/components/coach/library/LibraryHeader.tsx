'use client';

import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { LibraryCategory } from '@/mockdata/library/mockLibrary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface LibraryHeaderProps {
  activeCategory: LibraryCategory;
  onCategoryChange: (cat: LibraryCategory) => void; // Added for category control
  onSearch: (term: string) => void;
  itemCount: number;
}

const allCategories: LibraryCategory[] = ['exercise', 'recipe', 'mental health'];

const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  activeCategory,
  onCategoryChange,
  onSearch,
  itemCount,
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
    onCategoryChange(null as unknown as LibraryCategory); // Use a mechanism to clear category
  };

  return (
    <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-30 pt-6 pb-4 -mx-4 px-4 md:-mx-8 md:px-8">
      <h1 className="text-3xl font-extrabold mb-4 text-center md:text-left">Your Library 📚</h1>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Main Search Input */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content (e.g. 'Push-ups', 'Keto')"
            className="w-full pl-10 pr-10 h-12 rounded-xl border-2 shadow-inner transition-shadow focus-within:shadow-md"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter/Category Popover (Mobile/Desktop) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl flex-shrink-0 border-2"
              aria-label="Filter content"
            >
              <Filter className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 space-y-3" align="end">
            <h4 className="font-semibold text-lg">Filter by Category</h4>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => (
                <Badge
                  key={cat}
                  variant={activeCategory === cat ? 'default' : 'secondary'}
                  className="cursor-pointer capitalize px-3 py-1 text-sm transition-colors"
                  onClick={() => onCategoryChange(cat)}
                >
                  {cat.replace('mental health', 'Wellness')}
                </Badge>
              ))}
              {activeCategory && (
                <Badge
                  variant="outline"
                  className="cursor-pointer px-3 py-1 text-sm transition-colors text-destructive border-destructive hover:bg-destructive/10"
                  onClick={clearCategory}
                >
                  Clear Filter
                </Badge>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filter Display */}
      <div className="mt-3 flex items-center space-x-2 text-sm text-muted-foreground">
        <span className="font-medium">{itemCount} items</span>
        {activeCategory && (
          <Badge
            className="capitalize bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
            onClick={clearCategory}
          >
            {activeCategory.replace('mental health', 'Wellness')} <X className="h-3 w-3 ml-1" />
          </Badge>
        )}
      </div>
    </div>
  );
};

export default LibraryHeader;
