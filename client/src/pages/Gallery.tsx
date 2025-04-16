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

function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const isAdmin = localStorage.getItem('isAdmin');
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  const fetchImages = useCallback(async () => {
    setError(null);
    try {
      const { data } = await axiosInstnace.get<{ data: GalleryImage[] }>(
        '/gallery/all',
      );
      setImages(data.data);
    } catch (err) {
      setError('Failed to fetch images. Please try again later.');
      console.error('Error fetching images:', err);
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
    return images.filter((image) => image.category === filter);
  }, [images, filter]);

  const handleFilterChange = useCallback((category: string) => {
    setFilter(category);
  }, []);

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
    setUploadError(null); // Clear previous errors on new file selection
    setUploadSuccess(null);

    // Create image preview
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const resetDialogForm = useCallback(() => {
    setSelectedFile(null);
    setUploadCategory('');
    setImagePreview(null);
    setUploadError(null);
    setUploadSuccess(null);
  }, []);

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetDialogForm();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select an image to upload');
      return;
    }

    if (!uploadCategory) {
      setUploadError('Please enter a category');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append('images', selectedFile);
      formData.append('category', uploadCategory);

      await axiosInstnace.post('/gallery/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadSuccess('Image uploaded successfully!');
      setSelectedFile(null);
      setUploadCategory('');
      setImagePreview(null);
      fetchImages();

      setTimeout(() => {
        setIsDialogOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }, 1500);
    } catch (err) {
      console.error('Error uploading image:', err);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDeleteImage = (imageId: string) => {
    setImageToDelete(imageId);
    setDeleteDialogOpen(true);
    setDeleteError(null);
    setDeleteSuccess(null);
  };

  const handleDeleteImage = async () => {
    if (!imageToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await axiosInstnace.delete(`/gallery/${imageToDelete}`, {
        data: { imagePath: imageToDelete },
      });
      setDeleteSuccess('Image deleted successfully!');
      fetchImages();

      // Close dialog after successful deletion
      setTimeout(() => {
        setDeleteDialogOpen(false);
        setImageToDelete(null);
        setDeleteSuccess(null);
      }, 1500);
    } catch (error) {
      console.error('Error deleting image:', error);
      setDeleteError('Failed to delete image. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="py-8 text-center">Loading gallery...</div>;
    }
    if (error) {
      return <div className="py-8 text-center text-red-500">{error}</div>;
    }
    if (filteredImages.length === 0) {
      return (
        <div className="py-8 text-center">
          No images found for this category.
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
            <motion.div key={img.image} variants={itemVariants}>
              <GalleryCard
                img={img.image}
                onDelete={() => confirmDeleteImage(img._id)}
              />
            </motion.div>
          ))}
          {isAdmin && isLoggedIn && (
            <div className="">
              <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
                <DialogTrigger className="h-full w-full">
                  <div className="flex h-full w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 text-center text-gray-500 outline-none hover:bg-gray-200">
                    <span className="text-sm font-semibold">Add Image</span>
                  </div>
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
                    />

                    {imagePreview && (
                      <div className="relative mx-auto max-h-56 overflow-hidden rounded-md">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto max-h-56 object-contain"
                        />
                      </div>
                    )}

                    <Input
                      type="text"
                      placeholder="Enter Category"
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className=""
                    />

                    {uploadError && (
                      <p className="text-sm text-red-500">{uploadError}</p>
                    )}

                    {uploadSuccess && (
                      <p className="text-sm text-green-500">{uploadSuccess}</p>
                    )}

                    <Button
                      variant={'secondary'}
                      className="text-primary"
                      onClick={handleUpload}
                      disabled={isUploading || !selectedFile}
                    >
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="font-medium">Delete Image</DialogHeader>
            <div className="flex flex-col space-y-4">
              <p className="text-center">
                Are you sure you want to delete this image? This action cannot
                be undone.
              </p>

              {deleteError && (
                <p className="text-sm text-red-500">{deleteError}</p>
              )}

              {deleteSuccess && (
                <p className="text-sm text-green-500">{deleteSuccess}</p>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteImage}
                  disabled={isDeleting || Boolean(deleteSuccess)}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
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
      className="h-auto px-4 py-16 md:px-20 md:py-24 lg:px-[120px]"
      id="gallery"
    >
      <div className="mb-8 md:mb-12">
        {' '}
        <div className="flex flex-col space-y-3 text-left md:space-y-5">
          {' '}
          <h1 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            A Journey in Rhythm, Grace & Celebration
          </h1>
          <p className="text-balance text-sm font-normal text-gray-700 md:text-base md:leading-relaxed">
            {' '}
            A glimpse into our vibrant classes, soulful productions, and joyful
            community events.
          </p>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="mb-8 flex flex-wrap gap-2 md:gap-4">
        {' '}
        {tabs.map((tab) => (
          <button
            key={tab.title}
            onClick={() => handleFilterChange(tab.title)}
            className={`rounded-md border border-gray-300 px-3 py-1.5 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 md:px-4 md:py-1 md:text-base ${
              filter === tab.title
                ? 'border-secondary bg-secondary text-primary'
                : 'bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-100'
            }`}
          >
            {tab.title.charAt(0).toUpperCase() + tab.title.slice(1)}{' '}
          </button>
        ))}
      </div>

      <div className="mt-8 md:mt-12">{renderContent()}</div>
    </section>
  );
}

export default Gallery;
