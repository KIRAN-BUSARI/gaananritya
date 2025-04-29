interface AchievementCardProps {
  title: string;
  number: string;
  color: string;
  textColor: string;
}

const AchievementCard = ({
  title,
  number,
  color,
  textColor,
}: AchievementCardProps) => {
  const cardStyle = {
    backgroundColor: color,
  };
  const numberStyle = {
    color: textColor,
  };

  return (
    <div
      className="flex min-h-[150px] max-w-[250px] flex-col rounded-[8px] p-6 sm:min-h-[150px] sm:p-6 md:max-w-[260px]"
      style={cardStyle}
    >
      <h1 className="line-clamp-1 text-2xl capitalize leading-[130%] tracking-[-1%] sm:text-lg md:text-2xl lg:text-2xl">
        {title}
      </h1>
      <h2
        className="mt-2 text-3xl font-semibold leading-[140%] sm:text-4xl md:text-5xl"
        style={numberStyle}
      >
        {number}
      </h2>
    </div>
  );
};

export default AchievementCard;
