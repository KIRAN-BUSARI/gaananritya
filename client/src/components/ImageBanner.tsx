const ImageBanner = ({
  image,
  mobileImage,
}: {
  image: string;
  mobileImage?: string;
}) => {
  return (
    <>
      {/* Mobile image */}
      {mobileImage && (
        <img
          src={mobileImage}
          height={100}
          width={100}
          alt="Banner"
          className="w-auto px-4 md:hidden"
        />
      )}

      {/* Desktop image */}
      <img
        src={image}
        height={100}
        width={100}
        alt="Banner"
        className={`${mobileImage ? 'hidden md:block' : ''} w-auto px-4 md:px-20`}
      />
    </>
  );
};

export default ImageBanner;
