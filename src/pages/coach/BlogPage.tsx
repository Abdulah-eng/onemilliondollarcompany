'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogPost, BlogCategory } from '@/mockdata/blog/mockBlog';
import { useCoachBlog } from '@/hooks/useCoachBlog';
import BlogHeader from '@/components/coach/blog/BlogHeader';
import BlogList from '@/components/coach/blog/BlogList';
import BlogFAB from '@/components/coach/blog/BlogFAB';
import BlogCreatorPage from './BlogCreatorPage';

type BlogView = 'list' | 'creator';

const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | null>(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [blogData, setBlogData] = useState<BlogPost[]>([]);
  const { posts, createOrUpdate, remove, refetch } = useCoachBlog();

  useEffect(() => {
    // Map db posts to UI type
    const mapped = (posts || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      introduction: p.introduction || '',
      content: p.content || '',
      category: p.category || null,
      coverUrl: p.cover_url || null,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    })) as BlogPost[];
    setBlogData(mapped);
  }, [posts]);
  const [view, setView] = useState<BlogView>('list');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const filteredPosts = useMemo(() => {
    return blogData.filter(post => {
      const categoryMatch = !activeCategory || post.category === activeCategory;
      const searchMatch = !searchTerm ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.introduction.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [blogData, activeCategory, searchTerm]);

  const handleCategoryChange = useCallback((cat: BlogCategory | null) => {
    setActiveCategory(cat);
    setSearchTerm('');
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleNewPost = () => { 
    setEditingPost(null);
    setView('creator');
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setView('creator');
  };

  const handleBackToList = () => setView('list');

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Delete this blog post?')) {
      await remove(id);
      refetch();
    }
  };

  const handlePostSubmit = async (newPost: BlogPost) => {
    await createOrUpdate({
      id: newPost.id?.startsWith('mock') ? undefined : newPost.id,
      title: newPost.title,
      introduction: newPost.introduction,
      content: newPost.content,
      category: newPost.category,
      cover_url: (newPost as any).coverUrl || null,
    });
    setView('list');
    refetch();
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl relative"> 
      <AnimatePresence mode="wait">
        <motion.div key={view} className="w-full">
          {view === 'list' ? (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <BlogHeader
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                onSearch={handleSearch}
                itemCount={filteredPosts.length}
              />
              <BlogList
                filteredPosts={filteredPosts}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            </motion.div>
          ) : (
            <BlogCreatorPage
                onBack={handleBackToList}
                onSubmit={handlePostSubmit}
                initialPost={editingPost}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      {view === 'list' && (
        <BlogFAB onActionClick={handleNewPost} />
      )}
    </div>
  );
};

export default BlogPage;
