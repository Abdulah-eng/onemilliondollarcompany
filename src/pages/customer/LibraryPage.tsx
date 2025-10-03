// src/pages/customer/LibraryPage.tsx

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

import LibraryCard, { LibraryItem } from "@/components/customer/library/LibraryCard";
import LibraryDetailView from "@/components/customer/library/LibraryDetailView";

type LibraryTab = 'all' | 'fitness' | 'nutrition' | 'mental';

export default function LibraryPage() {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<LibraryTab>('all');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchLibraryItems = async () => {
      if (!profile?.coach_id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Only fetch library items from the customer's assigned coach
        const { data } = await supabase
          .from('library_items')
          .select('id, category, name, hero_image_url, details')
          .eq('coach_id', profile.coach_id)
          .order('updated_at', { ascending: false })
          .limit(100);
          
        const mapped = (data || []).map((row: any) => ({
          id: row.id,
          type: row.category === 'exercise' ? 'fitness' : row.category === 'recipe' ? 'nutrition' : 'mental',
          name: row.name,
          imageUrl: row.hero_image_url,
          data: row.details || {},
        })) as LibraryItem[];
        
        setLibraryItems(mapped);
      } catch (error) {
        console.error('Error fetching library items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryItems();
  }, [profile?.coach_id]);

  const filteredItems = useMemo(() => {
    return libraryItems
      .filter(item => {
        if (activeTab === 'all') return true;
        return item.type === activeTab;
      })
      .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, activeTab, libraryItems]);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Library</h1>
          <p className="text-muted-foreground text-lg">Loading your coach's content...</p>
        </div>
      </div>
    );
  }

  if (!profile?.coach_id) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Library</h1>
          <p className="text-muted-foreground text-lg">You need to be assigned to a coach to access the library.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Library</h1>
        <p className="text-muted-foreground text-lg">Explore exercises, recipes, and wellness guides from your coach.</p>
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
