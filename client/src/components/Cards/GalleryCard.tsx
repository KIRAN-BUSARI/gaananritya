import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryCardProps {
  img: string;
  onDelete?: () => void;
}

function GalleryCard({ img, onDelete }: GalleryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const showDeleteOption = isAdmin && isLoggedIn;

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={img}
        alt="galleryImg"
        height="100%"
        className="h-full w-full bg-center object-cover"
        width="100%"
      />

      {showDeleteOption && isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200">
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}

export default GalleryCard;
