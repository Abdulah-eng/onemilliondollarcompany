import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const BlogCard = ({ post, onReadMore }) => {
    return (
        <Card className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
            <div className="relative aspect-video">
                <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 p-1 px-3 bg-black/50 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                    {post.category}
                </div>
            </div>
            <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-xl font-bold line-clamp-2">
                    {post.title}
                </CardTitle>
                <CardDescription className="text-sm mt-1 line-clamp-2">
                    {post.excerpt}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <img
                        src={post.author.avatarUrl}
                        alt={post.author.name}
                        className="w-6 h-6 rounded-full"
                    />
                    <span>{post.author.name}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                </div>
                <Button
                    variant="outline"
                    className="mt-4 w-full sm:w-auto"
                    onClick={() => onReadMore(post.slug)}
                >
                    View Full Blog
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    );
};

export default BlogCard;
