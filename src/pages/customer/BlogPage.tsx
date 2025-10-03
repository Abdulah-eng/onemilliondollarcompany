import { useEffect, useState } from 'react';
import useMediaQuery from '@/hooks/use-media-query';
import { supabase } from '@/integrations/supabase/client';
import BlogPost from '@/components/customer/blog/BlogPost';
import FeaturedPost from '@/components/customer/blog/FeaturedPost';
import BlogTimeline from '@/components/customer/blog/BlogTimeline';
import BlogTimelineSheet from '@/components/customer/blog/BlogTimelineSheet';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

const BlogPage = () => {
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isTimelineOpen, setIsTimelineOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 1024px)'); // Corresponds to lg breakpoint
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        supabase
          .from('blog_posts')
          .select('*')
          .order('updated_at', { ascending: false })
          .then(({ data }) => setPosts(data || []));
    }, []);

    const latestPost = posts[0];
    const previousPosts = posts.slice(1);

    const handleReadMore = (slug) => {
        const post = posts.find(p => p.id === slug || p.slug === slug);
        setSelectedPost(post);
        setIsTimelineOpen(false); // Close timeline modal if open
    };

    const handleBack = () => {
        setSelectedPost(null);
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 sm:space-y-12">
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
                        key="blog-main-view"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isDesktop ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen max-h-[80vh] min-h-[600px]">
                                <div className="lg:col-span-2">
                                    {latestPost && (
                                      <FeaturedPost post={{
                                        title: latestPost.title,
                                        excerpt: latestPost.introduction,
                                        imageUrl: latestPost.cover_url || 'https://placehold.co/1024x512',
                                        author: { name: 'Coach', avatarUrl: 'https://placehold.co/64x64' },
                                        date: new Date(latestPost.updated_at).toLocaleDateString(),
                                        readTime: '',
                                        slug: latestPost.id,
                                      }} onReadMore={handleReadMore} />
                                    )}
                                </div>
                                <div className="lg:col-span-1 border-l pl-6 border-gray-200 dark:border-gray-700">
                                    <h2 className="text-2xl font-bold mb-4">This Just In</h2>
                                    <BlogTimeline posts={previousPosts.map(p => ({
                                      title: p.title,
                                      excerpt: p.introduction,
                                      imageUrl: p.cover_url || 'https://placehold.co/512x256',
                                      author: { name: 'Coach', avatarUrl: 'https://placehold.co/32x32' },
                                      date: new Date(p.updated_at).toLocaleDateString(),
                                      readTime: '',
                                      slug: p.id,
                                    }))} onReadMore={handleReadMore} />
                                </div>
                            </div>
                        ) : (
                            // Mobile/Tablet View
                            <div className="space-y-8">
                                {latestPost && (
                                  <FeaturedPost post={{
                                    title: latestPost.title,
                                    excerpt: latestPost.introduction,
                                    imageUrl: latestPost.cover_url || 'https://placehold.co/1024x512',
                                    author: { name: 'Coach', avatarUrl: 'https://placehold.co/64x64' },
                                    date: new Date(latestPost.updated_at).toLocaleDateString(),
                                    readTime: '',
                                    slug: latestPost.id,
                                  }} onReadMore={handleReadMore} />
                                )}
                                <div className="mt-8">
                                    <h2 className="text-2xl font-bold mb-4">This Just In</h2>
                                    <BlogTimeline posts={previousPosts.map(p => ({
                                      title: p.title,
                                      excerpt: p.introduction,
                                      imageUrl: p.cover_url || 'https://placehold.co/512x256',
                                      author: { name: 'Coach', avatarUrl: 'https://placehold.co/32x32' },
                                      date: new Date(p.updated_at).toLocaleDateString(),
                                      readTime: '',
                                      slug: p.id,
                                    }))} onReadMore={handleReadMore} />
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BlogPage;
