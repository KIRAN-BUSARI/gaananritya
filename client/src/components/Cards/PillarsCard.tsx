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
      className={`mx-auto flex w-10/12 flex-col gap-4 overflow-hidden rounded-lg border border-gray-50 py-6 shadow-lg transition-transform duration-300 hover:scale-[1.02] sm:flex-row sm:gap-5 md:w-full md:gap-6 md:p-6`}
    >
      <div
        className={`w-12/12 flex flex-col items-center justify-center md:w-7/12`}
      >
        <img
          src={image}
          alt={name}
          className="aspect-square h-auto"
          loading="lazy"
        />
      </div>
      <div className={`w-full content-center space-y-2 px-6 md:space-y-1`}>
        <h2 className="text-left text-lg font-semibold 2xl:text-2xl">{name}</h2>
        <p className="text-left text-base italic">{designation}</p>
        <p className="line-clamp-5 text-balance text-left text-base">
          {description}
        </p>
      </div>
    </div>
  );
};

export default PillarsCard;
