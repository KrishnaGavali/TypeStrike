import React, { useEffect, useContext } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import UsersContext from "../../context/UsersContext/UsersContext";
import StartGameContext from "../../context/StartGame/StartGameContext";
import GameOverContext from "../../context/GameOverContext/GameOverContext";
import UserStatsContext from "../../context/UserStatsContext/UserStatsContext";

const GameOver = () => {
  const navigate = useNavigate();
  const { users, setUsers } = useContext(UsersContext);
  const { setStartGame } = useContext(StartGameContext);
  const { GameOver, setGameOver } = useContext(GameOverContext);
  const { setUserStats } = useContext(UserStatsContext);

  useEffect(() => {
    console.log("Users from GameOver", users);
  }, [users]);

  // Use the provided users, sorted by position
  const sortedResults =
    Object.values(users).length > 0
      ? [...Object.values(users)].sort((a, b) => a.position - b.position)
      : [
          {
            name: "SpeedTyper",
            wpm: 85,
            accuracy: 96,
            position: 1,
            color: "#ef4444",
          },
          {
            name: "KeyboardNinja",
            wpm: 72,
            accuracy: 93,
            position: 2,
            color: "#3b82f6",
          },
          {
            name: "WordWizard",
            wpm: 65,
            accuracy: 91,
            position: 3,
            color: "#10b981",
          },
        ];

  // Get top 3 players or fewer if less than 3 players
  const topThree = sortedResults.slice(0, 3);

  // Medal colors
  const medalColors = {
    1: "bg-yellow-400", // Gold
    2: "bg-gray-300", // Silver
    3: "bg-amber-600", // Bronze
  };

  const handleBackToLobby = () => {
    setStartGame(false);
    setGameOver(false);
    // setUsers wordindex and letter index to 0
    const updatedUsers = { ...users };
    Object.keys(updatedUsers).forEach((user) => {
      updatedUsers[user].wordIndex = 0;
      updatedUsers[user].letterIndex = 0;
      updatedUsers[user].wpm = 0;
      updatedUsers[user].accuracy = 0;
    });

    setUsers(updatedUsers);

    setUserStats({
      typedLetters: 1,
      correctLetters: 1,
      wrongletters: 1,
      typedWords: 1,
    });

    navigate("/compete");
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold text-center mb-10 text-yellow-400"
      >
        Game Over
      </motion.div>

      <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-12 w-full max-w-4xl">
        {topThree.map((player) => {
          // Determine display order based on position
          const displayOrder =
            player.position === 1
              ? "order-2 md:scale-110 z-10"
              : player.position === 2
              ? "order-1"
              : "order-3";

          return (
            <motion.div
              key={player.userId || player.email}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (player.position - 1) * 0.2 }}
              className={`relative flex flex-col items-center ${displayOrder}`}
            >
              {/* Position indicator */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.8 + (player.position - 1) * 0.2,
                  type: "spring",
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  medalColors[player.position] || "bg-gray-500"
                } text-gray-900 font-bold text-xl mb-2`}
              >
                {player.position}
              </motion.div>

              {/* Podium */}
              <motion.div
                initial={{ height: 0 }}
                animate={{
                  height:
                    player.position === 1
                      ? 180
                      : player.position === 2
                      ? 140
                      : 100,
                }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{ backgroundColor: player.color }}
                className="w-40 rounded-t-lg flex flex-col items-center justify-start pt-4 px-3"
              >
                <div className="text-center font-bold truncate w-full">
                  {player.name || `Player ${player.position}`}
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + (player.position - 1) * 0.2 }}
                  className="text-lg font-mono mt-2"
                >
                  {player.wpm || 0} WPM
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 + (player.position - 1) * 0.2 }}
                  className="text-sm font-mono mt-1"
                >
                  Accuracy: {player.accuracy || 0}%
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <button
          className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all"
          onClick={handleBackToLobby}
        >
          Back to Compete
        </button>
      </div>
    </div>
  );
};

export default GameOver;
