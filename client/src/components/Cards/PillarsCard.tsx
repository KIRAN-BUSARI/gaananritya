const PillarsCard = ({
  image,
  name,
  designation,
  description,
  color,
}: {
  image: string;
  name: string;
  designation: string;
  description: string;
  color?: string;
}) => {
  return (
    <div
      style={{ backgroundColor: color }}
      className={`mx-auto flex w-3/4 flex-col gap-4 overflow-hidden rounded-lg border border-gray-50 p-4 shadow-lg transition-transform duration-300 hover:scale-[1.02] sm:flex-row sm:gap-5 sm:p-6 md:w-full md:gap-6 md:p-8 lg:gap-8`}
    >
      <div className={`flex flex-col items-center sm:w-1/3 md:w-7/12`}>
        <div
          className={`h-auto w-full max-w-[200px] flex-shrink-0 overflow-hidden rounded-lg sm:max-w-[180px] md:max-w-[300px] lg:max-w-[300px]`}
        >
          <img
            src={image}
            alt={name}
            className="aspect-square h-auto"
            loading="lazy"
          />
        </div>
      </div>
      <div className={`w-full content-center space-y-1`}>
        <h2 className="text-center text-base font-semibold sm:text-lg md:text-left md:text-xl lg:text-base">
          {name}
        </h2>
        <p className="text-center text-xs italic sm:text-sm md:text-left md:text-sm">
          {designation}
        </p>
        <p className="line-clamp-4 text-balance text-center text-xs md:text-left md:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
};

export default PillarsCard;
