const ImageBanner = ({ image }: { image: string }) => {
  return (
    <img
      src={image}
      height={100}
      width={100}
      alt="Banner"
      className="w-auto md:px-20 px-4"
    />
  );
};

export default ImageBanner;
