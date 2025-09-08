import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const BlogTimeline = ({ posts, onReadMore }) => {
  return (
    <div className="relative border-l border-gray-200 dark:border-gray-700 space-y-8 sm:space-y-12 py-4 sm:py-8">
      {posts.map((post, index) => (
        <div key={post.id} className="relative pl-6 sm:pl-10">
          {/* Timeline circle */}
          <div className="absolute -left-2 sm:-left-4 top-1 sm:top-2 w-4 h-4 rounded-full bg-primary-600 dark:bg-primary-500 z-10"></div>
          <Card className="rounded-2xl transition-all duration-300 hover:shadow-lg dark:bg-gray-800">
            <CardHeader className="pb-2 px-4 sm:px-6 pt-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{post.categoryIcon}</span>
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-500">
                  {post.category}
                </span>
              </div>
              <CardTitle className="text-xl font-bold line-clamp-2">
                {post.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{post.author.name}</span>
                </div>
                <span className="hidden sm:inline-block">•</span>
                <span className="hidden sm:inline-block">{post.date}</span>
                <span className="hidden sm:inline-block">•</span>
                <span className="hidden sm:inline-block">{post.readTime}</span>
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary-600 dark:text-primary-500 ml-auto"
                  onClick={() => onReadMore(post.slug)}
                >
                  Read More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default BlogTimeline;
