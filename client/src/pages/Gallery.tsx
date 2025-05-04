'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import GalleryCard from '@/components/Cards/GalleryCard';
import VideoCard from '@/components/Cards/VideoCard';
import axiosInstance from '@/helper/axiosInstance';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getYouTubeVideoId } from '@/utils/youtube';

interface GalleryImage {
  _id: string;
  image: string;
  category: string;
}

interface VideoItem {
  _id: string;
  videoUrl: string;
  category: string;
  title?: string;
  thumbnailUrl?: string;
}

interface Tab {
  title: string;
}

const tabs: Tab[] = [
  { title: 'All' },
  { title: 'Gallery' },
  { title: 'Press' },
  { title: 'Wallpaper' },
  { title: 'Videos' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface UploadState {
  isUploading: boolean;
  error: string | null;
  success: string | null;
  selectedFiles: File[] | null;
  category: string;
  isDialogOpen: boolean;
  imagePreviews: string[];
}

interface UploadVideoState {
  isUploading: boolean;
  error: string | null;
  success: string | null;
  videoUrl: string;
  videoTitle: string;
  category: string;
  isDialogOpen: boolean;
}

interface DeleteState {
  isDeleting: boolean;
  imageToDelete: string | null;
  isDialogOpen: boolean;
  error: string | null;
  success: string | null;
}

interface DeleteVideoState {
  isDeleting: boolean;
  videoToDelete: string | null;
  isDialogOpen: boolean;
  error: string | null;
  success: string | null;
}

// Maximum file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Allowed file types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    error: null,
    success: null,
    selectedFiles: null,
    category: '',
    isDialogOpen: false,
    imagePreviews: [],
  });

  const [deleteState, setDeleteState] = useState<DeleteState>({
    isDeleting: false,
    imageToDelete: null,
    isDialogOpen: false,
    error: null,
    success: null,
  });

  const [uploadVideoState, setUploadVideoState] = useState<UploadVideoState>({
    isUploading: false,
    error: null,
    success: null,
    videoUrl: '',
    videoTitle: '',
    category: 'videos',
    isDialogOpen: false,
  });

  const [deleteVideoState, setDeleteVideoState] = useState<DeleteVideoState>({
    isDeleting: false,
    videoToDelete: null,
    isDialogOpen: false,
    error: null,
    success: null,
  });

  const isAdmin = useMemo(() => localStorage.getItem('isAdmin') === 'true', []);
  const isLoggedIn = useMemo(
    () => localStorage.getItem('isLoggedIn') === 'true',
    [],
  );

  interface ApiResponse {
    data?: {
      message?: string;
    };
  }

  interface ApiError extends Error {
    response?: ApiResponse;
  }

  const fetchImages = useCallback(async () => {
    setFetchError(null);
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get<{ data: GalleryImage[] }>(
        '/gallery/all',
      );
      setImages(data.data);
    } catch (err: unknown) {
      console.error('Error fetching images:', err);
      const errorMsg =
        (err as ApiError).response?.data?.message ||
        'Failed to fetch images. Please try again later.';
      setFetchError(errorMsg);
      toast.error(errorMsg);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchVideos = useCallback(async () => {
    setFetchError(null);
    try {
      // Add loading indicator for videos when in video tab
      if (filter.toLowerCase() === 'videos') {
        setIsLoading(true);
      }

      const response = await axiosInstance.get<{
        data: VideoItem[];
        message: string;
      }>('/videos');

      // Check if response has the expected structure
      if (response.data && Array.isArray(response.data.data)) {
        setVideos(response.data.data);
      } else {
        console.error('Unexpected API response format:', response);
        throw new Error('Invalid response format from server');
      }
    } catch (err: unknown) {
      console.error('Error fetching videos:', err);
      const errorMsg =
        (err as ApiError).response?.data?.message ||
        'Failed to fetch videos. Please try again later.';
      setFetchError(errorMsg);
      toast.error(errorMsg);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchImages();
    fetchVideos();
  }, [fetchImages, fetchVideos]);

  const filteredImages = useMemo(() => {
    if (filter.toLowerCase() === 'videos') {
      return [];
    }

    if (filter.toLowerCase() === 'all') {
      return images;
    }

    return images.filter(
      (image) => image.category.toLowerCase() === filter.toLowerCase(),
    );
  }, [images, filter]);

  const handleFilterChange = useCallback((category: string) => {
    setFilter(category);
  }, []);

  const validateFile = (file: File): string | null => {
    if (!file) return 'Please select an image to upload';

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.';
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit. Please upload a smaller image.';
    }

    return null;
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      setUploadState((prev) => ({
        ...prev,
        selectedFiles: null,
        error: null,
        success: null,
        imagePreviews: [],
      }));
      return;
    }

    const errorMessages: string[] = [];
    const selectedFiles: File[] = [];
    const fileArray = Array.from(files);

    // First validate all files
    fileArray.forEach((file) => {
      const errorMessage = validateFile(file);
      if (errorMessage) {
        errorMessages.push(errorMessage);
      } else {
        selectedFiles.push(file);
      }
    });

    // Set initial state with files but no previews yet
    setUploadState((prev) => ({
      ...prev,
      selectedFiles: selectedFiles.length > 0 ? selectedFiles : null,
      error: errorMessages.length > 0 ? errorMessages.join(', ') : null,
      success: null,
      imagePreviews: [],
    }));

    // Only process previews if we have valid files
    if (selectedFiles.length > 0) {
      // Create an array to store all preview promises
      const previewPromises = selectedFiles.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
          }),
      );

      // Wait for all previews to be processed
      Promise.all(previewPromises)
        .then((previews) => {
          setUploadState((prev) => ({
            ...prev,
            imagePreviews: previews,
          }));
        })
        .catch((error) => {
          console.error('Error generating previews:', error);
          toast.error('Failed to generate image previews');
          setUploadState((prev) => ({
            ...prev,
            error: prev.error
              ? `${prev.error}, Failed to generate image previews`
              : 'Failed to generate image previews',
          }));
        });
    }
  };

  const resetUploadDialogForm = useCallback(() => {
    setUploadState({
      isUploading: false,
      error: null,
      success: null,
      selectedFiles: null,
      category: '',
      isDialogOpen: false,
      imagePreviews: [],
    });
  }, []);

  const handleUploadDialogChange = useCallback(
    (open: boolean) => {
      if (open) {
        let defaultCategory = '';
        if (filter.toLowerCase() !== 'all') {
          defaultCategory = filter.toLowerCase();
        }

        setUploadState((prev) => ({
          ...prev,
          isDialogOpen: open,
          category: defaultCategory,
        }));
      } else {
        setUploadState((prev) => ({ ...prev, isDialogOpen: open }));
        setTimeout(() => {
          resetUploadDialogForm();
        }, 300);
      }
    },
    [resetUploadDialogForm, filter],
  );

  const handleUpload = async () => {
    if (!uploadState.selectedFiles || uploadState.selectedFiles.length === 0) {
      setUploadState((prev) => ({
        ...prev,
        error: 'Please select an image to upload',
      }));
      return;
    }

    if (!uploadState.category.trim()) {
      setUploadState((prev) => ({ ...prev, error: 'Please enter a category' }));
      return;
    }

    setUploadState((prev) => ({
      ...prev,
      isUploading: true,
      error: null,
      success: null,
    }));

    try {
      const formData = new FormData();
      uploadState.selectedFiles.forEach((file) => {
        formData.append('images', file);
      });
      formData.append('category', uploadState.category.trim().toLowerCase());

      await axiosInstance.post('/gallery/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadState((prev) => ({
        ...prev,
        success: 'Image uploaded successfully!',
        selectedFiles: null,
        category: '',
        imagePreviews: [],
      }));
      toast.success('Image uploaded successfully!');
      await fetchImages();

      setTimeout(() => {
        handleUploadDialogChange(false);
      }, 1500);
    } catch (err: unknown) {
      console.error('Error uploading image:', err);
      const errorMsg =
        (err as ApiError).response?.data?.message ||
        'Failed to upload image. Please try again.';
      setUploadState((prev) => ({ ...prev, error: errorMsg }));
      toast.error(errorMsg);
    } finally {
      setUploadState((prev) => ({ ...prev, isUploading: false }));
    }
  };

  const confirmDeleteImage = useCallback((imageId: string) => {
    setDeleteState({
      isDeleting: false,
      imageToDelete: imageId,
      isDialogOpen: true,
      error: null,
      success: null,
    });
  }, []);

  const resetDeleteDialog = useCallback(() => {
    setDeleteState({
      isDeleting: false,
      imageToDelete: null,
      isDialogOpen: false,
      error: null,
      success: null,
    });
  }, []);

  const handleDeleteDialogChange = useCallback(
    (open: boolean) => {
      setDeleteState((prev) => ({ ...prev, isDialogOpen: open }));
      if (!open) {
        setTimeout(() => {
          resetDeleteDialog();
        }, 300);
      }
    },
    [resetDeleteDialog],
  );

  const handleDeleteImage = async () => {
    if (!deleteState.imageToDelete) return;

    setDeleteState((prev) => ({
      ...prev,
      isDeleting: true,
      error: null,
      success: null,
    }));

    try {
      await axiosInstance.delete(`/gallery/${deleteState.imageToDelete}`);

      setDeleteState((prev) => ({
        ...prev,
        success: 'Image deleted successfully!',
      }));
      toast.success('Image deleted successfully!');
      await fetchImages();

      setTimeout(() => {
        handleDeleteDialogChange(false);
      }, 1500);
    } catch (err: unknown) {
      console.error('Error deleting image:', err);
      const errorMsg =
        (err as ApiError).response?.data?.message ||
        'Failed to delete image. Please try again.';
      setDeleteState((prev) => ({ ...prev, error: errorMsg }));
      toast.error(errorMsg);
    } finally {
      setDeleteState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const resetUploadVideoDialogForm = useCallback(() => {
    setUploadVideoState({
      isUploading: false,
      error: null,
      success: null,
      videoUrl: '',
      videoTitle: '',
      category: 'videos',
      isDialogOpen: false,
    });
  }, []);

  const handleUploadVideoDialogChange = useCallback(
    (open: boolean) => {
      setUploadVideoState((prev) => ({ ...prev, isDialogOpen: open }));
      if (!open) {
        setTimeout(() => {
          resetUploadVideoDialogForm();
        }, 300);
      }
    },
    [resetUploadVideoDialogForm],
  );

  const handleUploadVideo = async () => {
    if (!uploadVideoState.videoUrl.trim()) {
      setUploadVideoState((prev) => ({
        ...prev,
        error: 'Please enter a YouTube video URL',
      }));
      return;
    }

    // Validate YouTube URL on client side
    const videoId = getYouTubeVideoId(uploadVideoState.videoUrl);
    if (!videoId) {
      setUploadVideoState((prev) => ({
        ...prev,
        error: 'Invalid YouTube URL. Please enter a valid YouTube video URL.',
      }));
      return;
    }

    setUploadVideoState((prev) => ({
      ...prev,
      isUploading: true,
      error: null,
      success: null,
    }));

    try {
      const videoData = {
        videoUrl: uploadVideoState.videoUrl.trim(),
        title: uploadVideoState.videoTitle.trim() || 'Untitled Video',
        category: uploadVideoState.category.trim() || 'videos',
      };

      await axiosInstance.post('/videos/add', videoData);

      setUploadVideoState((prev) => ({
        ...prev,
        success: 'Video added successfully!',
        videoUrl: '',
        videoTitle: '',
      }));
      toast.success('Video added successfully!');

      // Refresh videos list
      await fetchVideos();

      setTimeout(() => {
        handleUploadVideoDialogChange(false);
      }, 1500);
    } catch (err: unknown) {
      console.error('Error adding video:', err);

      // Get detailed error message from response if available
      const errorMsg =
        (err as ApiError).response?.data?.message ||
        'Failed to add video. Please try again.';

      setUploadVideoState((prev) => ({
        ...prev,
        error: errorMsg,
      }));
      toast.error(errorMsg);
    } finally {
      setUploadVideoState((prev) => ({ ...prev, isUploading: false }));
    }
  };

  const handleVideoCardDelete = useCallback((videoId: string) => {
    setDeleteVideoState({
      isDeleting: false,
      videoToDelete: videoId,
      isDialogOpen: true,
      error: null,
      success: null,
    });
  }, []);

  const resetDeleteVideoDialog = useCallback(() => {
    setDeleteVideoState({
      isDeleting: false,
      videoToDelete: null,
      isDialogOpen: false,
      error: null,
      success: null,
    });
  }, []);

  const handleDeleteVideoDialogChange = useCallback(
    (open: boolean) => {
      setDeleteVideoState((prev) => ({ ...prev, isDialogOpen: open }));
      if (!open) {
        setTimeout(() => {
          resetDeleteVideoDialog();
        }, 300);
      }
    },
    [resetDeleteVideoDialog],
  );

  const handleDeleteVideo = async () => {
    if (!deleteVideoState.videoToDelete) return;

    setDeleteVideoState((prev) => ({
      ...prev,
      isDeleting: true,
      error: null,
      success: null,
    }));

    try {
      await axiosInstance.delete(`/videos/${deleteVideoState.videoToDelete}`);

      setDeleteVideoState((prev) => ({
        ...prev,
        success: 'Video deleted successfully!',
      }));
      toast.success('Video deleted successfully!');

      // Refresh videos list
      await fetchVideos();

      setTimeout(() => {
        handleDeleteVideoDialogChange(false);
      }, 1500);
    } catch (err: unknown) {
      console.error('Error deleting video:', err);
      const errorMsg =
        (err as ApiError).response?.data?.message ||
        'Failed to delete video. Please try again.';
      setDeleteVideoState((prev) => ({
        ...prev,
        error: errorMsg,
      }));
      toast.error(errorMsg);
    } finally {
      setDeleteVideoState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-40 w-full items-center justify-center py-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-secondary"></div>
            <p className="text-gray-600">Loading gallery...</p>
          </div>
        </div>
      );
    }

    if (fetchError) {
      return (
        <div className="flex h-40 flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 text-red-500">{fetchError}</div>
          <Button variant="outline" onClick={fetchImages} className="mt-2">
            Try Again
          </Button>
        </div>
      );
    }

    if (filter.toLowerCase() !== 'videos') {
      if (filteredImages.length === 0) {
        return (
          <>
            <h2 className="mb-6 text-xl font-semibold md:text-2xl">{filter}</h2>
            <div className="flex h-40 flex-col items-center justify-center py-8 text-center">
              <p className="text-gray-600">
                No images available in this category.
              </p>
              {isAdmin && isLoggedIn && (
                <motion.div variants={itemVariants} className="mt-4">
                  <Dialog
                    open={uploadState.isDialogOpen}
                    onOpenChange={handleUploadDialogChange}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">Add {filter} Image</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-7xl">
                      <DialogHeader className="font-medium">
                        {filter.toLowerCase() === 'press'
                          ? 'Add Press Coverage'
                          : 'Add Image To Gallery'}
                      </DialogHeader>
                      <div className="flex flex-col space-y-4">
                        <div className="space-y-1">
                          <label
                            htmlFor="image-upload"
                            className="text-sm font-medium"
                          >
                            {filter.toLowerCase() === 'press'
                              ? 'Select Press Image'
                              : 'Select Image'}
                          </label>
                          <Input
                            id="image-upload"
                            type="file"
                            className="border-2 border-dashed"
                            accept="image/jpeg, image/png, image/gif, image/webp"
                            onChange={handleFileSelected}
                            multiple
                            key={
                              uploadState.selectedFiles
                                ? 'file-selected'
                                : 'no-file'
                            }
                            aria-describedby="file-restrictions"
                          />
                          <p
                            id="file-restrictions"
                            className="text-xs text-gray-500"
                          >
                            Accepted formats: JPG, PNG, GIF, WebP. Maximum size:
                            5MB
                          </p>
                        </div>

                        {uploadState.imagePreviews &&
                          uploadState.imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                              {uploadState.imagePreviews.map(
                                (preview, index) => (
                                  <div
                                    key={index}
                                    className="relative aspect-square overflow-hidden rounded-md border"
                                  >
                                    <img
                                      src={preview}
                                      alt={`Preview ${index + 1}`}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                ),
                              )}
                            </div>
                          )}

                        <div className="space-y-1">
                          <label
                            htmlFor="category-input"
                            className="text-sm font-medium"
                          >
                            Category
                          </label>
                          <Input
                            id="category-input"
                            type="text"
                            placeholder={
                              filter.toLowerCase() === 'press'
                                ? 'Enter press or publication name'
                                : 'Enter Category (e.g., gallery, press)'
                            }
                            value={uploadState.category}
                            onChange={(e) =>
                              setUploadState((prev) => ({
                                ...prev,
                                category: e.target.value,
                                error: null,
                              }))
                            }
                          />
                        </div>

                        {uploadState.error && (
                          <div className="rounded-md bg-red-50 p-2 text-sm text-red-500">
                            {uploadState.error}
                          </div>
                        )}

                        {uploadState.success && (
                          <div className="rounded-md bg-green-50 p-2 text-sm text-green-500">
                            {uploadState.success}
                          </div>
                        )}

                        <Button
                          variant={'secondary'}
                          className="text-primary"
                          onClick={handleUpload}
                          disabled={
                            uploadState.isUploading ||
                            !uploadState.selectedFiles ||
                            uploadState.selectedFiles.length === 0 ||
                            !uploadState.category.trim()
                          }
                        >
                          {uploadState.isUploading ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-b-transparent"></div>
                              Uploading...
                            </>
                          ) : filter.toLowerCase() === 'press' ? (
                            'Upload Press Coverage'
                          ) : (
                            'Upload'
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              )}
            </div>
          </>
        );
      }

      return (
        <>
          <motion.div
            className={`grid grid-cols-1 gap-4 ${
              filter.toLowerCase() === 'wallpaper'
                ? 'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredImages.map((img) => (
              <motion.div
                key={img._id}
                variants={itemVariants}
                className={
                  filter.toLowerCase() === 'wallpaper' ? 'aspect-video' : ''
                }
              >
                <GalleryCard
                  img={img.image}
                  title={img.category}
                  showDownload={filter.toLowerCase() === 'wallpaper'}
                  isWallpaper={filter.toLowerCase() === 'wallpaper'}
                  onDelete={
                    isAdmin && isLoggedIn
                      ? () => confirmDeleteImage(img._id)
                      : undefined
                  }
                />
              </motion.div>
            ))}
            {isAdmin && isLoggedIn && (
              <motion.div variants={itemVariants}>
                <Dialog
                  open={uploadState.isDialogOpen}
                  onOpenChange={handleUploadDialogChange}
                >
                  <DialogTrigger asChild>
                    <button
                      className="flex h-full min-h-[200px] w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-4 text-center text-gray-500 outline-none ring-offset-background transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      aria-label="Add new image to gallery"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mb-2 h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span className="text-sm font-semibold">
                          {filter.toLowerCase() === 'all' && 'Add Image'}
                          {filter.toLowerCase() === 'gallery' &&
                            'Add Gallery Image'}
                          {filter.toLowerCase() === 'press' &&
                            'Add Press Image'}
                          {filter.toLowerCase() === 'wallpaper' &&
                            'Add Wallpaper'}
                        </span>
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader className="font-medium">
                      {filter.toLowerCase() === 'press'
                        ? 'Add Press Coverage'
                        : 'Add Image To Gallery'}
                    </DialogHeader>
                    <div className="flex flex-col space-y-4">
                      <div className="space-y-1">
                        <label
                          htmlFor="image-upload"
                          className="text-sm font-medium"
                        >
                          {filter.toLowerCase() === 'press'
                            ? 'Select Press Image'
                            : 'Select Image'}
                        </label>
                        <Input
                          id="image-upload"
                          type="file"
                          className="border-2 border-dashed"
                          accept="image/jpeg, image/png, image/gif, image/webp"
                          onChange={handleFileSelected}
                          multiple
                          key={
                            uploadState.selectedFiles
                              ? 'file-selected'
                              : 'no-file'
                          }
                          aria-describedby="file-restrictions"
                        />
                        <p
                          id="file-restrictions"
                          className="text-xs text-gray-500"
                        >
                          Accepted formats: JPG, PNG, GIF, WebP. Maximum size:
                          5MB
                        </p>
                      </div>

                      {uploadState.imagePreviews &&
                        uploadState.imagePreviews.length > 0 && (
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                            {uploadState.imagePreviews.map((preview, index) => (
                              <div
                                key={index}
                                className="relative aspect-square overflow-hidden rounded-md border"
                              >
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                      <div className="space-y-1">
                        <label
                          htmlFor="category-input"
                          className="text-sm font-medium"
                        >
                          Category
                        </label>
                        <Input
                          id="category-input"
                          type="text"
                          placeholder={
                            filter.toLowerCase() === 'press'
                              ? 'Enter press or publication name'
                              : 'Enter Category (e.g., gallery, press)'
                          }
                          value={uploadState.category}
                          onChange={(e) =>
                            setUploadState((prev) => ({
                              ...prev,
                              category: e.target.value,
                              error: null,
                            }))
                          }
                        />
                      </div>

                      {uploadState.error && (
                        <div className="rounded-md bg-red-50 p-2 text-sm text-red-500">
                          {uploadState.error}
                        </div>
                      )}

                      {uploadState.success && (
                        <div className="rounded-md bg-green-50 p-2 text-sm text-green-500">
                          {uploadState.success}
                        </div>
                      )}

                      <Button
                        variant={'secondary'}
                        className="text-primary"
                        onClick={handleUpload}
                        disabled={
                          uploadState.isUploading ||
                          !uploadState.selectedFiles ||
                          uploadState.selectedFiles.length === 0 ||
                          !uploadState.category.trim()
                        }
                      >
                        {uploadState.isUploading ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-b-transparent"></div>
                            Uploading...
                          </>
                        ) : filter.toLowerCase() === 'press' ? (
                          'Upload Press Coverage'
                        ) : (
                          'Upload'
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            )}
          </motion.div>

          <Dialog
            open={deleteState.isDialogOpen}
            onOpenChange={handleDeleteDialogChange}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader className="font-medium">
                Confirm Deletion
              </DialogHeader>
              <div className="flex flex-col space-y-4 py-4">
                <p className="text-center text-sm text-muted-foreground">
                  Are you sure you want to delete this image? <br /> This action
                  cannot be undone.
                </p>

                {deleteState.error && (
                  <div className="rounded-md bg-red-50 p-2 text-center text-sm text-red-500">
                    {deleteState.error}
                  </div>
                )}

                {deleteState.success && (
                  <div className="rounded-md bg-green-50 p-2 text-center text-sm text-green-500">
                    {deleteState.success}
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteDialogChange(false)}
                    disabled={deleteState.isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteImage}
                    disabled={
                      deleteState.isDeleting || Boolean(deleteState.success)
                    }
                  >
                    {deleteState.isDeleting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent"></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    } else {
      // Videos section
      return (
        <>
          <h2 className="mb-6 text-xl font-semibold md:text-2xl">{filter}</h2>

          {videos.length === 0 ? (
            <div className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-100">
              <p className="text-gray-500">No videos available</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {videos.map((video) => (
                <motion.div
                  key={video._id}
                  variants={itemVariants}
                  className="h-full w-full"
                >
                  <div className="h-full overflow-hidden rounded-lg shadow-md">
                    <VideoCard
                      videoUrl={video.videoUrl}
                      title={video.title || 'Untitled Video'}
                      thumbnailUrl={video.thumbnailUrl}
                      onDelete={
                        isAdmin && isLoggedIn
                          ? () => handleVideoCardDelete(video._id)
                          : undefined
                      }
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {isAdmin && isLoggedIn && (
            <motion.div
              variants={itemVariants}
              className="mx-auto mt-8 w-full max-w-md"
            >
              <Dialog
                open={uploadVideoState.isDialogOpen}
                onOpenChange={handleUploadVideoDialogChange}
              >
                <DialogTrigger asChild>
                  <div className="flex h-full min-h-[120px] w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-4 text-center text-gray-500 outline-none ring-offset-background transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <div className="flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mb-2 h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="text-sm font-semibold">Add Video</span>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader className="font-medium">
                    Add Video To Gallery
                  </DialogHeader>
                  <div className="flex flex-col space-y-4">
                    <div className="space-y-1">
                      <label
                        htmlFor="video-url"
                        className="text-sm font-medium"
                      >
                        YouTube Video URL
                      </label>
                      <Input
                        id="video-url"
                        type="text"
                        placeholder="Enter YouTube Video URL"
                        value={uploadVideoState.videoUrl}
                        onChange={(e) =>
                          setUploadVideoState((prev) => ({
                            ...prev,
                            videoUrl: e.target.value,
                            error: null,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="video-title"
                        className="text-sm font-medium"
                      >
                        Video Title
                      </label>
                      <Input
                        id="video-title"
                        type="text"
                        placeholder="Enter Video Title"
                        value={uploadVideoState.videoTitle}
                        onChange={(e) =>
                          setUploadVideoState((prev) => ({
                            ...prev,
                            videoTitle: e.target.value,
                            error: null,
                          }))
                        }
                      />
                    </div>

                    {uploadVideoState.error && (
                      <div className="rounded-md bg-red-50 p-2 text-sm text-red-500">
                        {uploadVideoState.error}
                      </div>
                    )}

                    {uploadVideoState.success && (
                      <div className="rounded-md bg-green-50 p-2 text-sm text-green-500">
                        {uploadVideoState.success}
                      </div>
                    )}

                    <Button
                      variant={'secondary'}
                      className="text-primary"
                      onClick={handleUploadVideo}
                      disabled={
                        uploadVideoState.isUploading ||
                        !uploadVideoState.videoUrl.trim()
                      }
                    >
                      {uploadVideoState.isUploading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-b-transparent"></div>
                          Uploading...
                        </>
                      ) : (
                        'Upload'
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}

          <Dialog
            open={deleteVideoState.isDialogOpen}
            onOpenChange={handleDeleteVideoDialogChange}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader className="font-medium">
                Confirm Deletion
              </DialogHeader>
              <div className="flex flex-col space-y-4 py-4">
                <p className="text-center text-sm text-muted-foreground">
                  Are you sure you want to delete this video? <br /> This action
                  cannot be undone.
                </p>

                {deleteVideoState.error && (
                  <div className="rounded-md bg-red-50 p-2 text-center text-sm text-red-500">
                    {deleteVideoState.error}
                  </div>
                )}

                {deleteVideoState.success && (
                  <div className="rounded-md bg-green-50 p-2 text-center text-sm text-green-500">
                    {deleteVideoState.success}
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteVideoDialogChange(false)}
                    disabled={deleteVideoState.isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteVideo}
                    disabled={
                      deleteVideoState.isDeleting ||
                      Boolean(deleteVideoState.success)
                    }
                  >
                    {deleteVideoState.isDeleting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent"></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    }
  };

  return (
    <section
      className="h-auto px-2 py-16 md:px-20 md:py-24 lg:px-20"
      id="gallery"
    >
      <div className="mb-8 md:mb-12">
        <div className="flex flex-col space-y-3 text-left md:space-y-5">
          <h1 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            A Journey in Rhythm, Grace & Celebration
          </h1>
          <p className="text-balance text-sm font-normal text-gray-700 md:text-base md:leading-relaxed">
            A glimpse into our vibrant classes, soulful productions, and joyful
            community events.
          </p>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2 md:mb-12 md:gap-4">
        {tabs.map((tab) => (
          <Button
            id={tab.title}
            key={tab.title}
            onClick={() => handleFilterChange(tab.title)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium capitalize transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 md:px-2 md:py-1 md:text-base ${
              filter === tab.title
                ? 'border-secondary bg-secondary text-primary'
                : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-100'
            }`}
          >
            {tab.title}
          </Button>
        ))}
      </div>
      <div
        id={
          filter.toLowerCase() === 'videos'
            ? 'videos'
            : filter.toLowerCase() === 'press'
              ? 'press'
              : filter.toLowerCase() === 'gallery'
                ? 'gallery'
                : `media-${filter.toLowerCase()}`
        }
        className="scroll-mt-24 pt-4"
      >
        {renderContent()}
      </div>

      {!isLoading && filteredImages.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500">
          Showing {filteredImages.length}{' '}
          {filteredImages.length === 1 ? 'image' : 'images'}
          {filter.toLowerCase() !== 'all' && <span> in {filter}</span>}
        </div>
      )}
    </section>
  );
}

export default Gallery;
