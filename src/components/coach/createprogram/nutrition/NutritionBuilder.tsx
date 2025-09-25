// src/components/coach/createprogram/nutrition/NutritionBuilder.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, ArrowLeft } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import DateCircles from '../builders/DateCircles'; // Reused
import RecipeLibrary from './RecipeLibrary'; // New
import NutritionDay, { NutritionDayItem, MealSection } from './NutritionDay'; // New
import NutritionSummary from './NutritionSummary'; // New/Adapted
import { mockRecipes, RecipeItem, MealType, IngredientType } from '@/mockdata/createprogram/mockRecipes';

// Initial state for a day's nutrition plan
const initialDayData = (): { [key in MealSection]: NutritionDayItem[] } => ({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
    nightsnack: [],
});

interface NutritionBuilderProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

const NutritionBuilder: React.FC<NutritionBuilderProps> = ({ onBack, onSave }) => {
  const [activeDay, setActiveDay] = useState('Monday');
  const [nutritionData, setNutritionData] = useState<{ [day: string]: { [key in MealSection]: NutritionDayItem[] } }>({
      'Monday': initialDayData(),
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RecipeItem[]>(mockRecipes);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [lastSelectedSection, setLastSelectedSection] = useState<MealSection>('breakfast');

  // Ensure initial data exists for the active day
  useEffect(() => {
    if (!nutritionData[activeDay]) {
        setNutritionData(prev => ({
            ...prev,
            [activeDay]: initialDayData(),
        }));
    }
  }, [activeDay, nutritionData]);

  // Handle data update for the active day
  const handleUpdateDayData = useCallback((day: string, data: { [key in MealSection]: NutritionDayItem[] }) => {
    setNutritionData(prevData => ({
      ...prevData,
      [day]: data,
    }));
  }, []);

  // Handle recipe search with enhanced filtering
  const handleSearch = useCallback((query: string, mealTypeFilter?: MealType | 'all', ingredientType?: IngredientType | 'all') => {
    let filtered = mockRecipes;

    if (mealTypeFilter && mealTypeFilter !== 'all') {
      filtered = filtered.filter(recipe => recipe.mealTypes.includes(mealTypeFilter as MealType));
    }

    if (ingredientType && ingredientType !== 'all') {
      filtered = filtered.filter(recipe => recipe.ingredientTypes.includes(ingredientType as IngredientType));
    }

    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm) ||
        recipe.ingredientTypes.some(type => type.toLowerCase().includes(searchTerm))
      );
    }

    setSearchResults(filtered);
  }, []);

  useEffect(() => {
    // Initial search when component mounts
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const handleSelectRecipe = (recipe: RecipeItem) => {
    const newItem: NutritionDayItem = {
      id: `${recipe.id}-${Date.now()}`,
      recipe: recipe,
      time: '', // Blank by default
      comment: '',
      portionSize: '1 serving', // Default
    };
    
    // Determine the section to add the recipe to
    // Default to the last used section, or the first matching mealType, or 'breakfast'
    const targetSection: MealSection = recipe.mealTypes.includes(lastSelectedSection)
        ? lastSelectedSection
        : (recipe.mealTypes.find(type => ['breakfast', 'lunch', 'dinner', 'snack', 'nightsnack'].includes(type)) as MealSection) || 'breakfast';

    // Update state
    const currentDayData = nutritionData[activeDay] || initialDayData();
    const itemsForSection = currentDayData[targetSection]
        ? [...currentDayData[targetSection], newItem]
        : [newItem];
        
    handleUpdateDayData(activeDay, { ...currentDayData, [targetSection]: itemsForSection });
    
    // Set last selected section for next click
    setLastSelectedSection(targetSection);
    setIsSheetOpen(false);
  };
  
  const currentDayData = nutritionData[activeDay] || initialDayData();

  // Helper function to open the sheet and set the target section
  const handleOpenSheet = () => {
      // In the nutrition builder, the library should open and the user will select a recipe, 
      // which will then be added based on the recipe's meal type. 
      // We don't need to specify the section here, only when adding.
      setIsSheetOpen(true); 
  };
  
  // Note: DateCircles is reused directly
  // Note: Page header is handled by the parent component (in a real app) or the component wrapping this builder.
  // Here, we keep the in-builder header as per FitnessBuilder.tsx structure.

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col"
    >
      {/* Global Header */}
      <div className="flex items-center justify-between p-4 bg-card rounded-xl shadow-md border mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          size="sm"
          onClick={() => onSave(nutritionData)}
          className="gap-2 shrink-0"
        >
          <Check className="h-4 w-4" /> Save Program
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-5 lg:gap-4 bg-card rounded-xl shadow-md border overflow-hidden">
        
        {/* Date Selector Header (Desktop only) */}
        <div className="hidden lg:block lg:col-span-5 border-b border-border p-4">
          <DateCircles activeDay={activeDay} onDayChange={setActiveDay} />
        </div>

        {/* Left Column: Recipe Library (Desktop only) */}
        <div className="hidden lg:block lg:col-span-1 border-r border-border min-h-full overflow-y-auto bg-muted/20">
          <RecipeLibrary
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            onSelect={handleSelectRecipe}
            onSearch={handleSearch}
            allRecipes={mockRecipes}
          />
        </div>

        {/* Middle Column: Nutrition Day */}
        <div className="lg:col-span-3 flex-1 p-4 md:p-6 lg:p-8 space-y-4 overflow-y-auto">
          {/* Date selector (mobile/tablet only) */}
          <div className="mb-4 lg:hidden">
            <DateCircles activeDay={activeDay} onDayChange={setActiveDay} />
          </div>

          <NutritionDay
            day={activeDay}
            data={currentDayData}
            onDataChange={items => handleUpdateDayData(activeDay, items)}
            onAddClick={handleOpenSheet}
          />
        </div>

        {/* Right Column: Day Summary (Desktop only) */}
        <div className="hidden lg:block lg:col-span-1 border-l border-border min-h-full overflow-y-auto">
          <NutritionSummary data={currentDayData} activeDay={activeDay} />
        </div>
      </div>

      {/* Mobile / Tablet Bottom Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-[85vh] sm:h-[80vh] overflow-hidden pb-safe">
          <SheetHeader className="pb-4 border-b sticky top-0 bg-background z-10">
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-2" />
            <SheetTitle className="text-lg font-semibold">Add Recipe</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100%-80px)] overflow-hidden mt-4">
            <RecipeLibrary
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchResults={searchResults}
              onSelect={handleSelectRecipe}
              onSearch={handleSearch}
              allRecipes={mockRecipes}
            />
          </div>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};

export default NutritionBuilder;
