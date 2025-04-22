const ImageBanner = ({ image }: { image: string }) => {
  return (
    <img src={image} height={100} width={100} alt="Banner" className="w-full" />
  );
};

export default ImageBanner;
