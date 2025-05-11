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
      className="items-left flex min-h-[150px] flex-col justify-center rounded-lg p-6"
      style={cardStyle}
    >
      <h1 className="line-clamp-1 text-2xl capitalize leading-[130%] tracking-[-1%] sm:text-lg md:line-clamp-2 md:text-xl 2xl:text-2xl">
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
