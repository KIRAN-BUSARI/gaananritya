import { motion } from 'framer-motion';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import InstagramEmbedCard from '@/components/Cards/InstagramEmbedCard';
import axiosInstance from '@/helper/axiosInstance';
import { parseInstagramUrl } from '@/utils/instagram';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CalendarIcon,
  FilmIcon,
  PartyPopperIcon,
  HistoryIcon,
  ArrowDown,
  StarIcon,
  Plus,
  RefreshCw,
  Instagram,
} from 'lucide-react';

interface Tab {
  title: string;
}

interface InstagramPostItem {
  _id: string;
  url: string;
  title?: string;
  order: number;
}

interface PostFormData {
  url: string;
  title: string;
}

const significantPerformances = [
  'Guruvandana under the tutelage of Guru Shri Muralidhar Rao, Mysuru',
  'Subrahmanya Temple – Kirushashtiuthsava',
  'Shree Bhramaramba Temple - Kateeluthsava',
  'Kannada Sangha Matunga, Mumbai',
  'Sadhanasangama-Yugala, Bengaluru',
  "Alva's Nudisiri, Moodabidire, Dakshina Kannada",
  'Samanvaya, Bharatanatyam and Odissi Jugalbandi with Smt. Madhulita Mohapatra',
  'Nrityakala Parishad, Mysuru',
  'Mysuru Dasara',
  'Dance Festivals - Karwar and Kaiga',
  'Karavali Uthsava, Mangaluru',
  'Lakshadeepothsava, Shri Manjunatheshwara Temple, Dharmasthala',
  'Naadaneerajanam, Tirupathi',
  'Golden Temple, Vellore',
  'Nrityantar Festival, Bengaluru',
  'Buntayana, Kuwait',
  'Dance Festival, Kollur Mookambika Temple',
  'Kadambotsava, Banavasi',
  'Dance Festival, Guruvayur Temple',
  'Paryaya Uthsava, Shri Krishna Temple, Udupi',
  'Hampi Utsava',
  'Puligere Utsava',
  'Kannada Sangha, New Delhi',
  'Natyanjali Tirunagai and Thirunallar of Tamilnadu',
  'Karthik Fine Arts, Chennai',
  'Twice at Nehru centre, London, UK',
  'SARANG Festival at South Korea, sponsored by ICCR, Ministry of Culture',
  'Ashtabhavika presentation by the disciples of Guru Rama Vaidyanathan, Bengaluru and Mumbai.',
];

const productionsList = [
  'Solo and group performances [classical, semi classical and folk]',
  'Solo thematic performances',
  'DANCE BALLET',
  'Satyameva Jayate',
  'Jwalamukhi Ambe',
  'Srinivasa Kalyana',
  'Virata Parva',
  'Nartana Parivartana',
  'Rutu Sringara',
  'Dashaavataara',
  'Kannada Sahitya Nritya Vaibhava',
  'Navarasa Ramaayana',
];

const tabs: Tab[] = [
  { title: 'Upcoming Events' },
  { title: 'Productions' },
  { title: 'Significant Performances' },
];

const emptyPostForm: PostFormData = {
  url: '',
  title: '',
};

const MAX_POSTS = 5;

