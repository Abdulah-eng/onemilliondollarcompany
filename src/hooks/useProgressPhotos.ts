import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ProgressPhoto {
  id: string;
  image_url: string;
  date: string;
  notes?: string;
  created_at: string;
}

export const useProgressPhotos = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('progress_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress photos');
    } finally {
      setLoading(false);
    }
  };

  const addProgressPhoto = async (imageUrl: string, notes?: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('progress_photos')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          date: new Date().toISOString().split('T')[0], // Today's date
          notes
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setPhotos(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add progress photo');
      throw err;
    }
  };

  const getLatestPhoto = () => {
    return photos.length > 0 ? photos[0] : null;
  };

  const getPhotoHistory = (days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return photos.filter(photo => 
      new Date(photo.date) >= cutoffDate
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  useEffect(() => {
    fetchPhotos();
  }, [user]);

  return {
    photos,
    loading,
    error,
    addProgressPhoto,
    getLatestPhoto,
    getPhotoHistory,
    refetch: fetchPhotos
  };
};
