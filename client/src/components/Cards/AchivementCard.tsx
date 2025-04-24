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
      className="flex min-h-[150px] flex-col justify-between rounded-[8px] p-4 md:p-6"
      style={cardStyle}
    >
      <h1 className="line-clamp-1 text-lg leading-[119%] tracking-[-4%] md:line-clamp-none md:text-xl lg:text-2xl">
        {title}
      </h1>
      <h2
        className="mt-2 text-4xl font-semibold leading-[170%] md:text-5xl"
        style={numberStyle}
      >
        {number}
      </h2>
    </div>
  );
};

export default AchievementCard;
