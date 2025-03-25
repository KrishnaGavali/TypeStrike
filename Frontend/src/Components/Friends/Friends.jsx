import { useEffect, useState, useContext } from "react";
import { motion } from "motion/react";
import FriendsAPI from "./Friends";
import AuthContext from "../../context/AuthContext/AuthContext";
import "./Friends.css";

const Friends = () => {
  const { user } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchIdData, setSearchIdData] = useState([]);
  const [message, setMessage] = useState("");
  const [showFriends, setShowFriends] = useState(true);

  const fetchFriends = async () => {
    if (user.email) {
      try {
        const data = await FriendsAPI.getFriends(user.email);
        setFriends(data.friends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => setMessage(""), 5000);
  });

  useEffect(() => {
    fetchFriends();
  }, [user.email]);

  const searchFriend = async () => {
    try {
      const data = await FriendsAPI.searchFriends(searchId);
      setSearchIdData([data.user]);
    } catch (error) {
      setMessage("User not found. Check the User ID and try again.");
    }
  };

  const handleAddFriend = async (friendEmail) => {
    if (friends.some((friend) => friend.email === friendEmail)) {
      setMessage("This user is already your friend!");
      return;
    }
    try {
      await FriendsAPI.addFriend(user.email, friendEmail);
      setMessage("Friend Added Sucessfully");
      fetchFriends();
    } catch (error) {
      setMessage("Failed to add friend. Please try again later.");
    }
  };

  return (
    <div className="p-8 text-center">
      {message && <p className="text-yellow-500 font-bold mb-4">{message}</p>}

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-yellow-500 text-3xl font-bold mb-6"
      >
        {showFriends ? "Friends List" : "Search & Add Friends"}
      </motion.div>

      <button
        onClick={() => setShowFriends(!showFriends)}
        className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-600 transition mb-6"
      >
        {showFriends ? "Go to Search & Add" : "Go to Friends List"}
      </button>

      {showFriends ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <button
            onClick={fetchFriends}
            className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-600 transition mb-6"
          >
            Refresh
          </button>
          <div className=" h-[330px] overflow-y-scroll scrollbar-hidden">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <motion.div
                  key={friend.email}
                  className="bg-gray-700 text-white p-6 rounded-lg shadow-lg text-left mt-2"
                >
                  <div className="text-yellow-500 text-xl">{friend.name}</div>
                  <p className="text-gray-400">User ID: {friend._id}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400">No friends found.</p>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="flex justify-center gap-2">
            <input
              type="text"
              placeholder="Enter User ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="p-2 rounded-lg bg-gray-700 text-white border border-gray-600"
            />
            <button
              className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              onClick={searchFriend}
            >
              Search
            </button>
          </div>
          {searchIdData.length > 0 ? (
            searchIdData.map((friend) => (
              <motion.div
                key={friend.email}
                className="bg-gray-700 text-white p-6 rounded-lg shadow-lg text-left m-2"
              >
                <div className="text-yellow-500 text-xl">{friend.name}</div>
                <p className="text-gray-400">User ID: {friend.userId}</p>
                <button
                  className="bg-yellow-500 border-2 border-transparent text-gray-900 px-4 py-2 rounded-lg hover:bg-transparent hover:border-yellow-500 hover:text-yellow-500 transition mt-4"
                  onClick={() => handleAddFriend(friend.email)}
                  disabled={friend.userId === user.userId}
                >
                  {friend.userId === user.userId
                    ? "You can't add yourself"
                    : "Add Friend"}
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400">No user found.</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Friends;
