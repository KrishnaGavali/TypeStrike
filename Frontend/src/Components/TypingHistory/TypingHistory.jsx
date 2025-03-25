import { useEffect, useState, useContext } from "react";
import { motion } from "motion/react"; // Corrected import
import "./TypingHistory.css";
import AuthContext from "../../Context/AuthContext/AuthContext";

const TypingHistory = () => {
  const [typingHistory, setTypingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTypingHistory = async () => {
      try {
        const localIpAdd = import.meta.env.VITE_LOCAL_IP_ADDRESS;
        const response = await fetch(
          `http://${localIpAdd}:3000/typing/history`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              userId: user.userId,
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          setTypingHistory(data.typingHistory);
        } else {
          console.error("Failed to fetch typing history");
        }
      } catch (error) {
        console.error("Error fetching typing history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTypingHistory();
  }, []);

  return (
    <div className="p-6 flex flex-col items-center h-96">
      <h1 className="text-yellow-500 text-3xl font-bold mb-6">
        Typing History
      </h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : typingHistory.length === 0 ? (
        <p className="text-gray-400">No typing history found.</p>
      ) : (
        <div className="w-full max-w-2xl overflow-y-auto max-h-80 space-y-4 custom-scroll">
          {typingHistory.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="bg-yellow-500 p-4 rounded-xl shadow-lg flex justify-between items-center "
            >
              <div>
                <p className="text-gray-800 font-semibold text-lg">
                  WPM: {entry.wpm}
                </p>
                <p className="text-gray-800 text-sm">
                  Accuracy: {entry.accuracy.toFixed(2)}%
                </p>
              </div>
              <p className="text-gray-700 text-sm">
                {new Date(entry.createdAt).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TypingHistory;
