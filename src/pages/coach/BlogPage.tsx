'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogPost, BlogCategory, mockBlogPosts } from '@/mockdata/blog/mockBlog';
import BlogHeader from '@/components/coach/blog/BlogHeader';
import BlogList from '@/components/coach/blog/BlogList';
import BlogFAB from '@/components/coach/blog/BlogFAB';
import BlogCreatorPage from './BlogCreatorPage'; // Import the new creator page

type BlogView = 'list' | 'creator';

const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | null>(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [blogData, setBlogData] = useState<BlogPost[]>(mockBlogPosts);
  const [view, setView] = useState<BlogView>('list');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Filtering Logic (remains the same)
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

  // Handlers (updated for single FAB action)
  const handleCategoryChange = useCallback((cat: BlogCategory | null) => {
    setActiveCategory(cat);
    setSearchTerm('');
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // FAB action simplified: no category needed initially
  const handleNewPost = () => { 
    setEditingPost(null);
    setView('creator');
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setView('creator');
  };

  const handleBackToList = () => setView('list');

  const handleDeletePost = (id: string) => {
    if (window.confirm('Delete this blog post?')) {
      setBlogData(prev => prev.filter(post => post.id !== id));
    }
  };

  // Submit handler (remains the same)
  const handlePostSubmit = (newPost: BlogPost) => {
    setBlogData(prev => {
      const i = prev.findIndex(post => post.id === newPost.id);
      if (i > -1) {
        const updated = [...prev];
        updated[i] = newPost;
        return updated;
      }
      return [...prev, newPost];
    });
    setView('list');
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