const Events = () => {
  const [filter, setFilter] = useState<string>('Upcoming Events');
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<InstagramPostItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isDeletePostOpen, setIsDeletePostOpen] = useState(false);
  const [postForm, setPostForm] = useState<PostFormData>(emptyPostForm);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<InstagramPostItem | null>(
    null,
  );

  const handleFilterChange = useCallback((category: string) => {
    setFilter(category);
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axiosInstance.get<{ data: InstagramPostItem[] }>(
        '/instagram-posts',
      );
      setPosts(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch Instagram posts:', error);
      toast.error('Failed to load Instagram posts');
      setPosts([]);
    }
  }, []);

  useEffect(() => {
    const admin = localStorage.getItem('isAdmin') === 'true';
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsAdmin(admin);
    setIsLoggedIn(loggedIn);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchPosts();
      setIsLoading(false);
    };
    loadData();
  }, [fetchPosts]);

  const canManage = isAdmin && isLoggedIn;
  const hasReachedPostLimit = posts.length >= MAX_POSTS;

  const openAddPostDialog = () => {
    if (hasReachedPostLimit) {
      toast.error(
        `You can only have up to ${MAX_POSTS} Instagram posts. Delete one to add another.`,
      );
      return;
    }
    setEditingPostId(null);
    setPostForm(emptyPostForm);
    setIsPostDialogOpen(true);
  };

  const openEditPostDialog = (post: InstagramPostItem) => {
    setEditingPostId(post._id);
    setPostForm({
      url: post.url,
      title: post.title || '',
    });
    setIsPostDialogOpen(true);
  };

  const openDeletePostDialog = (post: InstagramPostItem) => {
    setPostToDelete(post);
    setIsDeletePostOpen(true);
  };

  const handlePostSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!canManage) {
      toast.error('You must be logged in as an admin to manage posts.');
      return;
    }

    const normalizedUrl = parseInstagramUrl(postForm.url);
    if (!normalizedUrl) {
      toast.error(
        'Invalid Instagram link. Paste a post/reel URL or the embed code.',
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        url: normalizedUrl,
        title: postForm.title.trim(),
      };

      if (editingPostId) {
        await axiosInstance.patch(
          `/instagram-posts/update/${editingPostId}`,
          payload,
        );
        toast.success('Instagram post updated successfully');
      } else {
        await axiosInstance.post('/instagram-posts/create', {
          ...payload,
          order: posts.length,
        });
        toast.success('Instagram post added successfully');
      }
      setIsPostDialogOpen(false);
      setPostForm(emptyPostForm);
      setEditingPostId(null);
      await fetchPosts();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to save Instagram post';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    setIsSubmitting(true);
    try {
      await axiosInstance.delete(
        `/instagram-posts/delete/${postToDelete._id}`,
      );
      toast.success('Instagram post deleted successfully');
      setIsDeletePostOpen(false);
      setPostToDelete(null);
      await fetchPosts();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to delete Instagram post';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSignificantPerformances = () => {
    return (
      <motion.div
        className="mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold sm:text-xl md:text-2xl">
            Significant Performances
          </h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Gaana Nritya Academy has performed at prestigious venues and events
            across India and internationally. Here are some of our notable
            performances:
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
          {significantPerformances.map((performance, index) => (
            <motion.div
              key={index}
              className="flex items-start rounded-md bg-gradient-to-r from-secondary/5 to-transparent px-3 py-3 transition-all hover:from-secondary/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="mr-3 mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-secondary"></div>
              <p className="text-sm leading-relaxed sm:text-base">
                {performance}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderProductions = () => {
    return (
      <motion.div
        className="mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold sm:text-xl md:text-2xl">
            Productions
          </h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Gaana Nritya Academy presents a diverse range of classical and
            contemporary dance productions, from solo performances to elaborate
            dance ballets that bring mythological and cultural stories to life.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
          {productionsList.map((production, index) => (
            <motion.div
              key={index}
              className="flex items-start rounded-md bg-gradient-to-r from-secondary/5 to-transparent px-3 py-3 transition-all hover:from-secondary/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="mr-3 mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-secondary"></div>
              <p className="text-sm leading-relaxed sm:text-base">
                {production}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderInstagramPosts = () => {
    if (posts.length === 0) {
      return (
        <div className="flex h-40 w-full flex-col items-center justify-center space-y-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 py-8 text-center">
          <Instagram className="h-10 w-10 text-gray-400" />
          <div className="text-center">
            <h3 className="text-base font-medium text-gray-900">
              No Instagram posts yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {canManage
                ? 'Paste an Instagram link to showcase a post here.'
                : 'Check back soon for updates from our Instagram.'}
            </p>
          </div>
          {canManage && (
            <Button
              onClick={openAddPostDialog}
              disabled={hasReachedPostLimit}
              className="mt-1 bg-secondary text-primary hover:bg-secondary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Instagram Post
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
              On Instagram
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Recent moments from Gaana Nritya Academy
            </p>
          </div>
          <a
            href="https://www.instagram.com/gaananrityaacademy_official/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 text-sm font-medium text-secondary1 hover:underline sm:inline"
          >
            Follow us
          </a>
        </div>

        <motion.div
          className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 sm:justify-items-stretch xl:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {posts.map((post) => (
            <motion.div
              key={post._id}
              className="w-full max-w-[380px] sm:max-w-none"
              variants={{
                hidden: { y: 16, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
            >
              <InstagramEmbedCard
                url={post.url}
                title={post.title}
                isAdmin={canManage}
                onEdit={() => openEditPostDialog(post)}
                onDelete={() => openDeletePostDialog(post)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-40 w-full items-center justify-center py-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-secondary"></div>
            <p className="text-gray-600">Loading Events...</p>
          </div>
        </div>
      );
    }

    if (filter === 'Significant Performances') {
      return renderSignificantPerformances();
    }

    if (filter === 'Productions') {
      return renderProductions();
    }

    return renderInstagramPosts();
  };

  const iconMap: Record<string, JSX.Element> = {
    'Upcoming Events': <CalendarIcon className="mr-2 h-4 w-4" />,
    Productions: <FilmIcon className="mr-2 h-4 w-4" />,
    Festivals: <PartyPopperIcon className="mr-2 h-4 w-4" />,
    'Past Events': <HistoryIcon className="mr-2 h-4 w-4" />,
    'Significant Performances': <StarIcon className="mr-2 h-4 w-4" />,
  };

  return (
    <div className="relative flex h-auto w-full flex-col items-center justify-center">
      <div className="-z-10 max-h-40 w-full md:max-h-[400px] 2xl:max-h-[500px]">
        <video
          src="https://res.cloudinary.com/dunzdojjw/video/upload/v1748811697/events-video_fs6jrp.mp4"
          className="-mt-10 aspect-video w-full object-cover md:-mt-60"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        />
      </div>
      <div className="mb-10 flex w-full flex-col bg-white px-4 pt-10 md:mb-20 md:px-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl md:text-3xl lg:text-[32px]">
              Events that Celebrate Tradition & Talent
            </h1>
            <p className="mt-2 text-base font-medium sm:text-lg md:text-xl lg:text-2xl">
              From graceful performances to grand festivals — experience the
              rhythm of GNA on stage.
            </p>
          </div>
          {canManage && filter === 'Upcoming Events' && (
            <div className="flex shrink-0 flex-col items-stretch gap-1 sm:items-end">
              <Button
                onClick={openAddPostDialog}
                disabled={hasReachedPostLimit}
                className="bg-secondary text-primary hover:bg-secondary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Instagram Post
              </Button>
              <p className="text-xs text-gray-500">
                {posts.length}/{MAX_POSTS} posts
              </p>
            </div>
          )}
        </div>

        <p className="mt-4 text-sm leading-relaxed tracking-[-0.18px] sm:text-base md:text-lg">
          Every event is a celebration of art, culture, and community. Our
          calendar is filled with enriching performances, vibrant festivals, and
          student showcases that bring classical dance and music to diverse
          audiences.
        </p>

        <div className="mt-6 sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="cursor-pointer justify-end">
                {iconMap[filter] || <ArrowDown className="mr-2 h-4 w-4" />}
                {filter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {tabs.map((tab) => (
                <DropdownMenuItem
                  key={tab.title}
                  onClick={() => handleFilterChange(tab.title)}
                  className="flex items-center"
                >
                  {iconMap[tab.title]}
                  {tab.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-6 hidden flex-wrap items-center gap-2 sm:flex lg:gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.title}
              onClick={() => handleFilterChange(tab.title)}
              className={`whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 sm:text-sm md:px-5 md:py-2.5 lg:px-2 lg:py-2 lg:text-base ${
                filter === tab.title
                  ? 'border-secondary bg-secondary text-primary'
                  : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-100'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <div className="mt-8">{renderContent()}</div>
      </div>

      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {editingPostId ? 'Edit Instagram Post' : 'Add Instagram Post'}
            </DialogTitle>
            <DialogDescription>
              Paste an Instagram post/reel URL, or the full embed code from
              Instagram.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePostSubmit} className="mt-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instagram-url" className="font-medium">
                Instagram Embed Link / URL
              </Label>
              <Textarea
                id="instagram-url"
                value={postForm.url}
                onChange={(e) =>
                  setPostForm((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder="https://www.instagram.com/p/XXXX/ or paste embed code"
                rows={4}
                required
              />
              <p className="text-xs text-gray-500">
                On Instagram: Share → Embed → copy the code, or paste the post
                link directly.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram-title" className="font-medium">
                Title (optional)
              </Label>
              <Input
                id="instagram-title"
                value={postForm.title}
                onChange={(e) =>
                  setPostForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. Arohana 2025 highlights"
                className="h-11"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPostDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-secondary text-primary hover:bg-secondary/90"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingPostId ? (
                  'Update Post'
                ) : (
                  'Add Post'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeletePostOpen} onOpenChange={setIsDeletePostOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600">
              Delete Instagram Post
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this Instagram post from the
              page? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex items-center justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeletePostOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeletePost}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;
