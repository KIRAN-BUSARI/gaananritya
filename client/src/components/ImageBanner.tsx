const ImageBanner = ({ image }: { image: string }) => {
  return (
    <img
      src={image}
      height={100}
      width={100}
      alt="Banner"
      className="w-auto px-2 md:px-20"
    />
  );
};

export default ImageBanner;
