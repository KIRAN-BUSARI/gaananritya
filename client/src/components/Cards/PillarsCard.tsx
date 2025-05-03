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
  color: string;
  index: number;
}) => {
  const isEven = index % 2 === 0;

  return (
    <div
      style={{ backgroundColor: color }}
      className={`flex ${isEven ? 'flex-row' : 'flex-row-reverse'} gap-20 rounded-2xl p-12 transition-transform duration-300 hover:scale-105`}
    >
      <div className="max-h-[317px] max-w-[320px] flex-shrink-0 overflow-hidden">
        <img src={image} alt={name} width={300} height={300} />
      </div>
      <div className="flex flex-col justify-center space-y-2">
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-base font-medium text-secondary1">{designation}</p>
        <p className="text-base font-medium">{description}</p>
      </div>
    </div>
  );
};

export default PillarsCard;
