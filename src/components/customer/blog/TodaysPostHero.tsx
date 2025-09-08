import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const TodaysPostHero = ({ post, onReadMore }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-3xl"
    >
      <div className="relative aspect-video">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover brightness-[.6] transition-transform duration-500 ease-in-out hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      </div>
      <div className="absolute bottom-0 left-0 p-6 sm:p-10 w-full text-white space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          {post.title}
        </h1>
        <p className="text-sm sm:text-base max-w-xl text-gray-200">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-300 font-medium">
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
        <Button
          variant="secondary"
          className="mt-4 px-6 py-3 rounded-full text-lg font-semibold"
          onClick={() => onReadMore(post.slug)}
        >
          Read Full Article
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default TodaysPostHero;
