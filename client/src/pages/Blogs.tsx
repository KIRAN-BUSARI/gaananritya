import {
  ArrowLeft,
  Calendar,
  Clock,
  RefreshCw,
  Share2,
  X,
  Plus,
  Trash2,
  Upload,
  Eye,
  Search,
  Filter,
  ChevronDown,
  BookOpen,
  User,
  Info,
  Check,
} from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import axiosInstance from '@/helper/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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

interface BlogFormData {
  title: string;
  content: string;
  author: string;
  date: string;
  image: File | null;
  tags: string[];
}

function Blogs() {
  const navigate = useNavigate();
  // State variables
  const [mainBlog, setMainBlog] = useState<Blog | null>(null);
  const [sideBlogsData, setSideBlogsData] = useState<Blog[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [activeView, setActiveView] = useState('grid');

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Admin state
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAddBlogDialogOpen, setIsAddBlogDialogOpen] =
    useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [blogToDelete, setBlogToDelete] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newTag, setNewTag] = useState<string>('');
  const [blogFormData, setBlogFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    image: null,
    tags: ['Classical Dance', 'Bharatanatyam'],
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const bottomObserverRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Convert to useCallback to avoid circular dependency
  const fetchTags = useCallback(() => {
    try {
      const uniqueTags = new Set<string>();

      // Add some default tags
      uniqueTags.add('Classical Dance');
      uniqueTags.add('Bharatanatyam');
      uniqueTags.add('Kuchipudi');
      uniqueTags.add('Workshops');
      uniqueTags.add('Events');

      // Add tags from loaded blogs
      if (mainBlog?.tags) {
        mainBlog.tags.forEach((tag) => uniqueTags.add(tag));
      }

      sideBlogsData.forEach((blog) => {
        if (blog.tags) {
          blog.tags.forEach((tag) => uniqueTags.add(tag));
        }
      });

      setAllTags(Array.from(uniqueTags));
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  }, [mainBlog, sideBlogsData]);

  const fetchBlogs = useCallback(
    async (
      pageNum = 1,
      replace = true,
      tag = selectedTag,
      query = searchQuery,
    ) => {
      try {
        if (pageNum === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        setError(null);

        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', pageNum.toString());
        params.append('limit', '10');

        if (tag) {
          params.append('tag', tag);
        }

        if (query) {
          params.append('search', query);
        }

        const response = await axiosInstance.get(
          `/blog/all?${params.toString()}`,
        );
        const fetchedBlogs = response.data.data;
        const total = response.data.total || 0;

        const enhancedBlogs = fetchedBlogs.map((blog: Blog) => ({
          ...blog,
          authorImage:
            blog.authorImage ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${blog.author.replace(/\s+/g, '')}`,
          tags: blog.tags || ['Classical Dance', 'Bharatanatyam'],
        }));

        if (enhancedBlogs && enhancedBlogs.length > 0) {
          if (replace) {
            setMainBlog(enhancedBlogs[0]);
            setSideBlogsData(enhancedBlogs.slice(1));
          } else {
            setSideBlogsData((prev) => [...prev, ...enhancedBlogs]);
          }

          // Check if we have more blogs to load
          setHasMore(
            fetchedBlogs.length + (pageNum > 1 ? (page - 1) * 10 : 0) < total,
          );
        } else if (pageNum === 1) {
          setError('No blogs found');
          setMainBlog(null);
          setSideBlogsData([]);
        } else {
          setHasMore(false);
        }

        // Update the tags list based on loaded blogs
        fetchTags();
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRetrying(false);
      }
    },
    // Remove fetchTags from dependencies to break the circular dependency
    [selectedTag, searchQuery, page],
  );

  // Define loadMoreBlogs as useCallback to prevent recreation on every render
  const loadMoreBlogs = useCallback(() => {
    if (hasMore && !loadingMore) {
      setPage((prev) => prev + 1);
      fetchBlogs(page + 1, false, selectedTag, searchQuery);
    }
  }, [hasMore, loadingMore, page, fetchBlogs, selectedTag, searchQuery]);

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isAdminUser = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(isAdminUser);
  }, []);

  // Load more blogs when scrolling to bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreBlogs();
        }
      },
      { threshold: 0.5 },
    );

    const currentObserverRef = bottomObserverRef.current;

    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [hasMore, loadingMore, loadMoreBlogs]);

  // Handle search query changes with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Only trigger this if we actually have a search query or tag filter
    // This prevents unnecessary requests on initial render
    if (searchQuery || selectedTag) {
      searchTimeoutRef.current = setTimeout(() => {
        setPage(1);
        fetchBlogs(1, true, selectedTag, searchQuery);
      }, 500);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, selectedTag, fetchBlogs]);

  const handleRetry = () => {
    setRetrying(true);
    fetchBlogs();
  };

  const handleClick = (clickedBlog: Blog) => {
    if (!mainBlog) return;

    document
      .getElementById('main-blog-content')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const newMainBlog = clickedBlog;
    const newSideBlogs = sideBlogsData.map((blog) =>
      blog._id === clickedBlog._id ? mainBlog : blog,
    );

    setMainBlog(newMainBlog);
    setSideBlogsData(newSideBlogs);
  };

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setIsImageOpen(true);
  };

  const handleShareClick = () => {
    if (!mainBlog) return;

    if (navigator.share) {
      navigator
        .share({
          title: mainBlog.title,
          text: `Check out this blog: ${mainBlog.title}`,
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

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setBlogFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check if file size is less than 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be smaller than 5MB');
        return;
      }
      setBlogFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !blogFormData.tags.includes(newTag.trim())) {
      setBlogFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setBlogFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleFilterByTag = (tag: string) => {
    if (selectedTag === tag) {
      // If clicking the already selected tag, clear the filter
      setSelectedTag('');
    } else {
      setSelectedTag(tag);
    }
  };

  const clearFilters = () => {
    setSelectedTag('');
    setSearchQuery('');
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !blogFormData.title ||
      !blogFormData.content ||
      !blogFormData.author ||
      !blogFormData.date ||
      !blogFormData.image
    ) {
      toast.error('Please fill in all required fields and upload an image.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Check if admin is logged in
      const isAdminUser = localStorage.getItem('isAdmin') === 'true';
      if (!isAdminUser) {
        toast.error('You must be logged in as an admin to create blogs.');
        setIsSubmitting(false);
        return;
      }

      // Get auth token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('title', blogFormData.title);
      formData.append('content', blogFormData.content);
      formData.append('author', blogFormData.author);
      formData.append('date', blogFormData.date);

      // Add tags
      blogFormData.tags.forEach((tag) => {
        formData.append('tags[]', tag);
      });

      if (blogFormData.image) {
        formData.append('image', blogFormData.image);
      }

      toast.info('Uploading blog post...');

      // Explicitly set the headers for this specific request
      const res = await axiosInstance.post('/blog/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      // Reset form data
      setBlogFormData({
        title: '',
        content: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        image: null,
        tags: ['Classical Dance', 'Bharatanatyam'],
      });
      setIsAddBlogDialogOpen(false);

      await fetchBlogs();

      toast.success(res.data.message || 'Blog post created successfully!');
    } catch (error) {
      console.error('Error creating blog:', error);

      const err = error as {
        response?: { data?: { message?: string }; statusText?: string };
        message?: string;
      };
      const errorMessage =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        'Failed to create blog. Please try again.';

      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteBlog = (blogId: string) => {
    setBlogToDelete(blogId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;

    try {
      setIsSubmitting(true);

      // Check for token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        setIsSubmitting(false);
        setIsDeleteDialogOpen(false);
        return;
      }

      await axiosInstance.delete(`/blog/delete/${blogToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchBlogs();

      toast.success('Blog deleted successfully!');
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
      setBlogToDelete('');
    }
  };

  const navigateToBlogDetail = (id: string) => {
    navigate(`/blog/${id}`);
  };

  const truncateContent = (content: string, length: number) => {
    if (content.length <= length) return content;
    return content.substring(0, length) + '...';
  };

  return (
    <div className="container min-h-screen px-4 md:px-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#1d6d8d] to-[#1d6d8d]/50 py-16">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="animate-fade-in mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Dance & Music Blog
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90 md:text-xl">
              Insights, stories and updates from the world of classical dance
              and music
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/" className="inline-flex items-center gap-2">
                <Button
                  variant="outline"
                  className="border-white bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              {isAdmin && (
                <Button
                  onClick={() => setIsAddBlogDialogOpen(true)}
                  className="bg-white text-secondary1 hover:bg-white/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Post
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto">
        {/* Search and Filtering Controls */}
        <div className="mb-8 rounded-xl bg-white p-4 shadow-md">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search articles by title, author or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Filter className="mr-2 h-4 w-4" />
                    {selectedTag ? selectedTag : 'Filter by Tag'}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Categories</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ScrollArea className="h-56">
                    {allTags.map((tag) => (
                      <DropdownMenuItem
                        key={tag}
                        onClick={() => handleFilterByTag(tag)}
                        className={
                          selectedTag === tag
                            ? 'bg-secondary/10 text-secondary1'
                            : ''
                        }
                      >
                        {tag}
                        {selectedTag === tag && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </ScrollArea>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={clearFilters}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center rounded-md border border-input bg-transparent p-1">
                <Button
                  size="sm"
                  variant={activeView === 'grid' ? 'default' : 'ghost'}
                  className={`h-8 ${activeView === 'grid' ? 'bg-secondary text-white' : ''}`}
                  onClick={() => setActiveView('grid')}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    ></path>
                  </svg>
                </Button>
                <Button
                  size="sm"
                  variant={activeView === 'list' ? 'default' : 'ghost'}
                  className={`h-8 ${activeView === 'list' ? 'bg-secondary text-white' : ''}`}
                  onClick={() => setActiveView('list')}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {selectedTag && (
            <div className="mt-3 flex items-center">
              <span className="text-sm text-gray-500">Active filter:</span>
              <Badge
                variant="outline"
                className="ml-2 flex items-center gap-1 bg-secondary/10"
              >
                <span className="text-secondary1">{selectedTag}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 rounded-full p-0 hover:bg-secondary/20 hover:text-secondary1"
                  onClick={() => setSelectedTag('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            </div>
          )}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : error || (!mainBlog && sideBlogsData.length === 0) ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 rounded-xl border bg-white p-12 shadow-md">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-4 text-xl font-bold text-gray-800">
                {error || 'No blogs available'}
              </h3>
              <p className="mt-2 text-gray-500">
                {error
                  ? 'Unable to load blogs at this time.'
                  : 'Check back later for new content.'}
              </p>
            </div>
            <Button
              onClick={handleRetry}
              disabled={retrying}
              className="bg-secondary text-white hover:bg-secondary/90"
            >
              {retrying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
            {/* Featured Blog */}
            {mainBlog && (
              <div id="main-blog-content" className="mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden rounded-2xl bg-white shadow-lg"
                >
                  <div className="grid md:grid-cols-5">
                    <div className="relative md:col-span-2">
                      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/50 to-pink-800/30"></div>
                      <img
                        src={mainBlog.image}
                        alt={mainBlog.title}
                        className="h-full w-full object-cover object-center transition-all duration-500 hover:scale-105"
                        onClick={() => handleImageClick(mainBlog.image)}
                        style={{ height: '100%', minHeight: '300px' }}
                        loading="lazy"
                      />
                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        {mainBlog.tags?.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            className="bg-white/80 text-secondary1 backdrop-blur-sm hover:bg-white"
                            onClick={() => handleFilterByTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                        {(mainBlog.tags?.length || 0) > 3 && (
                          <Badge className="bg-white/80 text-secondary1 backdrop-blur-sm">
                            +{(mainBlog.tags?.length || 0) - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-3 rounded-lg bg-white/90 p-2 backdrop-blur-sm">
                          <Avatar className="h-10 w-10 border-2 border-purple-200 shadow-sm">
                            <AvatarImage
                              src={mainBlog.authorImage}
                              alt={mainBlog.author}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                              {mainBlog.author.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {mainBlog.author}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Calendar className="h-3 w-3" />
                              <time
                                dateTime={new Date(mainBlog.date).toISOString()}
                              >
                                {new Date(mainBlog.date).toLocaleDateString(
                                  'en-US',
                                  {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  },
                                )}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 md:col-span-3 md:p-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BookOpen className="h-4 w-4" />
                          <span>
                            {getReadingTime(mainBlog.content)} min read
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => confirmDeleteBlog(mainBlog._id)}
                              className="h-8 w-8 rounded-full p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleShareClick}
                            className="h-8 w-8 rounded-full p-0 text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                          >
                            <Share2 className="h-4 w-4" />
                            <span className="sr-only">Share</span>
                          </Button>
                        </div>
                      </div>

                      <h2 className="mt-4 text-2xl font-semibold leading-normal tracking-tight text-gray-900 md:text-3xl">
                        {mainBlog.title}
                      </h2>

                      <div
                        ref={contentRef}
                        className="prose prose-slate mt-6 max-w-none"
                      >
                        {mainBlog.content
                          .split('\n\n')
                          .slice(0, 3)
                          .map((paragraph, index) => (
                            <p key={index} className="mb-4 text-gray-700">
                              {truncateContent(paragraph, 300)}
                            </p>
                          ))}
                        {mainBlog.content.split('\n\n').length > 3 && (
                          <div className="mt-2 text-gray-600">
                            <span className="text-sm">Continue reading...</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4">
                          <Button
                            onClick={() => navigateToBlogDetail(mainBlog._id)}
                            className="bg-secondary text-white hover:bg-secondary/90"
                          >
                            Read Full Article
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Blog List */}
            {sideBlogsData.length > 0 && (
              <div className="mb-12">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Latest Articles
                  </h2>
                  {selectedTag && (
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700"
                    >
                      Showing: {selectedTag}
                    </Badge>
                  )}
                </div>

                {activeView === 'grid' ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                      {sideBlogsData.map((blog, index) => (
                        <motion.div
                          key={blog._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Card className="group h-full overflow-hidden transition-all hover:shadow-md">
                            <div className="relative">
                              <AspectRatio ratio={16 / 9}>
                                <img
                                  src={blog.image}
                                  alt={blog.title}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                              </AspectRatio>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                              {blog.tags && blog.tags.length > 0 && (
                                <div className="absolute left-3 top-3 flex flex-wrap gap-1">
                                  <Badge
                                    className="bg-white/80 text-xs font-medium text-purple-700 backdrop-blur-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleFilterByTag(blog.tags![0]);
                                    }}
                                  >
                                    {blog.tags[0]}
                                  </Badge>
                                </div>
                              )}
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleClick(blog)}
                                className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white/90 p-0 opacity-0 shadow-md backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
                              >
                                <Eye className="h-4 w-4 text-purple-700" />
                              </Button>
                            </div>
                            <CardHeader className="py-4">
                              <CardTitle
                                className="line-clamp-2 cursor-pointer text-lg group-hover:text-purple-700"
                                onClick={() => handleClick(blog)}
                              >
                                {blog.title}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-2 pt-2 text-xs">
                                <time
                                  dateTime={new Date(blog.date).toISOString()}
                                  className="flex items-center gap-1"
                                >
                                  <Calendar className="h-3 w-3" />
                                  {new Date(blog.date).toLocaleDateString(
                                    'en-US',
                                    {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    },
                                  )}
                                </time>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {getReadingTime(blog.content)} min read
                                </span>
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-3 pt-0">
                              <p className="line-clamp-3 text-sm text-gray-600">
                                {truncateContent(blog.content, 150)}
                              </p>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between pt-2">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={blog.authorImage}
                                    alt={blog.author}
                                  />
                                  <AvatarFallback className="bg-purple-100 text-xs text-purple-700">
                                    {blog.author.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-gray-700">
                                  {blog.author}
                                </span>
                              </div>
                              {isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDeleteBlog(blog._id);
                                  }}
                                  className="h-7 w-7 rounded-full p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              )}
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {sideBlogsData.map((blog, index) => (
                        <motion.div
                          key={blog._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Card className="group overflow-hidden transition-all hover:shadow-md">
                            <div className="grid md:grid-cols-4">
                              <div className="relative md:col-span-1">
                                <img
                                  src={blog.image}
                                  alt={blog.title}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                  style={{ minHeight: '200px' }}
                                />
                                <div className="absolute left-3 top-3">
                                  {blog.tags && blog.tags.length > 0 && (
                                    <Badge
                                      className="bg-white/80 text-xs text-purple-700 backdrop-blur-sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleFilterByTag(blog.tags![0]);
                                      }}
                                    >
                                      {blog.tags[0]}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="p-4 md:col-span-3 md:p-6">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <time
                                    dateTime={new Date(blog.date).toISOString()}
                                    className="flex items-center gap-1"
                                  >
                                    <Calendar className="h-3 w-3" />
                                    {new Date(blog.date).toLocaleDateString(
                                      'en-US',
                                      {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                      },
                                    )}
                                  </time>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {getReadingTime(blog.content)} min read
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {blog.author}
                                  </span>
                                </div>

                                <h3
                                  className="mt-2 cursor-pointer text-xl font-bold text-gray-900 group-hover:text-purple-700"
                                  onClick={() => handleClick(blog)}
                                >
                                  {blog.title}
                                </h3>

                                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                                  {truncateContent(blog.content, 180)}
                                </p>

                                <div className="mt-4 flex items-center justify-between">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleClick(blog)}
                                    className="text-purple-600 hover:bg-purple-50 hover:text-purple-700"
                                  >
                                    Read article
                                  </Button>

                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={handleShareClick}
                                      className="h-8 w-8 rounded-full p-0 text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                                    >
                                      <Share2 className="h-4 w-4" />
                                      <span className="sr-only">Share</span>
                                    </Button>
                                    {isAdmin && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          confirmDeleteBlog(blog._id)
                                        }
                                        className="h-8 w-8 rounded-full p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Load More / Loading Indicator */}
                <div ref={bottomObserverRef} className="mt-8 py-4 text-center">
                  {loadingMore && (
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-purple-600" />
                      <span className="text-sm text-gray-600">
                        Loading more articles...
                      </span>
                    </div>
                  )}

                  {!hasMore && sideBlogsData.length > 0 && (
                    <p className="text-sm text-gray-500">
                      You've reached the end of the list
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Image Lightbox */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none">
          <div className="relative overflow-hidden rounded-lg bg-black">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsImageOpen(false)}
              className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
              aria-label="Close image view"
            >
              <X className="h-5 w-5" />
            </Button>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="mx-auto max-h-[85vh] w-auto object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Admin: Add Blog Dialog */}
      <Dialog open={isAddBlogDialogOpen} onOpenChange={setIsAddBlogDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Add New Blog Post
            </DialogTitle>
            <DialogDescription>
              Create a new blog post for Gaana Nritya Academy
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddBlog} className="mt-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-medium">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter blog title"
                value={blogFormData.title}
                onChange={handleFormChange}
                className="h-11"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="author" className="font-medium">
                  Author
                </Label>
                <Input
                  id="author"
                  name="author"
                  placeholder="Author name"
                  value={blogFormData.author}
                  onChange={handleFormChange}
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="font-medium">
                  Publication Date
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={blogFormData.date}
                  onChange={handleFormChange}
                  className="h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="font-medium">
                Blog Content
              </Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your blog content here..."
                rows={10}
                value={blogFormData.content}
                onChange={handleFormChange}
                required
                className="resize-y"
              />
              <p className="text-xs text-gray-500">
                Use two line breaks to create new paragraphs
              </p>
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Tags</Label>
              <div className="flex w-full flex-wrap gap-2 rounded-md border p-3">
                {blogFormData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-purple-100 px-2 py-1 text-purple-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-purple-200 text-purple-700 hover:bg-purple-300"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="h-2 w-2" />
                    </button>
                  </Badge>
                ))}
                <div className="flex min-w-[180px]">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    className="border-0 p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addTag}
                    className="h-auto py-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="font-medium">
                Cover Image
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="h-11"
                  required
                />
                {blogFormData.image && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setBlogFormData((prev) => ({ ...prev, image: null }))
                    }
                    aria-label="Clear selected image"
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {blogFormData.image && (
                <div className="mt-2 flex items-center gap-2 rounded-md border bg-gray-50 p-2">
                  <Upload className="h-4 w-4 text-gray-500" />
                  <span className="truncate text-sm text-gray-600">
                    {blogFormData.image.name} (
                    {Math.round(blogFormData.image.size / 1024)} KB)
                  </span>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Recommended size: 1200x630px. Maximum file size: 5MB.
              </p>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddBlogDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Publish Blog'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Admin: Delete Blog Confirmation Dialog */}
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

export default Blogs;

// AspectRatio component
function AspectRatio({
  ratio = 16 / 9,
  children,
  className = '',
}: {
  ratio?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full ${className}`}
      style={{ paddingBottom: `${(1 / ratio) * 100}%` }}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

// Blog Card Skeleton component
function BlogCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow">
      <div className="aspect-[16/9]">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-4">
        <Skeleton className="mb-2 h-4 w-1/3" />
        <Skeleton className="mb-4 h-6 w-4/5" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
