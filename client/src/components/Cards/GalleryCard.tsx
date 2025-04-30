import { useState, useEffect } from 'react';
import { Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface GalleryCardProps {
  img: string;
  title?: string;
  onDelete?: () => void;
  showDownload?: boolean;
  isWallpaper?: boolean;
}

function GalleryCard({
  img,
  title,
  onDelete,
  showDownload,
  isWallpaper,
}: GalleryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuth, setIsAuth] = useState({
    isAdmin: false,
    isLoggedIn: false,
  });

  useEffect(() => {
    const checkAuth = () => {
      setIsAuth({
        isAdmin: localStorage.getItem('isAdmin') === 'true',
        isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
      });
    };

    const checkMobile = () => {
      setIsMobile(window.matchMedia('(hover: none)').matches);
    };

    checkAuth();
    checkMobile();

    window.addEventListener('storage', checkAuth);
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const showDeleteOption = isAuth.isAdmin && isAuth.isLoggedIn;
  const altText = title || 'Gallery image';

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      // For mobile devices, we might need to use a different approach due to restrictions
      if (isMobile) {
        // Open image in new tab for mobile
        window.open(img, '_blank');
        return;
      }

      // Show loading toast
      toast.loading('Downloading image...');

      // Handle both relative and absolute URLs
      const imageUrl = img.startsWith('http')
        ? img
        : window.location.origin + img;

      // Fetch the image as a blob to handle CORS issues
      const response = await fetch(imageUrl, {
        mode: 'cors',
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(
          `Failed to download image: ${response.status} ${response.statusText}`,
        );
      }

      const blob = await response.blob();

      // Create object URL from blob
      const objectUrl = URL.createObjectURL(blob);

      // Create an anchor element
      const anchor = document.createElement('a');

      // Set the href to the object URL
      anchor.href = objectUrl;

      // Extract filename from URL or use generic name with category
      const filename = title
        ? `${title.toLowerCase()}_${Date.now()}.jpg`
        : img.split('/').pop() || 'wallpaper.jpg';

      // Set download attribute with filename
      anchor.download = filename;

      // Make it hidden
      anchor.style.display = 'none';

      // Append to body
      document.body.appendChild(anchor);

      // Trigger click
      anchor.click();

      // Clean up
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);

      // Show success toast
      toast.dismiss();
      toast.success('Image downloaded successfully!');
    } catch (err) {
      console.error('Failed to download image:', err);

      // Dismiss loading toast and show error
      toast.dismiss();
      toast.error('Failed to download image. Trying alternate method...');

      // Fallback for browsers that don't support download attribute or CORS issues
      try {
        window.open(img, '_blank');
      } catch (fallbackErr) {
        toast.error('Unable to download image. Please try again later.');
      }
    }
  };

  return (
    <div
      className={`group relative ${isWallpaper ? 'aspect-video' : 'aspect-square'} overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.02]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      role="figure"
      aria-label={altText}
    >
      <img
        src={img}
        alt={altText}
        className={`h-full w-full bg-center ${isWallpaper ? 'bg-gray-900 object-contain' : 'object-cover'} transition-transform duration-500 group-hover:scale-105`}
        loading="lazy"
      />

      {/* Desktop overlay with controls */}
      {(showDeleteOption || showDownload) && isHovered && !isMobile && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100"
          aria-hidden={!isHovered}
        >
          <div className="flex gap-2">
            {showDownload && (
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center gap-1.5 px-3 py-2 font-medium transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-white"
                onClick={handleDownload}
                aria-label="Save wallpaper image"
              >
                <Download size={16} />
                Save
              </Button>
            )}

            {showDeleteOption && (
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-1.5 px-3 py-2 font-medium transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                aria-label="Delete image"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Mobile controls */}
      {isMobile && (
        <div className="absolute inset-0 flex flex-col justify-between p-2">
          {/* Top controls - Admin delete */}
          {showDeleteOption && (
            <div className="self-end">
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 rounded-full shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                aria-label="Delete image"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          )}

          {/* Bottom controls - Save/Download */}
          {showDownload && (
            <div className="self-end">
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center gap-1 rounded-full bg-white px-3 py-1 font-medium shadow-md"
                onClick={handleDownload}
                aria-label="Save wallpaper image"
              >
                <Download size={16} className="text-gray-800" />
                <span className="text-gray-800">Save</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GalleryCard;
