const PillarsCard = ({
  image,
  name,
  description,
}: {
  image: string;
  name: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col space-y-6 transition-transform duration-300 hover:scale-105">
      <div className="flex h-auto w-full items-center justify-center overflow-hidden rounded-2xl">
        <img
          src={image}
          height={400}
          width={400}
          className="h-auto w-full object-cover"
          alt={name}
        />
      </div>
      <div className="text-center sm:text-left">
        <h1 className="text-xl font-semibold leading-[130%] tracking-[-1.5%] sm:text-2xl lg:text-xl">
          {name}
        </h1>
        <p className="mt-4 text-balance text-base font-medium leading-[170%] tracking-[-1%] text-secondary1 sm:text-lg lg:text-base">
          {description}
        </p>
      </div>
    </div>
  );
};

export default PillarsCard;
