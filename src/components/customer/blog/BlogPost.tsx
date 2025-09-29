import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';

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
      className="max-w-4xl mx-auto"
    >
      <div className="flex justify-start mb-6">
        <Button onClick={onBack} variant="ghost" className="pl-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Articles
        </Button>
      </div>

      {/* Main Image */}
      <div className="rounded-xl overflow-hidden mb-8">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="prose dark:prose-invert max-w-none">
        {/* Article Metadata */}
        <div className="flex items-center space-x-4 mb-4">
          <Badge className="bg-primary-500 text-white hover:bg-primary-600 transition-colors">
            {post.category.toUpperCase()}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <img
              src={post.author.avatarUrl}
              alt={post.author.name}
              className="w-8 h-8 rounded-full"
            />
            <span>By {post.author.name}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          {post.title}
        </h1>

        {/* Date and Read Time */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-8 text-sm text-muted-foreground">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>

        {/* Main Content */}
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
      </div>
    </motion.div>
  );
};

export default BlogPost;
