/**
 * Extracts the YouTube video ID from various YouTube URL formats
 * @param url YouTube URL (can be full URL, shortened URL, or embed URL)
 * @returns YouTube video ID or null if invalid URL
 */
export const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;

  // Regular expression patterns to match different YouTube URL formats
  const patterns = [
    // Standard URL: https://www.youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([^&]+)/,
    // Shortened URL: https://youtu.be/VIDEO_ID
    /youtu\.be\/([^?&]+)/,
    // Embed URL: https://www.youtube.com/embed/VIDEO_ID
    /youtube\.com\/embed\/([^?&]+)/,
    // Mobile URL: https://m.youtube.com/watch?v=VIDEO_ID
    /m\.youtube\.com\/watch\?v=([^&]+)/,
  ];

  // Try each pattern until we find a match
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // No matches found
  return null;
};

/**
 * Generates a YouTube thumbnail URL from a video ID
 * @param videoId YouTube video ID
 * @param quality Thumbnail quality (default: high quality)
 * @returns URL to the YouTube video thumbnail
 */
export const getYouTubeThumbnailUrl = (
  videoId: string,
  quality:
    | 'default'
    | 'hqdefault'
    | 'mqdefault'
    | 'sddefault'
    | 'maxresdefault' = 'hqdefault',
): string => {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

/**
 * Generates a YouTube embed URL from a video ID
 * @param videoId YouTube video ID
 * @returns URL that can be used in an iframe to embed the video
 */
export const getYouTubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}`;
};
