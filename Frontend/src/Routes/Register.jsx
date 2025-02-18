import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router"; // Ensure you have react-router-dom installed and configured

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
    } else {
      alert("Registration successful!");
      // Logic to handle registration submission goes here
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <motion.div
        className="flex justify-center items-center bg-gray-900 mt-5"
        id="register-main-div"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.form
          onSubmit={handleSubmit}
          className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 p-8 rounded-lg shadow-lg w-[90%] max-w-md text-white relative"
        >
          <h1 className="text-yellow-500 text-4xl font-extrabold mb-6 text-center">
            Register
          </h1>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-yellow-500 mb-2 font-semibold"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-transparent text-white border-b-2 border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded transition duration-200"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-yellow-500 mb-2 font-semibold"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-transparent text-white border-b-2 border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded transition duration-200"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-yellow-500 mb-2 font-semibold"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-transparent text-white border-b-2 border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded transition duration-200"
              required
            />
            <span
              className="absolute top-10 right-4 text-gray-400 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-yellow-500 mb-2 font-semibold"
            >
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-transparent text-white border-b-2 border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded transition duration-200"
              required
            />
          </div>
          <motion.button
            type="submit"
            className="w-full py-2 px-4 bg-yellow-500 text-gray-900 font-bold rounded hover:bg-gray-700 hover:text-yellow-500 transition duration-300"
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.button>
          <p className="text-center mt-4 text-gray-400">
            Have an account?{" "}
            <Link
              to="/login"
              className="text-yellow-500 hover:underline hover:text-white"
            >
              Login
            </Link>
          </p>
        </motion.form>
      </motion.div>
    </>
  );
};

export default Register;
