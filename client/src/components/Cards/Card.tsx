const Card = ({
  imgLink,
  title,
  description,
  buttonText,
  link,
}: {
  imgLink: string;
  title: string;
  description: string;
  buttonText?: string;
  link?: string;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.open('https://wa.me/+919611494919', '_blank');
  };
  return (
    <div className="justify-left flex h-auto max-w-[400px] flex-col items-center rounded-2xl border bg-white p-5 drop-shadow-xl md:h-[600px]">
      <div className="flex flex-col space-y-2">
        <div className="mb-2 rounded-lg bg-[#E8E3E9]">
          <img src={imgLink} alt="card_img" />
        </div>
        <h1 className="text-center text-xl font-semibold leading-[30px]">
          {title}
        </h1>
        <div className="flex min-h-[168px] text-balance text-center text-base leading-[24px]">
          {description}
        </div>
        {buttonText && (
          <button
            onClick={link ? () => window.open(link, '_blank') : handleClick}
            className="rounded-full bg-secondary px-5 py-3 uppercase text-white"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
