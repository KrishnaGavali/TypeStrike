import "./Navbar.css";
import "../../App.css";
import { motion } from "motion/react";
import { NavLink } from "react-router"; // Correct import
import { AnimatePresence } from "motion/react";

const Navbar = () => {
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          className="text-yellow-500 jetbrains-mono text-3xl flex pl-5 items-center mb-5"
          id="nav-main-div"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{
            duration: 0.25,
            delay: 0.25,
          }}
        >
          <img
            width="48"
            height="48"
            src="https://img.icons8.com/fluency-systems-filled/48/eab308/lightning-bolt.png"
            alt="lightning-bolt"
          />
          <motion.span className="cursor-pointer" id="title-span">
            <NavLink to="/">
              <motion.p whileHover={{ color: "#f5f5f5" }}>TypeStrike</motion.p>
            </NavLink>
          </motion.span>
          <div
            className="flex flex-row items-center justify-center"
            id="nav-items-div"
            style={{
              width: "100%",
            }}
          >
            <motion.span
              className="px-10 text-base cursor-pointer"
              id="nav-items-1"
            >
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-white transition-all duration-300 "
                    : "text-yellow-500 transition-all duration-300 hover:text-white"
                }
              >
                Play
              </NavLink>
            </motion.span>
            <motion.span
              className="px-10 text-base cursor-pointer"
              id="nav-items-2"
            >
              <NavLink
                to="/compete"
                className={({ isActive }) =>
                  isActive
                    ? "text-white transition-all duration-300 "
                    : "text-yellow-500 transition-all duration-300 hover:text-white"
                }
              >
                Compete
              </NavLink>
            </motion.span>
            <motion.span
              className="px-10 text-base cursor-pointer"
              id="nav-items-3"
            >
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "text-white transition-all duration-300 "
                    : "text-yellow-500 transition-all duration-300 hover:text-white"
                }
              >
                About Us
              </NavLink>
            </motion.span>
          </div>
          <div
            className="w-[25%] flex items-center justify-end"
            id="auth-nav-items"
          >
            <motion.span
              className="px-12 text-base cursor-pointer"
              id="nav-items-4"
            >
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "text-white"
                    : "text-yellow-500 hover:text-white transition-all duration-300"
                }
              >
                Log In
              </NavLink>
            </motion.span>
            <motion.span
              className="p-2 text-base cursor-pointer bg-yellow-500 rounded-full text-gray-900 border-yellow-500 border-2"
              id="nav-items-5"
              whileHover={{
                color: "#eab308",
                backgroundColor: "#111827",
              }}
              whileTap={{
                scale: 0.9,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              <NavLink to="/register">Register</NavLink>
            </motion.span>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Navbar;
