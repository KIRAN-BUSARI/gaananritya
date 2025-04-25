'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import GalleryCard from '@/components/Cards/GalleryCard';
import axiosInstnace from '@/helper/axiosInstance';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface GalleryImage {
  _id: string;
  image: string;
  category: string;
}

interface Tab {
  title: string;
}

const tabs: Tab[] = [
  { title: 'all' },
  { title: 'productions' },
  { title: 'classes' },
  { title: 'events' },
  { title: 'archive' },
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
  selectedFile: File | null;
  category: string;
  isDialogOpen: boolean;
  imagePreview: string | null;
}

interface DeleteState {
  isDeleting: boolean;
  imageToDelete: string | null;
  isDialogOpen: boolean;
  error: string | null;
  success: string | null;
}

function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    error: null,
    success: null,
    selectedFile: null,
    category: '',
    isDialogOpen: false,
    imagePreview: null,
  });

  const [deleteState, setDeleteState] = useState<DeleteState>({
    isDeleting: false,
    imageToDelete: null,
    isDialogOpen: false,
    error: null,
    success: null,
  });

  const isAdmin = useMemo(() => localStorage.getItem('isAdmin') === 'true', []);
  const isLoggedIn = useMemo(
    () => localStorage.getItem('isLoggedIn') === 'true',
    [],
  );

  const fetchImages = useCallback(async () => {
    setFetchError(null);
    setIsLoading(true);
    try {
      const { data } = await axiosInstnace.get<{ data: GalleryImage[] }>(
        '/gallery/all',
      );
      setImages(data.data);
    } catch (err: any) {
      console.error('Error fetching images:', err);
      const errorMsg =
        err.response?.data?.message ||
        'Failed to fetch images. Please try again later.';
      setFetchError(errorMsg);
      toast.error(errorMsg);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const filteredImages = useMemo(() => {
    if (filter === 'all') return images;
    return images.filter(
      (image) => image.category.toLowerCase() === filter.toLowerCase(),
    );
  }, [images, filter]);

  const handleFilterChange = useCallback((category: string) => {
    setFilter(category);
  }, []);

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadState((prev) => ({
      ...prev,
      selectedFile: file || null,
      error: null,
      success: null,
      imagePreview: null,
    }));

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadState((prev) => ({
          ...prev,
          imagePreview: e.target?.result as string,
        }));
      };
      reader.onerror = () => {
        setUploadState((prev) => ({ ...prev, error: 'Failed to read file.' }));
        toast.error('Failed to read file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const resetUploadDialogForm = useCallback(() => {
    setUploadState({
      isUploading: false,
      error: null,
      success: null,
      selectedFile: null,
      category: '',
      isDialogOpen: false,
      imagePreview: null,
    });
  }, []);

  const handleUploadDialogChange = useCallback(
    (open: boolean) => {
      setUploadState((prev) => ({ ...prev, isDialogOpen: open }));
      if (!open) {
        setTimeout(() => {
          resetUploadDialogForm();
        }, 300);
      }
    },
    [resetUploadDialogForm],
  );

  const handleUpload = async () => {
    if (!uploadState.selectedFile) {
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
      formData.append('images', uploadState.selectedFile);
      formData.append('category', uploadState.category.trim().toLowerCase());

      await axiosInstnace.post('/gallery/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadState((prev) => ({
        ...prev,
        success: 'Image uploaded successfully!',
        selectedFile: null,
        category: '',
        imagePreview: null,
      }));
      toast.success('Image uploaded successfully!');
      await fetchImages();

      setTimeout(() => {
        handleUploadDialogChange(false);
      }, 1500);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      const errorMsg =
        err.response?.data?.message ||
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
      await axiosInstnace.delete(`/gallery/${deleteState.imageToDelete}`);

      setDeleteState((prev) => ({
        ...prev,
        success: 'Image deleted successfully!',
      }));
      toast.success('Image deleted successfully!');
      await fetchImages();

      setTimeout(() => {
        handleDeleteDialogChange(false);
      }, 1500);
    } catch (err: any) {
      console.error('Error deleting image:', err);
      const errorMsg =
        err.response?.data?.message ||
        'Failed to delete image. Please try again.';
      setDeleteState((prev) => ({ ...prev, error: errorMsg }));
      toast.error(errorMsg);
    } finally {
      setDeleteState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="py-8 text-center">Loading gallery...</div>;
    }
    if (fetchError) {
      return <div className="py-8 text-center text-red-500">{fetchError}</div>;
    }
    if (filteredImages.length === 0 && !isLoading) {
      return (
        <div className="py-8 text-center">
          No images found for the '{filter}' category.
        </div>
      );
    }

    return (
      <>
        <motion.div
          className="grid grid-cols-2 place-content-between justify-between gap-4 md:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredImages.map((img) => (
            <motion.div key={img._id} variants={itemVariants}>
              <GalleryCard
                img={img.image}
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
                  <button className="flex h-full min-h-[150px] w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-4 text-center text-gray-500 outline-none ring-offset-background transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <span className="text-sm font-semibold">Add Image</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader className="font-medium">
                    Add Image To Gallery
                  </DialogHeader>
                  <div className="flex flex-col space-y-4">
                    <Input
                      type="file"
                      className="border-2 border-dashed"
                      accept="image/*"
                      onChange={handleFileSelected}
                      key={
                        uploadState.selectedFile ? 'file-selected' : 'no-file'
                      }
                    />

                    {uploadState.imagePreview && (
                      <div className="relative mx-auto max-h-56 overflow-hidden rounded-md border">
                        <img
                          src={uploadState.imagePreview}
                          alt="Preview"
                          className="mx-auto max-h-56 object-contain"
                        />
                      </div>
                    )}

                    <Input
                      type="text"
                      placeholder="Enter Category (e.g., classes, events)"
                      value={uploadState.category}
                      onChange={(e) =>
                        setUploadState((prev) => ({
                          ...prev,
                          category: e.target.value,
                          error: null,
                        }))
                      }
                      className=""
                    />

                    {uploadState.error && (
                      <p className="text-sm text-red-500">
                        {uploadState.error}
                      </p>
                    )}
                    {uploadState.success && (
                      <p className="text-sm text-green-500">
                        {uploadState.success}
                      </p>
                    )}

                    <Button
                      variant={'secondary'}
                      className="text-primary"
                      onClick={handleUpload}
                      disabled={
                        uploadState.isUploading ||
                        !uploadState.selectedFile ||
                        !uploadState.category.trim()
                      }
                    >
                      {uploadState.isUploading ? 'Uploading...' : 'Upload'}
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
                <p className="text-center text-sm text-red-500">
                  {deleteState.error}
                </p>
              )}
              {deleteState.success && (
                <p className="text-center text-sm text-green-500">
                  {deleteState.success}
                </p>
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
                  {deleteState.isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };

  return (
    <section
      className="h-auto px-4 py-16 md:px-20 md:py-24 lg:px-20"
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
          <button
            key={tab.title}
            onClick={() => handleFilterChange(tab.title)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium capitalize transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 md:px-4 md:py-1 md:text-base ${
              filter === tab.title
                ? 'border-secondary bg-secondary text-primary'
                : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-100'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {renderContent()}
    </section>
  );
}

export default Gallery;
