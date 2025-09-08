import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence, motion } from 'framer-motion';

const BlogPost = ({ post, onBack }) => {
  if (!post) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Article not found.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatarUrl}
              alt={post.author.name}
              className="w-8 h-8 rounded-full"
            />
            <span>{post.author.name}</span>
          </div>
          <span>•</span>
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
        <div className="rounded-xl overflow-hidden mb-8">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-auto object-cover"
          />
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </motion.div>
  );
};

export default BlogPost;
