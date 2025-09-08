import { useState } from 'react';
import { blogPosts } from '@/mockdata/blog/blogData';
import BlogCard from '@/components/customer/blog/BlogCard';
import BlogPost from '@/components/customer/blog/BlogPost';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const categories = ['All', 'Fitness', 'Nutrition', 'Mental Health'];

const BlogPage = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  const handleReadMore = (slug) => {
    const post = blogPosts.find(p => p.slug === slug);
    setSelectedPost(post);
  };

  const handleBack = () => {
    setSelectedPost(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Coach's Blog
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Expert insights on fitness, nutrition, and mental health from your coach.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {selectedPost ? (
          <motion.div
            key="blog-post-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <BlogPost post={selectedPost} onBack={handleBack} />
          </motion.div>
        ) : (
          <motion.div
            key="blog-list-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="cursor-pointer transition-colors duration-200"
                >
                  {category}
                </Badge>
              ))}
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <BlogCard
                  key={post.id}
                  post={post}
                  onReadMore={handleReadMore}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogPage;
