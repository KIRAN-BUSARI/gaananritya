function Performance() {
  return (
    <section
      id="performance"
      className="h-auto px-4 py-10 md:px-[120px] md:py-40"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col space-y-5 text-left sm:text-center">
          <h1 className="text-2xl font-semibold md:text-4xl">Performance</h1>
          <p className="text-sm font-normal md:text-[16px] md:leading-6">
            Exploring the grace, rhythm, and storytelling traditions of Indian
            classical dance through captivating movements, intricate footwork,
            and emotive expressions.
          </p>
        </div>

        <div className="mt-10 h-[250px] w-[330px] overflow-hidden rounded-lg md:h-[624px] md:w-[1000px]">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/S-R2pPYl-UM?si=mLCkcpW1njfkNwNu"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default Performance;
