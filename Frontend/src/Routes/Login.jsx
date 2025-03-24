import { motion } from "motion/react";
import AuthContext from "../context/AuthContext/AuthContext";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router";
import "../App.css";

const Login = () => {
  const navigate = useNavigate();
  const { setIsAuth, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMessage("");
      setSuccess(false);
    }, 2000);
  }, [message, success]);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const checkforempty = (data) => {
    for (const key in data) {
      if (data[key] === "") {
        return true;
      }
    }
    return false;
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (checkforempty(formData)) {
      setMessage("Fill all the fields 🪹");
      setSuccess(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setMessage("Enter a valid email ❌");
      setSuccess(false);
      return;
    }

    const localIpAdd = import.meta.env.VITE_LOCAL_IP_ADDRESS;
    console.log(localIpAdd);

    fetch(`http://${localIpAdd}:3000/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage(data.message);
          setSuccess(true);
          setIsAuth(true);
          const userFirstName = data.user.name.split(" ")[0];
          console.log(data.user.userId);

          setUser({
            name: userFirstName,
            email: data.user.email,
            userId: data.user.userId,
          });
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          setMessage(data.message);
          setSuccess(false);
        }
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <motion.div
      className="flex justify-center items-center bg-gray-900 mt-36"
      id="login-main-div"
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
          Login
        </h1>

        {/* Email Input */}
        <div className="mb-6">
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

        {/* Password Input */}
        <div className="mb-6 relative">
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
            className="absolute top-10 right-4 text-gray-400 cursor-pointer hover:text-yellow-500 transition duration-200"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="w-full py-2 px-4 bg-yellow-500 text-gray-900 font-bold rounded hover:bg-gray-700 hover:text-yellow-500 transition duration-300"
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>
        <p
          className={`text-center mt-2 ${
            success ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>

        <p className="text-center mt-2 text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-yellow-500 hover:underline hover:text-white transition duration-200"
          >
            Register
          </Link>
        </p>
      </motion.form>
    </motion.div>
  );
};

export default Login;
