const AwardCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-start justify-center space-y-2 rounded-xl bg-white p-5 sm:p-8">
      <div className="text-xl font-semibold leading-[30px] text-secondary">
        <h1 className="">{title}</h1>
      </div>
      <div className="text-base font-normal leading-[24px] text-primary1">
        <p>{description}</p>
      </div>
    </div>
  );
};

export default AwardCard;
