import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getYouTubeVideoId, getYouTubeThumbnailUrl } from '@/utils/youtube';

interface VideoCardProps {
  videoUrl: string;
  title?: string;
  thumbnailUrl?: string;
  onDelete?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  videoUrl,
  title = 'Video',
  thumbnailUrl,
  onDelete,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const videoId = getYouTubeVideoId(videoUrl);

  const thumbnail =
    thumbnailUrl || (videoId ? getYouTubeThumbnailUrl(videoId) : null);

  if (!videoId) {
    return (
      <div className="rounded-lg border bg-red-50 p-4 text-center text-red-500">
        Invalid YouTube URL
      </div>
    );
  }

  return (
    <>
      <div className="group relative overflow-hidden rounded-lg bg-gray-200">
        <div
          className="aspect-video cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-300">
              <span className="text-gray-500">Loading thumbnail...</span>
            </div>
          )}

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-black/60 p-3 text-white opacity-80 transition-transform duration-300 group-hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-3">
          <h3 className="truncate text-sm font-medium">{title}</h3>
        </div>

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            aria-label="Delete video"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-7xl">
          <div className="relative aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute -right-4 -top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              aria-label="Close video"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18"></path>
                <path d="M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoCard;
