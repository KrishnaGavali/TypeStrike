import { motion, AnimatePresence } from "motion/react";

const AboutUs = () => {
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          className=" text-yellow-500"
          id="aboutus-main-div"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
        >
          This is the About Us page.
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default AboutUs;
