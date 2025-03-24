import { motion } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import UsersContext from "../../context/UsersContext/UsersContext";
import propTypes from "prop-types";
import TestTimeContext from "../../context/TestTimeContext/TestTimeContext";
import UserStatsContext from "../../context/UserStatsContext/UserStatsContext";
import AuthContext from "../../context/AuthContext/AuthContext";
import PropTypes from "prop-types";
import GameOverContext from "../../context/GameOverContext/GameOverContext";

const GamePosition = ({ waiting, handleWaiting }) => {
  const { user } = useContext(AuthContext);
  const { testTime } = useContext(TestTimeContext);
  const { users, setUsers } = useContext(UsersContext);
  const { userStats } = useContext(UserStatsContext);
  const { gameOver, setGameOver } = useContext(GameOverContext);

  const [time, setTime] = useState(testTime);
  const [elapsedTime, setElapsedTime] = useState(0);
  // const [waiting, setWaiting] = useState(true);
  const [waitingTime, setWaitingTime] = useState(10);

  useEffect(() => {
    console.log("User Stats:", userStats);
  }, [userStats]);

  const calculateStats = () => {
    if (!userStats.typedLetters) return [0, 0];

    const accuracy = Math.round(
      (userStats.correctLetters / userStats.typedLetters) * 100
    );
    const wpm = Math.round(userStats.correctLetters / 5 / (elapsedTime / 60));

    return [accuracy, wpm];
  };

  useEffect(() => {
    if (time === testTime) return;

    const [accuracy, wpm] = calculateStats();
    setUsers((prevUsers) => ({
      ...prevUsers,
      [user.email]: {
        ...prevUsers[user.email],
        wpm,
        accuracy,
      },
    }));
  }, [time]);

  useEffect(() => {
    if (waiting) {
      if (waitingTime <= 0) {
        handleWaiting(false);
        setTime(testTime); // Start the test time
        return;
      }

      const waitInterval = setInterval(() => {
        setWaitingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(waitInterval);
            handleWaiting(false);
            setTime(testTime);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(waitInterval);
    } else {
      if (time <= 0) return;

      const gameInterval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(gameInterval);
            if (!gameOver) setGameOver(true);

            return 0;
          }
          return prevTime - 1;
        });

        setElapsedTime((prevElapsed) => prevElapsed + 1);
      }, 1000);

      return () => clearInterval(gameInterval);
    }
  }, [waiting, waitingTime, time]);

  return (
    <div className="w-[30%] lg:w-[25%] mx-2 p-6 rounded-xl text-white bg-gray-900/50 backdrop-blur-lg backdrop-filter">
      {/* Countdown Timer */}
      <div
        className={`flex items-center justify-center text-6xl font-extrabold text-center mb-5 transition-all duration-300 text-yellow-500 rounded-lg border-2 border-transparent ${
          waiting ? "border-yellow-500" : "border-green-500"
        }`}
      >
        {waiting ? (
          <>
            {waitingTime} <span className="text-lg ml-5">wait</span>
          </>
        ) : (
          time
        )}
      </div>

      {/* Player Rankings */}
      <div className="space-y-4">
        {Object.values(users)
          .sort((a, b) => a.position - b.position)
          .map((user, index) => (
            <motion.div
              key={user.email}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-lg text-white shadow-lg 
                bg-gradient-to-r from-gray-800 to-gray-700 border-2 backdrop-blur-lg`}
              style={{ borderColor: user.color }}
            >
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-lg">{user.name}</span>
              </div>
              <div className="text-right text-sm">
                <p>
                  <span className="font-bold text-yellow-300">WPM:</span>{" "}
                  {user.wpm}
                </p>
                <p>
                  <span className="font-bold text-yellow-300">Accuracy:</span>{" "}
                  {user.accuracy}%
                </p>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

GamePosition.propTypes = {
  waiting: PropTypes.bool,
  handleWaiting: PropTypes.func,
};

export default GamePosition;
