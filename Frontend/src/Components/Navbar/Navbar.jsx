import "./Navbar.css";
import "../../App.css";
import { motion } from "motion/react";
import { NavLink } from "react-router";

const Navbar = () => {
  return (
    <>
      <motion.div
        className=" text-yellow-500 jetbrains-mono text-3xl flex pl-5 items-center mb-5"
        id="nav-main-div"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
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
        <motion.span
          className=" cursor-pointer"
          id="title-span"
          whileHover={{ color: "#f5f5f5" }}
        >
          <NavLink to="/">TypeStrike</NavLink>
        </motion.span>
        <div
          className="flex flex-row items-center justify-center"
          id="nav-items-div"
          style={{
            width: "-webkit-fill-available",
          }}
        >
          <motion.span
            className=" px-10 text-base cursor-pointer"
            id="nav-items-1"
            whileHover={{
              scale: 1.1,
              color: "#f5f5f5",
            }}
            whileTap={{
              scale: 0.9,
            }}
          >
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "text-white" : "")}
            >
              Play
            </NavLink>
          </motion.span>
          <motion.span
            className=" px-10 text-base cursor-pointer"
            id="nav-items-2"
            whileHover={{
              scale: 1.1,
              color: "#f5f5f5",
            }}
            whileTap={{
              scale: 0.9,
            }}
          >
            <NavLink
              to="/compete"
              className={({ isActive }) => `${isActive ? "text-white" : null}`}
            >
              Compete
            </NavLink>
          </motion.span>
          <motion.span
            className=" px-10 text-base cursor-pointer"
            id="nav-items-3"
            whileHover={{
              scale: 1.1,
              color: "#f5f5f5",
            }}
            whileTap={{
              scale: 0.9,
            }}
          >
            <NavLink
              to="/about"
              className={({ isActive }) => `${isActive ? "text-white" : null}`}
            >
              About Us
            </NavLink>
          </motion.span>
        </div>
        <div
          className=" w-[25%] flex items-center justify-end"
          id="auth-nav-items"
        >
          <motion.span
            className=" px-12 text-base cursor-pointer"
            id="nav-items-4"
            whileHover={{
              scale: 1.1,
              color: "#f5f5f5",
            }}
            whileTap={{
              scale: 0.9,
            }}
          >
            Log In
          </motion.span>
          <motion.span
            className=" p-2 text-base cursor-pointer bg-yellow-500 rounded-full text-gray-900 border-yellow-500 border-2"
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
            Register
          </motion.span>
          {/* <motion.img
            width="50"
            height="50"
            className=" px-3"
            src="https://img.icons8.com/metro/26/eab308/user-male-circle.png"
            alt="user-male-circle"
            whileHover={{
              scale: 1.1,
            }}
          /> */}
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;
