import {
  ArrowLeft,
  Calendar,
  Clock,
  RefreshCw,
  Share2,
  X,
  Maximize2,
  Tag,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
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
import axiosInstance from '@/helper/axiosInstance';
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

interface BlogFormData {
  title: string;
  content: string;
  author: string;
  date: string;
  image: File | null;
}

function Blogs() {
  const [mainBlog, setMainBlog] = useState<Blog | null>(null);
  const [sideBlogsData, setSideBlogsData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Admin state
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAddBlogDialogOpen, setIsAddBlogDialogOpen] =
    useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [blogToDelete, setBlogToDelete] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [blogFormData, setBlogFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    image: null,
  });

  const contentRef = useRef<HTMLDivElement>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/blog/all');
      const fetchedBlogs = response.data.data;

      const enhancedBlogs = fetchedBlogs.map((blog: Blog) => ({
        ...blog,
        authorImage:
          blog.authorImage ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${blog.author.replace(/\s+/g, '')}`,
        tags: blog.tags || ['Classical Dance', 'Bharatanatyam'],
      }));

      if (enhancedBlogs && enhancedBlogs.length > 0) {
        setMainBlog(enhancedBlogs[0]);
        setSideBlogsData(enhancedBlogs.slice(1));
      } else {
        setError('No blogs found');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs. Please try again.');
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const isAdminUser = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(isAdminUser);
  }, []);

  const handleRetry = () => {
    setRetrying(true);
    fetchBlogs();
  };

  const handleClick = (clickedBlog: Blog) => {
    if (!mainBlog) return;

    document
      .getElementById('main-blog-content')
      ?.scrollIntoView({ behavior: 'smooth' });

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
        .then(() => alert('Link copied to clipboard!'))
        .catch((err) => console.error('Could not copy text: ', err));
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
      setBlogFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
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

      console.log('Blog creation response:', res.data);

      // Reset form data
      setBlogFormData({
        title: '',
        content: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        image: null,
      });
      setIsAddBlogDialogOpen(false);

      // Refresh blogs
      await fetchBlogs();

      toast.success(res.data.message || 'Blog post created successfully!');
    } catch (err: any) {
      console.error('Error creating blog:', err);

      // More detailed error reporting
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

  // Handle blog deletion
  const confirmDeleteBlog = (blogId: string) => {
    setBlogToDelete(blogId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;

    try {
      setIsSubmitting(true);
      await axiosInstance.delete(`/blog/delete/${blogToDelete}`);

      // Refresh blogs
      await fetchBlogs();

      toast.success('Blog deleted successfully!');
    } catch (err) {
      console.error('Error deleting blog:', err);
      toast.error('Failed to delete blog. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setBlogToDelete('');
    }
  };

  return (
    <section
      id="blogs"
      className="my-12 min-h-[calc(100vh-100px)] px-2 md:my-24 md:px-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold md:text-4xl md:font-semibold">
            Blogs
          </h1>
          <p className="mt-1 text-sm text-secondary1">
            Insights, stories, and updates from Gaana Nritya Academy
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button
              variant="outline"
              onClick={() => setIsAddBlogDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Blog
            </Button>
          )}
          <Link to="/" aria-label="Back to home">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to home</span>
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <BlogSkeleton />
      ) : error || !mainBlog ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
          <p className="text-center text-lg text-secondary1">
            {error || 'No blogs available'}
          </p>
          <Button
            onClick={handleRetry}
            disabled={retrying}
            className="flex items-center gap-2"
          >
            {retrying ? 'Retrying...' : 'Try Again'}
            {retrying && <RefreshCw className="h-4 w-4 animate-spin" />}
          </Button>
        </div>
      ) : (
        <div
          id="main-blog-content"
          className="mt-5 grid-cols-12 gap-8 space-y-10 lg:grid lg:space-y-0"
        >
          <div className="col-span-8 flex flex-col space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-3 overflow-hidden rounded-lg shadow-md"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={mainBlog.image}
                  alt={mainBlog.title}
                  className="h-full w-full cursor-zoom-in object-cover transition-transform duration-300 hover:scale-105"
                  onClick={() => handleImageClick(mainBlog.image)}
                  loading="lazy"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-2 bg-white/80 hover:bg-white"
                  onClick={() => handleImageClick(mainBlog.image)}
                  aria-label="View full image"
                >
                  <Maximize2 className="h-4 w-4" />
                  <span className="sr-only">View full image</span>
                </Button>
                {mainBlog.tags && mainBlog.tags.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {mainBlog.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="bg-white/80 text-xs font-normal text-primary"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm text-secondary1">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={new Date(mainBlog.date).toISOString()}>
                      {new Date(mainBlog.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                    <span className="mx-2 hidden sm:inline">•</span>
                    <Clock className="ml-0 h-4 w-4 sm:ml-0" />
                    <span>{getReadingTime(mainBlog.content)} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => confirmDeleteBlog(mainBlog._id)}
                        className="flex items-center gap-1 text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only">Delete</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShareClick}
                      className="flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="sr-only sm:not-sr-only">Share</span>
                    </Button>
                  </div>
                </div>

                <h2 className="mb-4 text-2xl font-bold leading-tight md:text-3xl md:font-semibold">
                  {mainBlog.title}
                </h2>

                <div className="mb-6 flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage
                      src={mainBlog.authorImage}
                      alt={mainBlog.author}
                    />
                    <AvatarFallback>{mainBlog.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{mainBlog.author}</p>
                    <p className="text-xs text-secondary1">Author</p>
                  </div>
                </div>

                <div
                  ref={contentRef}
                  className="prose max-w-none space-y-6 pb-4 text-base leading-relaxed"
                >
                  {/* Split the content by paragraphs for better formatting */}
                  {mainBlog.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="whitespace-pre-wrap">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {mainBlog.tags && mainBlog.tags.length > 0 && (
                  <div className="mt-8 flex flex-wrap items-center gap-2">
                    <Tag className="h-4 w-4 text-secondary1" />
                    {mainBlog.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-full text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="col-span-4 flex flex-col">
            <h3 className="mb-4 text-xl font-semibold">More Articles</h3>
            {sideBlogsData.length > 0 ? (
              <div className="h-[600px] overflow-auto rounded-lg border pr-2 shadow-sm">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    {sideBlogsData.map((blog, index) => (
                      <motion.div
                        key={blog._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="mb-8 flex flex-col justify-center space-y-3"
                      >
                        <div className="group relative aspect-video overflow-hidden rounded-lg">
                          <img
                            src={blog.image}
                            alt={`Blog thumbnail for ${blog.title}`}
                            onClick={() => handleClick(blog)}
                            className="h-full w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-105"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleClick(blog);
                            }}
                            role="button"
                            aria-label={`View blog: ${blog.title}`}
                            loading="lazy"
                          />
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              <Badge
                                variant="outline"
                                className="bg-white/80 text-xs font-normal text-primary"
                              >
                                {blog.tags[0]}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={blog.authorImage}
                                alt={blog.author}
                              />
                              <AvatarFallback>
                                {blog.author.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-xs text-secondary1">
                              By {blog.author}
                            </p>
                          </div>

                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDeleteBlog(blog._id);
                              }}
                              className="flex h-7 w-7 items-center justify-center p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </div>
            ) : (
              <div className="flex h-[600px] items-center justify-center rounded-lg border shadow-sm">
                <p className="text-center text-secondary1">
                  No additional articles available
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Lightbox Dialog */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          <div className="relative flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 bg-black/20 text-white hover:bg-black/40"
              onClick={() => setIsImageOpen(false)}
              aria-label="Close image view"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-h-[80vh] rounded-lg object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Admin: Add Blog Dialog */}
      <Dialog open={isAddBlogDialogOpen} onOpenChange={setIsAddBlogDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Blog Post</DialogTitle>
            <DialogDescription>
              Create a new blog post for Gaana Nritya Academy
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddBlog} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter blog title"
                value={blogFormData.title}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  placeholder="Author name"
                  value={blogFormData.author}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={blogFormData.date}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Blog Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your blog content here..."
                rows={8}
                value={blogFormData.content}
                onChange={handleFormChange}
                required
                className="resize-y"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Cover Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
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
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {blogFormData.image && (
                <div className="mt-2 flex items-center gap-2 rounded-md border p-2">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate text-sm text-muted-foreground">
                    {blogFormData.image.name} (
                    {Math.round(blogFormData.image.size / 1024)} KB)
                  </span>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddBlogDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
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
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end space-x-2">
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
    </section>
  );
}

export default Blogs;

function BlogSkeleton() {
  return (
    <div className="mt-5 grid-cols-12 gap-6 space-y-10 lg:grid lg:space-y-0">
      <div className="col-span-8 flex flex-col space-y-6">
        <div className="overflow-hidden rounded-lg shadow-md">
          <Skeleton className="aspect-video w-full rounded-b-none" />
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-8 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-4 space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="space-y-6 rounded-lg border p-4 shadow-sm">
          <div className="space-y-3">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
