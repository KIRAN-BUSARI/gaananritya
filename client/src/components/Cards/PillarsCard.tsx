const PillarsCard = ({
  image,
  name,
  designation,
  description,
  color,
  index,
}: {
  image: string;
  name: string;
  designation: string;
  description: string;
  color?: string;
  index: number;
}) => {
  const isEven = index % 2 === 0;

  return (
    <div
      style={{ backgroundColor: color }}
      className={`flex w-full flex-col gap-4 rounded-2xl p-4 shadow-md transition-transform duration-300 hover:scale-[1.02] sm:gap-5 sm:p-6 md:gap-6 md:p-8 lg:gap-8 lg:p-10`}
    >
      <div
        className={`flex flex-col items-center ${
          isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
        } sm:items-center sm:gap-4 md:gap-6`}
      >
        <div
          className={`h-auto w-full max-w-[150px] flex-shrink-0 overflow-hidden rounded-lg sm:max-w-[180px] md:max-w-[200px] lg:max-w-[180px]`}
        >
          <img
            src={image}
            alt={name}
            className="aspect-square h-auto w-full object-cover"
            loading="lazy"
          />
        </div>
        <div
          className={`mt-4 text-center sm:mt-0 ${
            isEven ? 'sm:text-start' : 'sm:text-end'
          } flex-1`}
        >
          <h2 className="text-base font-semibold sm:text-lg md:text-xl lg:text-xl">
            {name}
          </h2>
          <p className="text-xs font-medium text-secondary1 sm:text-sm md:text-base">
            {designation}
          </p>
        </div>
      </div>
      <div
        className={`flex flex-1 flex-col justify-center space-y-2 text-left`}
      >
        <p className="text-xs leading-relaxed sm:text-sm md:text-base">
          {description}
        </p>
      </div>
    </div>
  );
};

export default PillarsCard;
