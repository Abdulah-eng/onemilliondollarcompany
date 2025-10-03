import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LibraryCategory } from '@/mockdata/library/mockLibrary';

export interface LibraryRow {
  id: string;
  coach_id: string;
  category: LibraryCategory;
  name: string;
  introduction: string | null;
  hero_image_url: string | null;
  details: any;
  created_at: string;
  updated_at: string;
}

export const useCoachLibrary = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<LibraryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('library_items')
        .select('*')
        .eq('coach_id', user.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      setItems((data || []) as LibraryRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load library');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const upsertItem = async (payload: Partial<LibraryRow> & { id?: string }) => {
    if (!user) throw new Error('Not authenticated');
    if (payload.id) {
      const { data, error } = await supabase
        .from('library_items')
        .update({
          name: payload.name,
          category: payload.category,
          introduction: payload.introduction ?? null,
          hero_image_url: (payload as any).heroImageUrl ?? payload.hero_image_url ?? null,
          details: payload.details ?? null,
        })
        .eq('id', payload.id)
        .eq('coach_id', user.id)
        .select('*')
        .single();
      if (error) throw error;
      await fetchItems();
      return data as LibraryRow;
    }
    const { data, error } = await supabase
      .from('library_items')
      .insert({
        coach_id: user.id,
        name: payload.name,
        category: payload.category as LibraryCategory,
        introduction: payload.introduction ?? null,
        hero_image_url: (payload as any).heroImageUrl ?? payload.hero_image_url ?? null,
        details: payload.details ?? null,
      })
      .select('*')
      .single();
    if (error) throw error;
    await fetchItems();
    return data as LibraryRow;
  };

  const removeItem = async (id: string) => {
    if (!user) throw new Error('Not authenticated');
    const { error } = await supabase
      .from('library_items')
      .delete()
      .eq('id', id)
      .eq('coach_id', user.id);
    if (error) throw error;
    await fetchItems();
    return true;
  };

  return { items, loading, error, refetch: fetchItems, upsertItem, removeItem };
};


