import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface BlogPostRow {
  id: string;
  coach_id: string;
  title: string;
  introduction: string | null;
  content: string | null;
  category: string | null;
  cover_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const useCoachBlog = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('coach_id', user.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      setPosts((data || []) as BlogPostRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, [user?.id]);

  const createOrUpdate = async (payload: Partial<BlogPostRow> & { id?: string; isPublished?: boolean }) => {
    if (!user) throw new Error('Not authenticated');
    if (payload.id) {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          title: payload.title,
          introduction: payload.introduction ?? null,
          content: payload.content ?? null,
          category: payload.category ?? null,
          cover_url: payload.cover_url ?? null,
          is_published: payload.isPublished ?? false,
        })
        .eq('id', payload.id)
        .eq('coach_id', user.id)
        .select('*')
        .single();
      if (error) throw error;
      await fetchPosts();
      return data as BlogPostRow;
    }
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        coach_id: user.id,
        title: payload.title,
        introduction: payload.introduction ?? null,
        content: payload.content ?? null,
        category: payload.category ?? null,
        cover_url: payload.cover_url ?? null,
        is_published: payload.isPublished ?? false,
      })
      .select('*')
      .single();
    if (error) throw error;
    await fetchPosts();
    return data as BlogPostRow;
  };

  const remove = async (id: string) => {
    if (!user) throw new Error('Not authenticated');
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)
      .eq('coach_id', user.id);
    if (error) throw error;
    await fetchPosts();
    return true;
  };

  return { posts, loading, error, refetch: fetchPosts, createOrUpdate, remove };
};


