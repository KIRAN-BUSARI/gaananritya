const EventCard = ({
  color,
  title,
  description,
}: {
  color: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="relative -mt-1 flex items-center space-x-5 overflow-hidden">
      <div
        style={{ backgroundColor: color }}
        className="h-32 w-2 shrink-0 overflow-hidden rounded-xl sm:h-24"
      ></div>
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold leading-[30px] text-primary">
          {title}
        </h1>
        <p className="text-balance text-sm font-normal leading-[24px] text-secondary">
          {description}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
