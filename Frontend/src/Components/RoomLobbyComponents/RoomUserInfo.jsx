import { motion } from "framer-motion";
import { useState, useContext } from "react";
import { useParams } from "react-router";
import AuthContext from "../../context/AuthContext/AuthContext";
import TestTimeContext from "../../context/TestTimeContext/TestTimeContext";
import StartGameContext from "../../context/StartGame/StartGameContext";
import UsersContext from "../../context/UsersContext/UsersContext";

const RoomUserInfo = () => {
  const { id } = useParams();
  const [idCopied, setIdCopied] = useState(false);
  const { user } = useContext(AuthContext);
  const { users } = useContext(UsersContext);
  const { setStartGame } = useContext(StartGameContext);

  const { testTime, setTestTime } = useContext(TestTimeContext);
  const [alertMessage, setAlertMessage] = useState(null);

  return (
    <div className="flex flex-col items-start justify-center bg-gray-900 px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-[27rem] bg-gray-800 bg-opacity-70 backdrop-blur-lg shadow-xl rounded-xl p-8 border border-gray-700"
      >
        <div className="flex items-center justify-center mb-6">
          <img
            src="https://img.icons8.com/fluency-systems-filled/48/eab308/lightning-bolt.png"
            alt="Logo"
            className="w-12 animate-pulse"
          />
          <h2 className="text-3xl font-bold text-yellow-400 ml-3 drop-shadow-lg">
            TypeStrike Lobby
          </h2>
        </div>

        <div className="text-gray-300 text-center space-y-2">
          <p>
            <strong className="text-yellow-400">Name:</strong> {user.name}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between bg-gray-700 text-yellow-300 p-3 rounded-lg shadow-md">
          <p className="text-lg font-mono tracking-widest">{id}</p>
          <motion.button
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-2 px-4 rounded-lg transition-all duration-300 shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              navigator.clipboard.writeText(id);
              setIdCopied(true);
              setTimeout(() => {
                setIdCopied(false);
              }, 2000);
            }}
          >
            {idCopied ? "✔ Copied!" : "Copy"}
          </motion.button>
        </div>

        <div className="mt-6 flex flex-col items-center bg-gray-800 bg-opacity-80 backdrop-blur-lg shadow-lg border border-gray-700 p-4 rounded-lg">
          <p className="text-lg text-gray-300 mb-4">
            <strong className="text-yellow-400">Test Time:</strong> {testTime}{" "}
            seconds
          </p>

          <div className="flex gap-3 bg-gray-700 bg-opacity-60 p-2 rounded-full shadow-md">
            {[15, 30, 45, 60].map((time) => (
              <motion.button
                key={time}
                className={`px-5 py-2 rounded-full  font-semibold text-sm text-gray-300 transition-all duration-300 hover:bg-gray-600 ${
                  testTime === time ? "bg-yellow-500 text-gray-800" : ""
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  user.host
                    ? setTestTime(time)
                    : setAlertMessage("Only host can change test time");
                }}
              >
                {time}s
              </motion.button>
            ))}
          </div>

          {user.host && (
            <motion.button
              className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-3 px-6 rounded-lg font-bold text-lg transition-all duration-300 shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (Object.values(users).length < 2) {
                  console.log("Need at least 2 players to start game");
                  setAlertMessage("Need at least 2 players to start game");
                  return;
                }

                setStartGame(true);
              }}
            >
              🚀 Start Game
            </motion.button>
          )}
        </div>
      </motion.div>

      {alertMessage && (
        <motion.div
          className="absolute top-4 right-4 bg-yellow-500 text-gray-800  p-4 rounded-lg shadow-lg flex items-center"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="mr-4">{alertMessage}</span>
          <button
            className="bg-gray-800 hover:bg-gray-700 text-yellow-500 font-bold py-2 px-4 rounded"
            onClick={() => setAlertMessage(null)}
          >
            Ok
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default RoomUserInfo;
