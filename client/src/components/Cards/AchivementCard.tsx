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
      className="flex min-h-[150px] max-w-[300px] flex-col rounded-[8px] p-6 sm:min-h-[180px] sm:p-6 md:max-w-full md:justify-between"
      style={cardStyle}
    >
      <h1 className="line-clamp-2 text-2xl capitalize leading-[130%] tracking-[-1%] sm:text-lg md:text-xl lg:text-2xl">
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
