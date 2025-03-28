import { useEffect, useState, useRef, useContext } from "react";
import RoomUserInfo from "../Components/RoomLobbyComponents/RoomUserInfo";
import UserJoinedInfo from "../Components/RoomLobbyComponents/UserJoinedInfo";
import MultiplayerTyping from "../Components/MultiplayerTyping/MultiplayerTyping";

import io from "socket.io-client";
import { useNavigate, useParams } from "react-router";
import AuthContext from "../context/AuthContext/AuthContext";
import { motion } from "motion/react"; // ✅ Corrected motion import
import TestTimeContext from "../context/TestTimeContext/TestTimeContext";
import UsersContext from "../context/UsersContext/UsersContext";
import StartGameContext from "../context/StartGame/StartGameContext";
import GameOverContext from "../context/GameOverContext/GameOverContext";
import GameOver from "../Components/MultiplayerTyping/GameOver";

const RoomLobby = () => {
  const socketRef = useRef(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const { testTime, setTestTime } = useContext(TestTimeContext);
  const { users, setUsers } = useContext(UsersContext);
  const { startGame, setStartGame } = useContext(StartGameContext);
  const { gameOver } = useContext(GameOverContext);

  const [alertMessage, setAlertMessage] = useState(null);

  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 0,
    wordIndex: 0,
    letterIndex: 0,
  });

  // Establish socket connection
  useEffect(() => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const socket = io(backendURL);
    socketRef.current = socket;

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Join room after socket is initialized
  useEffect(() => {
    if (!socketRef.current || !user) return;

    const handleRoomNotFound = (data) => {
      if (!data.roomExists) {
        setTimeout(() => setAlertMessage("Room not found"), 1000);
      }
    };

    socketRef.current.on("connect", () => {
      const userData = {
        name: user.name,
        email: user.email,
        userId: user.userId,
        socketId: socketRef.current.id,
        wordIndex: 0,
        letterIndex: 0,
        wpm: 0,
        accuracy: 0,
        host: user.host,
        position: -1,
      };

      socketRef.current.emit("join-room", id, userData, testTime);
    });

    socketRef.current.on("room-not-found", handleRoomNotFound);

    return () => {
      socketRef.current.off("room-not-found", handleRoomNotFound);
    };
  }, [id, user, users, testTime]);

  // Listen for user joined event
  useEffect(() => {
    if (!socketRef.current) return;

    const handleUserJoined = (users) => {
      setUsers(users);
    };

    socketRef.current.on("user-joined", handleUserJoined);

    return () => {
      socketRef.current.off("user-joined", handleUserJoined);
    };
  }, [setUsers]);

  useEffect(() => {
    if (!socketRef.current || !users[user.email]) return;
    if (!startGame) return;

    console.log("Users with host email : ", users[user.email]);
    console.log(
      "wordIndex from word-index-change : ",
      users[user.email].wordIndex
    );
    socketRef.current.emit("word-index-change", {
      email: user.email,
      wordIndex: users[user.email].wordIndex,
      letterIndex: users[user.email].letterIndex,
      accuracy: users[user.email].accuracy || 0,
      wpm: users[user.email].wpm || 0,
      roomId: id,
    });

    console.log("Users : ", users);
  }, [users]);

  useEffect(() => {
    if (gameOver && user.host) {
      socketRef.current.emit("game-over", id);
    }

    socketRef.current.on("game-finished", (users) => {
      Object.values(users).map((backendUser) => {
        setUsers((prevUsers) => ({
          ...prevUsers,
          [backendUser.email]: {
            ...prevUsers[backendUser.email],
            position: backendUser.position,
          },
        }));
      });
    });
  }, [gameOver]);

  useEffect(() => {
    // interval of 1sec emit get users data
    console.log("Interval started");
    const interval = setInterval(() => {
      socketRef.current.emit("get-users", socketRef.current.id, id);
    }, 2000);

    socketRef.current.on("users", (users) => {
      Object.values(users).map((backendUser) => {
        console.log(backendUser);
        if (backendUser.email != user.email) {
          setUsers((prevUsers) => ({
            ...prevUsers,
            [backendUser.email]: {
              ...prevUsers[backendUser.email],
              wordIndex: backendUser.wordIndex,
              letterIndex: backendUser.letterIndex,
              wpm: backendUser.wpm,
              accuracy: backendUser.accuracy,
            },
          }));
        }

        Object.values(users).map((backendUser) => {
          setUsers((prevUsers) => ({
            ...prevUsers,
            [backendUser.email]: {
              ...prevUsers[backendUser.email],
              position: backendUser.position,
            },
          }));
        });
      });
    });

    return () => clearInterval(interval);
  }, [id]);

  // Listen for room full event
  useEffect(() => {
    if (!socketRef.current) return;

    const handleRoomFull = () => {
      setAlertMessage("Room is full");
    };

    socketRef.current.on("room-full", handleRoomFull);

    return () => {
      socketRef.current.off("room-full", handleRoomFull);
    };
  }, []);

  // Listen for test time change
  useEffect(() => {
    if (!socketRef.current) return;

    const handleTestTimeChange = (time) => {
      if (!user.host) {
        setTestTime(time);
      }
    };

    if (user.host) {
      socketRef.current.emit("change-test-time", id, testTime);
    }

    socketRef.current.on("test-time-change", handleTestTimeChange);

    return () => {
      socketRef.current.off("test-time-change", handleTestTimeChange);
    };
  }, [testTime, user, id, setTestTime]);

  useEffect(() => {
    if (users[user.email]) {
      setStats({
        ...stats,
        wordIndex: users[user.email].wordIndex,
        letterIndex: users[user.email].letterIndex,
        wpm: users[user.email].wpm,
        accuracy: users[user.email].accuracy,
      });
      console.log("User found in room, and stats updated");
    } else {
      console.log("User not found in room ");
    }
  }, [users]);

  // Listen for start game event
  useEffect(() => {
    if (!socketRef.current) return;

    const handleStartGame = () => {
      if (!user.host) {
        setStartGame(true);
        console.log("Game started");
      }
    };

    if (user.host) {
      socketRef.current.emit("game-started", id);
    }

    socketRef.current.on("start-game", handleStartGame);

    return () => {
      socketRef.current.off("start-game", handleStartGame);
    };
  }, [startGame, user, id, setStartGame]);

  return (
    <div className="w-full h-[80vh] p-4 flex justify-center items-center relative overflow-hidden">
      {startGame ? (
        !gameOver ? (
          <MultiplayerTyping />
        ) : (
          <GameOver />
        )
      ) : (
        <>
          <RoomUserInfo />
          <UserJoinedInfo />
        </>
      )}

      {alertMessage && (
        <motion.div
          className="absolute top-4 right-4 bg-yellow-500 text-gray-800 p-4 rounded-lg shadow-lg flex items-center"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="mr-4">{alertMessage}</span>
          <button
            className="bg-gray-800 hover:bg-gray-700 text-yellow-500 font-bold py-2 px-4 rounded"
            onClick={() => navigate("/compete")}
          >
            Ok
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default RoomLobby;
