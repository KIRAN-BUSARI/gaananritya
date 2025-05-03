import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/helper/axiosInstance';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Trash2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';

interface Blog {
  _id: string;
  image: string;
  date: string;
  title: string;
  content: string;
  author: string;
  authorImage?: string;
  tags?: string[];
}

function BlogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const isAdminUser = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(isAdminUser);

    const fetchBlog = async () => {
      if (!id) {
        setError('Blog ID not provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(`/blog/${id}`);
        // console.log('API Response:', response.data);

        // Validate response structure
        if (!response.data || typeof response.data !== 'object') {
          throw new Error('Invalid API response format');
        }

        // Check if response data is in expected format
        const fetchedBlog = response.data.data;

        if (
          fetchedBlog &&
          fetchedBlog._id &&
          fetchedBlog.title &&
          fetchedBlog.content
        ) {
          const enhancedBlog = {
            ...fetchedBlog,
            authorImage:
              fetchedBlog.authorImage ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${fetchedBlog.author.replace(/\s+/g, '')}`,
            tags: Array.isArray(fetchedBlog.tags)
              ? fetchedBlog.tags
              : ['Classical Dance', 'Bharatanatyam'],
            // Ensure date is valid
            date: fetchedBlog.date || new Date().toISOString(),
          };

          setBlog(enhancedBlog);
          // console.log('Enhanced blog:', enhancedBlog);

          if (enhancedBlog.tags && enhancedBlog.tags.length > 0) {
            const tag = enhancedBlog.tags[0];
            // console.log('Fetching related blogs with tag:', tag);

            try {
              const relatedResponse = await axiosInstance.get(
                `/blog/all?tag=${tag}&limit=3`,
              );
              // console.log('Related blogs response:', relatedResponse.data);

              // Check if related blogs are in expected format
              const relatedBlogsData = relatedResponse.data?.data || [];

              if (Array.isArray(relatedBlogsData)) {
                const filteredRelatedBlogs = relatedBlogsData.filter(
                  (relatedBlog: Blog) => relatedBlog._id !== id,
                );

                const enhancedRelatedBlogs = filteredRelatedBlogs.map(
                  (relatedBlog: Blog) => ({
                    ...relatedBlog,
                    authorImage:
                      relatedBlog.authorImage ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${relatedBlog.author?.replace(/\s+/g, '') || 'unknown'}`,
                    tags: Array.isArray(relatedBlog.tags)
                      ? relatedBlog.tags
                      : ['Classical Dance', 'Bharatanatyam'],
                    // Ensure content exists to prevent rendering errors
                    content: relatedBlog.content || '',
                  }),
                );

                setRelatedBlogs(enhancedRelatedBlogs);
                console.log('Enhanced related blogs:', enhancedRelatedBlogs);
              } else {
                console.warn(
                  'Related blogs data is not an array:',
                  relatedBlogsData,
                );
                setRelatedBlogs([]);
              }
            } catch (relatedError) {
              console.error('Error fetching related blogs:', relatedError);
              // Don't fail the whole page if related blogs fail to load
              setRelatedBlogs([]);
            }
          }
        } else {
          console.error(
            'Blog data not found or invalid in response:',
            fetchedBlog,
          );
          setError('Blog post not found or data is incomplete');
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to load blog post. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const getReadingTime = useMemo(() => {
    if (!blog || !blog.content) return 0;
    const wordsPerMinute = 200;
    const wordCount = blog.content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }, [blog]);

  const handleShareClick = () => {
    if (!blog) return;

    if (navigator.share) {
      navigator
        .share({
          title: blog.title,
          text: `Check out this blog: ${blog.title}`,
          url: window.location.href,
        })
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          toast.success('Link copied to clipboard!');
        })
        .catch((err) => {
          console.error('Could not copy text: ', err);
          toast.error('Failed to copy link. Please try again.');
        });
    }
  };

  const confirmDeleteBlog = () => {
    if (!blog) return;
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteBlog = async () => {
    if (!blog) return;

    try {
      setIsSubmitting(true);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        setIsSubmitting(false);
        setIsDeleteDialogOpen(false);
        return;
      }

      await axiosInstance.delete(`/blog/delete/${blog._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Blog deleted successfully!');
      navigate('/blogs');
    } catch (error) {
      console.error('Error deleting blog:', error);

      const err = error as {
        response?: { data?: { message?: string }; statusText?: string };
        message?: string;
      };
      const errorMessage =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        'Failed to delete blog. Please try again.';

      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto mt-12 px-4 py-8">
        <div className="flex w-full flex-col items-center justify-center text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-secondary"></div>
          <p className="mt-4 text-lg text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto mt-12 px-4 py-8 md:px-20">
        <div className="rounded-xl bg-white p-8 text-center shadow-md">
          <div className="mx-auto mb-4 h-20 w-20 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            {error || 'Blog post not found'}
          </h2>
          <p className="mb-8 text-gray-600">
            The blog post you're looking for couldn't be found or has been
            removed.
          </p>
          <Button
            onClick={() => navigate('/blogs')}
            className="bg-secondary text-white hover:bg-secondary/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div
        className="relative h-[40vh] w-full md:h-[50vh] lg:h-[60vh]"
        style={{
          backgroundImage: `url(${blog.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40"></div>
        <div className="container relative z-10 mx-auto flex h-full items-end px-4 pb-8 md:pb-12 lg:pb-16">
          <div className="max-w-4xl">
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-white/80 py-1 text-sm text-secondary1 backdrop-blur-sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <h1 className="text-3xl font-bold leading-tight text-white drop-shadow-lg md:text-4xl lg:text-5xl">
              {blog.title}
            </h1>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/blogs')}
          className="absolute left-4 top-4 z-10 border-white bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blogs
        </Button>
      </div>

      <div className="container mx-auto w-full px-4 py-8 md:py-12">
        <div className="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:sticky lg:top-24 lg:col-span-3 lg:self-start">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-purple-200">
                  <AvatarImage src={blog.authorImage} alt={blog.author} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                    {blog.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-gray-900">{blog.author}</h3>
                  <p className="text-sm text-gray-500">Author</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={new Date(blog.date).toISOString()}>
                    {formatDate(blog.date)}
                  </time>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{getReadingTime} min read</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={handleShareClick}
                  className="w-full justify-start"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Article
                </Button>

                {isAdmin && (
                  <Button
                    variant="outline"
                    onClick={confirmDeleteBlog}
                    className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Article
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-9">
            <div className="rounded-xl bg-white p-6 shadow-md md:p-8 lg:p-10">
              <div className="prose prose-lg max-w-none">
                {blog.content &&
                  blog.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-6">
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>

            {relatedBlogs.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Related Articles
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedBlogs.map((relatedBlog) => (
                    <motion.div
                      key={relatedBlog._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg"
                      onClick={() => navigate(`/blog/${relatedBlog._id}`)}
                    >
                      <div className="relative h-48 w-full">
                        <img
                          src={relatedBlog.image}
                          alt={relatedBlog.title}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                        {relatedBlog.tags && relatedBlog.tags.length > 0 && (
                          <div className="absolute left-3 top-3">
                            <Badge className="bg-white/80 text-xs text-secondary1 backdrop-blur-sm">
                              {relatedBlog.tags[0]}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="mb-2 line-clamp-2 cursor-pointer text-lg font-semibold hover:text-secondary1">
                          {relatedBlog.title}
                        </h3>
                        <p className="line-clamp-2 text-sm text-gray-600">
                          {relatedBlog.content &&
                            relatedBlog.content.substring(0, 120)}
                          ...
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={relatedBlog.authorImage}
                                alt={relatedBlog.author}
                              />
                              <AvatarFallback className="bg-secondary/20 text-xs text-secondary1">
                                {relatedBlog.author.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-600">
                              {relatedBlog.author}
                            </span>
                          </div>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {new Date(relatedBlog.date).toLocaleDateString(
                              'en-US',
                              {
                                day: 'numeric',
                                month: 'short',
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  This will permanently delete the blog post and all associated
                  content.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6 flex items-center justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBlog}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Blog'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BlogPage;
