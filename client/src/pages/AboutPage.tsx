import { motion } from 'framer-motion';
import abtPageImg from '@/assets/abtPageImg.png';
import v1 from '@/assets/v1.png';
import v2 from '@/assets/v2bottom.png';
import v3 from '@/assets/v3.png';
import v4 from '@/assets/v4.png';
import v5 from '@/assets/v5.png';

const AboutPage = () => {
  return (
    <div
      id="about"
      className="relative flex h-auto flex-col items-center justify-center bg-[#F6F3F6] px-4 py-20 md:px-[120px] md:py-40"
    >
      <motion.img
        src={v3}
        alt="vector3"
        className="absolute right-10 top-0 w-20 md:right-60 md:w-auto"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      />
      <motion.img
        src={v5}
        alt="vector5"
        className="absolute left-10 top-0 w-20 md:left-60 md:w-auto"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      <div className="relative grid w-full grid-cols-1 gap-10 md:grid-cols-2 md:gap-20">
        <motion.img
          src={v1}
          alt="v1"
          className="absolute -top-[90px] left-0 z-10 w-20 overflow-hidden md:w-auto"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="flex flex-col items-start justify-center px-4 md:px-0"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="mb-5 text-[24px] font-semibold md:mb-10 md:text-[36px]">
            About Me
          </h1>
          <div className="mb-3 leading-[24px] text-primary1 md:mb-5 md:leading-[30px]">
            <p className="text-lg font-semibold md:text-xl">
              Dr Archana S Rao <br />
              <span className="text-[12px] font-medium text-secondary md:text-[14px]">
                MFA In dance, Ph.D In Microbiology
              </span>
            </p>
          </div>
          <div className="text-left text-sm font-normal leading-[20px] text-primary1 md:text-base md:leading-[24px]">
            <p>
              Dr Archana S Rao, a true exponent of traditional Bharathanatyam,
              has an undying passion for ancient Indian art form. With an eye on
              perfection and with an eye for every little detail of the world's
              oldest dance form, Archana through her graceful steps makes every
              performance a treat to watch! Her classical approach comes to life
              with a revelatory description of mythological legends of the act,
              peerless expressions, spectacular footwork and a great repertoire
              of gestures.
            </p>
          </div>
        </motion.div>
        <motion.div
          className="flex items-center justify-center px-4 md:px-0"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img src={abtPageImg} alt="abtpageimage" className="h-auto w-full" />
        </motion.div>
      </div>
      <motion.img
        src={v2}
        alt="v2"
        className="absolute bottom-0 left-10 w-20 overflow-hidden md:left-56 md:w-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      <motion.img
        src={v4}
        alt="vector4"
        className="absolute bottom-0 right-0 w-20 md:w-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
    </div>
  );
};

export default AboutPage;
