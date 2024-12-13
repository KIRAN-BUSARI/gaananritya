const EventBanner = () => {
  return (
    <div className="z-10 flex h-auto w-full place-content-center bg-secondary py-8 text-white md:py-[50px]">
      <div className="flex flex-col justify-center space-y-4 px-4 md:px-8">
        <h1 className="text-balance text-xl leading-[30px] sm:text-center md:text-4xl md:leading-[50px]">
          Looking for Events & Performances?
        </h1>
        <p className="smtext-center text-balance text-lg font-light leading-[24px] md:text-2xl md:leading-[33px]">
          Talk to us: 9611494919 or write a mail - sanoopura@gmail.com
        </p>
      </div>
    </div>
  );
};

export default EventBanner;
