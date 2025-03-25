import { useContext, useState } from "react";
import { motion } from "motion/react";
import AuthContext from "../context/AuthContext/AuthContext.js";
import TypingHistory from "../Components/TypingHistory/TypingHistory";
import Friends from "../Components/Friends/Friends.jsx";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    console.log("Copying to clipboard : ", user.userId);
    navigator.clipboard.writeText(user.userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="w-full h-[80vh] p-4 flex justify-center items-center"
      id="main-profile-div"
    >
      <motion.div
        className="w-full max-w-4xl rounded-lg shadow-lg flex flex-col p-6 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800"
        id="profile-history-div"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6" id="profile-div">
          <h2 className="text-2xl font-bold mb-2 text-yellow-500">
            Name: {user.name}
          </h2>
          <p className="text-lg text-yellow-500 mb-1">Email: {user.email}</p>
          <p className="text-lg text-yellow-500 justify-between flex items-center">
            UserID: {user.userId}
            <motion.button
              className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={copyToClipboard}
            >
              {copied ? "Copied!" : "Copy"}
            </motion.button>
          </p>
        </div>
        <div className="border-t border-yellow-500 pt-4" id="history-div">
          <TypingHistory />
        </div>
      </motion.div>
      <div
        className="w-full h-[110%] max-w-4xl bg-gradient-to-r m-2 from-gray-800 via-gray-900 to-gray-800 rounded-lg shadow-lg px-3 py-1"
        id="friends-div"
      >
        <Friends />
      </div>
    </div>
  );
};

export default Profile;
