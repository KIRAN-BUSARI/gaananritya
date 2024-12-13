import { motion } from 'framer-motion';

function Testimonials() {
  return (
    <section
      id="testimonials"
      className="h-auto overflow-hidden px-4 py-10 md:px-8"
    >
      <motion.div
        className="flex flex-col space-y-5 text-center"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-left text-2xl font-semibold sm:text-center md:text-4xl">
          What they have to say
        </h1>
        <p className="text-left text-sm font-normal leading-6 sm:text-center md:text-[16px]">
          Honors for notable accomplishments, recognition of excellence in a
          field, and milestones in personal or professional growth.
        </p>
      </motion.div>

      <div className="mx-auto mt-10 grid h-auto grid-cols-1 gap-10 md:mx-20 md:mt-16 md:h-[557px] md:grid-cols-2 md:gap-20">
        <motion.div
          className="flex flex-col justify-center rounded-[16px] bg-[#FBF8FB] p-6 md:p-[32px]"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex flex-col space-y-6 md:flex-row md:space-x-12 md:space-y-0">
            <div className="flex flex-col justify-center">
              <h2 className="text-[20px] font-semibold md:text-[24px]">
                Dr Rekha
              </h2>
              <p className="text-[12px] font-normal md:text-[14px]">
                Principal Scientist, Division of Fruit crops,
                <br />
                ICAR, Hessaraghatta, Bangalore 560 089
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-6 text-sm font-normal md:mt-8 md:space-y-8 md:text-[16px]">
            <p>
              I met Archana S Rao as a research associate. She attracted me with
              her expressive, sparkling eyes. As we started talking to each
              other I could understand that she is more than a researcher, a
              dancer with a knowledge of music! She is a good blend of “Science
              and Art”.
            </p>

            <p>
              She is very passionate about dance. In spite of busy work schedule
              she did her PhD in Biotechnology and Master’s program in Dance,
              which is her first choice. While dancing, she captures the
              audience with her sharp, crisp movements, expression and style.
              She is very innovative in her dancing abilities and expertise in
              different types of dances like Bharathanatyam, folk etc. I
              appreciate and wish a great success in her life.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col justify-center rounded-[16px] bg-[#FBF8FB] p-6 md:p-[32px]"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex flex-col space-y-6 md:flex-row md:space-x-12 md:space-y-0">
            <div className="flex flex-col justify-center">
              <h2 className="text-[20px] font-semibold md:text-[24px]">
                Dr Girija Ganesan
              </h2>
              <p className="text-[12px] font-normal md:text-[14px]">
                Principal Scientist ( Retired) <br />
                ICAR (Indian Institute of Horticultural Research) <br />
                Hesaraghatta lake post, Bangalore
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-6 text-sm font-normal md:mt-8 md:space-y-8 md:text-[16px]">
            <p>
              Dr Archana S Rao is a passionate dancer. She obtained her masters
              degree in dance from Sastra university. Archana is a versatile
              dancer, good in Bharathanatyam and contemporary dance forms. She
              is equally passionate in science, and waiting for her doctoral
              degree award. She is very good in imparting training in her field
              of science and dance and can mould any individual into a good
              dancer and as well a good laboratory personal assistant.
            </p>

            <p>
              I wish, her enthuse in dance never fades. She is capable of
              inventing new forms of dances and can contribute a lot to the
              field of dance. I wish her all the success in her new endeavor of
              starting a dance school to impart her dance knowledge to many
              youngsters.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Testimonials;
