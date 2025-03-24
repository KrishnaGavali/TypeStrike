import { motion, AnimatePresence } from "framer-motion"; // Corrected import
import { useContext, useState } from "react";
import { io } from "socket.io-client";
import AuthContext from "../context/AuthContext/AuthContext";
import "tailwindcss/tailwind.css"; // Ensure Tailwind is loaded
import { useNavigate } from "react-router";

const localIpAdd = import.meta.env.VITE_LOCAL_IP_ADDRESS;

const socket = io(`http://${localIpAdd}:3000`); // Match backend port

const Compete = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [roomCode, setRoomCode] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);

  const handleCreateRoom = () => {
    if (!user?.email) {
      setAlertMessage("Please login to create a room");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }

    if (!socket.connected) {
      socket
        .connect()
        .on("connect", () => console.log("Connected to socket server"))
        .on("disconnect", () => console.log("Disconnected from socket server"));
    }

    const roomId = Array.from(window.crypto.getRandomValues(new Uint8Array(4)))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    setRoomCode(roomId);

    setUser({
      name: user.name,
      email: user.email,
      userId: user.userId,
      host: true,
    });
    navigate(`/compete/room/${roomId}`);
  };

  const handleJoinRoom = () => {
    if (!socket.connected) {
      socket
        .connect()
        .on("connect", () => console.log("Connected to socket server"))
        .on("disconnect", () => console.log("Disconnected from socket server"));
    }

    setUser({
      name: user.name,
      email: user.email,
      userId: user.userId,
      host: false,
    });

    if (!user?.email) {
      setAlertMessage("Please login to join a room");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }

    if (!roomCode) {
      setAlertMessage("Please enter a room code");
      setTimeout(() => setAlertMessage(null), 2000);
      return;
    }

    navigate("/compete/room/" + roomCode);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="flex flex-col items-center justify-center bg-gray-900 text-white p-6"
        id="Compete-main-div"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Logo and Title */}
        <div className="flex items-center space-x-4 mb-6" id="user-room-div">
          <img
            src="https://img.icons8.com/fluency-systems-filled/48/eab308/lightning-bolt.png"
            alt="Logo"
            className="w-20"
          />
          <motion.p
            whileHover={{ color: "#eab308", scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="text-7xl font-bold"
          >
            TypeStrike
          </motion.p>
        </div>

        {/* Tagline */}
        <p className="text-gray-400 text-lg text-center max-w-2xl">
          Challenge your typing speed against friends! Create or join a room and
          strike with your typing skills.
        </p>

        {/* Room Input and Buttons */}
        <div className="mt-8 flex flex-col items-center w-full max-w-md">
          <input
            type="text"
            placeholder="Enter Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="p-3 rounded-lg bg-gray-800 text-white w-full text-center placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          />

          <div className="flex mt-6 space-x-4">
            <motion.button
              onClick={handleCreateRoom}
              className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg shadow-md "
              whileHover={{ scale: 1.05, backgroundColor: "#bf9102" }}
              whileTap={{ scale: 0.9 }}
            >
              Create Room
            </motion.button>

            <motion.button
              onClick={handleJoinRoom}
              className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg shadow-md  "
              whileHover={{ scale: 1.05, backgroundColor: "#bf9102" }}
              whileTap={{ scale: 0.9 }}
            >
              Join Room
            </motion.button>
          </div>
        </div>

        {/* Features Section */}
        <motion.div className="mt-10 text-center">
          <h2 className="text-xl font-semibold text-yellow-400">
            Why Play TypeStrike?
          </h2>
          <ul className="mt-4 space-y-2 text-gray-300">
            <li>⚡ Real-time multiplayer typing competition</li>
            <li>⌨️ Improve your typing speed & accuracy</li>
            <li>🎮 Fun & fast-paced typing challenges</li>
            <li>🫂 Play with friends & family</li>
          </ul>
        </motion.div>

        {/* Alert Box */}
        <AnimatePresence>
          {alertMessage && (
            <motion.div
              className="fixed bottom-5 right-5 bg-red-600 text-white py-3 px-5 rounded-lg shadow-lg"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              {alertMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default Compete;
