import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const BlogTimeline = ({ posts, onReadMore }) => {
  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <div 
          key={post.id} 
          className="cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg" 
          onClick={() => onReadMore(post.slug)}
        >
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-primary-600 dark:text-primary-500 mb-1">
                {post.category.toUpperCase()}
              </span>
              <h3 className="text-lg font-bold leading-snug line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                By {post.author.name}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogTimeline;
