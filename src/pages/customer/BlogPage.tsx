import { useState } from 'react';
import { blogPosts } from '@/mockdata/blog/blogData';
import BlogPost from '@/components/customer/blog/BlogPost';
import TodaysPostHero from '@/components/customer/blog/TodaysPostHero';
import BlogTimeline from '@/components/customer/blog/BlogTimeline';
import { AnimatePresence, motion } from 'framer-motion';

const BlogPage = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  // The latest post is the first one in the mock data
  const latestPost = blogPosts[0];
  const previousPosts = blogPosts.slice(1);

  const handleReadMore = (slug) => {
    const post = blogPosts.find(p => p.slug === slug);
    setSelectedPost(post);
  };

  const handleBack = () => {
    setSelectedPost(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-12">
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
            {/* Today's Post Hero */}
            <TodaysPostHero post={latestPost} onReadMore={handleReadMore} />

            {/* Timeline for Previous Posts */}
            <div className="mt-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Previous Posts</h2>
              <p className="text-muted-foreground">Catch up on past articles and tips.</p>
            </div>
            <BlogTimeline posts={previousPosts} onReadMore={handleReadMore} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogPage;
