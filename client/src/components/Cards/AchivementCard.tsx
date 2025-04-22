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
    <div className="rounded-[8px] p-6" style={cardStyle}>
      <div className="flex flex-col">
        <h1 className="text-2xl leading-[119%] tracking-[-4%]">{title}</h1>
        <h2
          className="text-5xl font-semibold leading-[170%]"
          style={numberStyle}
        >
          {number}
        </h2>
      </div>
    </div>
  );
};

export default AchievementCard;
