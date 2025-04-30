import { FC } from 'react';

interface AchievementGalleryCardProps {
  img: string;
  title?: string;
}

const AchievementGalleryCard: FC<AchievementGalleryCardProps> = ({
  img,
  title,
}) => {
  const altText = title || 'Achievement image';

  return (
    <div
      className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.02]"
      tabIndex={0}
      role="figure"
      aria-label={altText}
    >
      <img
        src={img}
        alt={altText}
        className="h-full w-full bg-center object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    </div>
  );
};

export default AchievementGalleryCard;
