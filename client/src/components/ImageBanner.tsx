const ImageBanner = ({ image }: { image: string }) => {
  return (
    <img
      src={image}
      height={100}
      width={100}
      alt="Banner"
      className="hidden w-auto px-20 md:block"
    />
  );
};

export default ImageBanner;
