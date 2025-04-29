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
    <div className="flex flex-col items-center justify-center space-y-6 transition-transform duration-300 hover:scale-105">
      <div className="">
        <img src={image} className="rounded-2xl" alt={name} />
      </div>
      <div className="">
        <h1 className="font-semibold leading-[130%] tracking-[-1.5%] sm:text-2xl lg:text-xl">
          {name}
        </h1>
        <p className="mt-4 text-lg font-medium leading-[170%] tracking-[-1%] text-secondary1 sm:text-base lg:text-base">
          {description}
        </p>
      </div>
    </div>
  );
};

export default PillarsCard;
