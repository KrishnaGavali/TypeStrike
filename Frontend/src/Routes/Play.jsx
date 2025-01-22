import { motion, AnimatePresence } from "motion/react";

const Play = () => {
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          className=" text-yellow-500"
          id="play-main-div"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          This is the Play page.
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Play;
