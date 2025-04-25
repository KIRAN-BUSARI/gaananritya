const ClassesCard = ({ image, title }: { image: string; title: string }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-3 sm:p-4">
      <div className="aspect-square w-full overflow-hidden rounded-2xl">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>
      <h2 className="mt-3 text-center text-lg font-semibold text-gray-800 sm:mt-4 sm:text-xl">
        {title}
      </h2>
    </div>
  );
};

export default ClassesCard;
