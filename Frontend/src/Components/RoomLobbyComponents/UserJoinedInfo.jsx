import { motion } from "framer-motion";
import UsersContext from "../../context/UsersContext/UsersContext";
import { useContext } from "react";

const UserJoinedInfo = () => {
  const { users } = useContext(UsersContext);

  console.log(" Users : ", users);
  // Ensure it's always an array

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-lg bg-gray-800 bg-opacity-80 backdrop-blur-lg shadow-xl rounded-xl p-6 border border-gray-700"
    >
      <h2 className="text-yellow-400 text-xl font-bold text-center">
        Users in Room
      </h2>
      <p className="text-gray-300 text-center mt-1">
        {Object.values(users).length}/4 Players Joined
      </p>

      <div className="mt-4 space-y-3 text-yellow-500">
        {Object.values(users).map((user, index) => (
          <motion.div
            key={user.email} // Use email as unique identifier
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex items-center justify-between  p-3 rounded-lg shadow-md text-white`}
            style={{
              backgroundColor: user.color,
            }}
          >
            <span className="font-semibold">
              {user.name} {user.host ? "(host)" : null}
            </span>
            <span className="text-sm">🟢 Online</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default UserJoinedInfo;
