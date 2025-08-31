// src/pages/customer/LibraryPage.tsx

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

// Import all your mock data
import { mockExerciseGuides } from "@/mockdata/library/mockexercises";
import { mockRecipes } from "@/mockdata/library/mockrecipes";
import { mockMentalHealthGuides } from "@/mockdata/library/mockmentalexercises";

import LibraryCard, { LibraryItem } from "@/components/customer/library/LibraryCard";
import LibraryDetailView from "@/components/customer/library/LibraryDetailView";

type LibraryTab = 'all' | 'fitness' | 'nutrition' | 'mental';

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<LibraryTab>('all');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

   useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const libraryItems = useMemo<LibraryItem[]>(() => {
    const exercises = mockExerciseGuides.map(item => ({ id: item.id, type: 'fitness' as const, name: item.name, imageUrl: item.imageUrl, data: item }));
    const recipes = mockRecipes.map(item => ({ id: item.id, type: 'nutrition' as const, name: item.name, imageUrl: item.imageUrl, data: item }));
    const mental = mockMentalHealthGuides.map(item => ({ id: item.id, type: 'mental' as const, name: item.name, imageUrl: item.imageUrl, data: item }));
    return [...exercises, ...recipes, ...mental];
  }, []);

  const filteredItems = useMemo(() => {
    return libraryItems
      .filter(item => {
        if (activeTab === 'all') return true;
        return item.type === activeTab;
      })
      .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, activeTab, libraryItems]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Library</h1>
        <p className="text-muted-foreground text-lg">Explore exercises, recipes, and wellness guides.</p>
      </div>

      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-4 space-y-4">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for an exercise or recipe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base rounded-full"
          />
        </div>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LibraryTab)} className="flex justify-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="fitness">Fitness</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="mental">Mental Health</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <LibraryCard key={`${item.type}-${item.id}`} item={item} onClick={() => setSelectedItem(item)} />
        ))}
      </div>

      {filteredItems.length === 0 && (
         <div className="p-8 text-center border border-dashed rounded-2xl text-gray-500">
           <p>No items found for your search.</p>
         </div>
      )}

      <LibraryDetailView 
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isMobile={isMobile}
      />
    </div>
  );
}
