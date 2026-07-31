import { FC } from 'react';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InstagramEmbedCardProps {
  url: string;
  title?: string;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const InstagramEmbedCard: FC<InstagramEmbedCardProps> = ({
  url,
  title,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  const permalink = url.endsWith('/') ? url : `${url}/`;
  // Omit /captioned so the embed stays shorter
  const embedSrc = `${permalink}embed`;

  return (
    <article className="group relative flex h-full w-full max-w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      {isAdmin && (
        <div className="absolute right-2.5 top-2.5 z-20 flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-full border-gray-200 bg-white/95 shadow-sm"
            onClick={onEdit}
            aria-label="Edit Instagram post"
          >
            <Pencil className="h-3 w-3 text-gray-600" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-full border-gray-200 bg-white/95 shadow-sm hover:bg-red-50"
            onClick={onDelete}
            aria-label="Delete Instagram post"
          >
            <Trash2 className="h-3 w-3 text-gray-500" />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2 border-b border-gray-100 px-3.5 py-2.5">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-gray-700"
          fill="currentColor"
          aria-hidden
        >
          <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zm9.25 1.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
        </svg>
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-600">
          Instagram
        </span>
        {title && (
          <span className="ml-auto max-w-[45%] truncate text-xs text-gray-400">
            {title}
          </span>
        )}
      </div>

      <div className="instagram-embed-frame relative h-[340px] w-full overflow-hidden bg-gray-50">
        <iframe
          src={embedSrc}
          title={title || 'Instagram post'}
          className="pointer-events-auto absolute inset-x-0 top-0 h-[540px] w-full border-0"
          loading="lazy"
          scrolling="no"
          allow="encrypted-media; clipboard-write"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/90 to-transparent" />
      </div>

      <div className="border-t border-gray-100 px-3.5 py-2.5">
        <a
          href={permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#c1351d] transition-colors hover:text-[#a12c18]"
        >
          View on Instagram
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </article>
  );
};

export default InstagramEmbedCard;
