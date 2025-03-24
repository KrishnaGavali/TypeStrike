import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import GamePosition from "./GamePosition";
import jsonPara from "./TypingText.json";
import "./MultiplayerTyping.css";
import UsersContext from "../../context/UsersContext/UsersContext";
import AuthContext from "../../context/AuthContext/AuthContext";
import { motion } from "motion/react";
import propTypes from "prop-types";
import UserStatsContext from "../../context/UserStatsContext/UserStatsContext";
import GameOverContext from "../../context/GameOverContext/GameOverContext";

const MultiplayerTyping = () => {
  const { userStats, setUserStats } = useContext(UserStatsContext);

  const [caratPosition, setCaratPosition] = useState({});
  const [waiting, setWaiting] = useState(true);
  const { gameOver } = useContext(GameOverContext);

  const handleWaitingChange = (value) => {
    setWaiting(value);
  };

  // set CaratPositon when components render first time

  const wordsArray = useMemo(() => {
    return jsonPara?.paragraph?.split(" ")?.map((word) => word.split("")) || [];
  }, []);

  const { users, setUsers } = useContext(UsersContext);
  const { user } = useContext(AuthContext);
  const inputRef = useRef(null);

  const wordsSpanRefsArray = useMemo(() => {
    return Array(wordsArray.length)
      .fill(0)
      .map(() => React.createRef());
  }, [wordsArray]);

  useEffect(() => {
    if (!users[user.email]) {
      setUsers((prevUsers) => ({
        ...prevUsers,
        [user.email]: {
          ...prevUsers[user.email],
          wordIndex: 0,
          letterIndex: 0,
        },
      }));
    }
  }, [users, setUsers, user.email]);

  useEffect(() => {
    Object.values(users).map((backendUser) => {
      if (backendUser.email !== user.email) {
        const position = updateCaratPosition(
          backendUser.wordIndex,
          backendUser.letterIndex
        );

        const top = position[0];
        const left = position[1];

        setCaratPosition((prevCaratPosition) => ({
          ...prevCaratPosition,
          [backendUser.email]: {
            email: backendUser.email,
            color: backendUser.color,
            top: top,
            left: left,
          },
        }));
      }
    });
  }, [users]);

  const focusOnInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    focusOnInput();
  }, []);

  let top, left;

  const updateCaratPosition = (wordIndex, letterIndex, isLastWord = false) => {
    const letterSpan =
      wordsSpanRefsArray[wordIndex]?.current?.children[letterIndex];
    const wrapperRect = document
      .getElementById("wordsWrapper")
      .getBoundingClientRect();

    if (letterSpan) {
      const letterSpanRect = letterSpan.getBoundingClientRect();
      top = letterSpanRect.top - wrapperRect.top;
      left = letterSpanRect.left - wrapperRect.left;
    }

    return [top, left + (isLastWord ? 20 : 0)];
  };

  useEffect(() => {
    const caratPositionData = {};

    Object.values(users).map((user) => {
      const position = updateCaratPosition(user.wordIndex, user.letterIndex);

      const top = position[0];
      const left = position[1];

      caratPositionData[user.email] = {
        email: user.email,
        color: user.color,
        top: top,
        left: left,
      };
    });

    setCaratPosition(caratPositionData);
  }, []);

  const handleKeyDownAndCheck = (e) => {
    e.preventDefault();

    if (waiting) return;
    if (gameOver) return;

    if (!wordsArray.length || e.key === "Shift" || e.key === "Enter") return;

    const currentUser = users[user.email] || { wordIndex: 0, letterIndex: 0 };
    let { wordIndex, letterIndex } = currentUser;
    const currentWord = wordsArray[wordIndex] || [];
    const letterToType = currentWord[letterIndex];
    let isLastLetter =
      letterIndex === wordsSpanRefsArray[wordIndex].current.children.length - 1;

    // **Move to next word on spacebar press (only if the word is fully typed)**
    if (e.key === " " && letterIndex === currentWord.length) {
      let isWordCorrect = true;

      Array.from(wordsSpanRefsArray[wordIndex].current.children).map(
        (letter) => {
          if (letter.classList.contains("incorrect")) {
            isWordCorrect = false;
          }
        }
      );

      if (!isWordCorrect) return;

      setUsers((prevUsers) => ({
        ...prevUsers,
        [user.email]: {
          ...prevUsers[user.email],
          wordIndex: wordIndex + 1,
          letterIndex: 0,
        },
      }));

      const carat_position = updateCaratPosition(wordIndex + 1, 0);
      setCaratPosition((prevCaratPosition) => ({
        ...prevCaratPosition,
        [user.email]: {
          ...prevCaratPosition[user.email],
          top: carat_position[0],
          left: carat_position[1],
        },
      }));

      setUserStats((prevStats) => ({
        ...prevStats,
        typedWords: prevStats.typedWords + 1,
      }));

      return;
    }

    // **Prevent spacebar if the word is not fully typed**
    if (e.key === " ") return;

    // **Handle Backspace (Only within the current word)**
    if (e.key === "Backspace" && letterIndex > 0) {
      setUsers((prevUsers) => ({
        ...prevUsers,
        [user.email]: {
          ...prevUsers[user.email],
          wordIndex,
          letterIndex: letterIndex - 1,
        },
      }));

      const carat_position = updateCaratPosition(wordIndex, letterIndex - 1);
      setCaratPosition((prevCaratPosition) => ({
        ...prevCaratPosition,
        [user.email]: {
          ...prevCaratPosition[user.email],
          top: carat_position[0],
          left: carat_position[1],
        },
      }));

      wordsSpanRefsArray[wordIndex]?.current?.children[
        letterIndex - 1
      ]?.classList.remove("correct", "incorrect");
      return;
    }

    // **Ignore Backspace if at the start of the word**
    if (e.key === "Backspace") return;

    if (letterIndex === currentWord.length) return;

    // **Handle Correct Typing**
    if (e.key === letterToType) {
      if (letterIndex < wordsSpanRefsArray[wordIndex].current.children.length) {
        setUsers((prevUsers) => ({
          ...prevUsers,
          [user.email]: {
            ...prevUsers[user.email],
            wordIndex,
            letterIndex: letterIndex + 1,
          },
        }));
      }
      let carat_position;
      if (isLastLetter) {
        carat_position = updateCaratPosition(wordIndex, letterIndex, true);
      } else {
        carat_position = updateCaratPosition(wordIndex, letterIndex + 1);
      }
      // carat_position = updateCaratPosition(wordIndex, letterIndex + 1);

      setCaratPosition((prevCaratPosition) => ({
        ...prevCaratPosition,
        [user.email]: {
          ...prevCaratPosition[user.email],
          top: carat_position[0],
          left: carat_position[1],
        },
      }));

      wordsSpanRefsArray[wordIndex]?.current?.children[
        letterIndex
      ]?.classList.add("correct");

      setUserStats((prevStats) => ({
        ...prevStats,
        typedLetters: prevStats.typedLetters + 1,
        correctLetters: prevStats.correctLetters + 1,
      }));
    }
    // **Handle Incorrect Typing**
    else {
      wordsSpanRefsArray[wordIndex]?.current?.children[
        letterIndex
      ]?.classList.add("incorrect");

      if (letterIndex < wordsSpanRefsArray[wordIndex].current.children.length) {
        setUsers((prevUsers) => ({
          ...prevUsers,
          [user.email]: {
            ...prevUsers[user.email],
            wordIndex,
            letterIndex: letterIndex + 1,
          },
        }));
      }

      let carat_position;
      if (isLastLetter) {
        carat_position = updateCaratPosition(wordIndex, letterIndex, true);
      } else {
        carat_position = updateCaratPosition(wordIndex, letterIndex + 1);
      }
      setCaratPosition((prevCaratPosition) => ({
        ...prevCaratPosition,
        [user.email]: {
          ...prevCaratPosition[user.email],
          top: carat_position[0],
          left: carat_position[1],
        },
      }));

      setUserStats((prevStats) => ({
        ...prevStats,
        typedLetters: prevStats.typedLetters + 1,
        wrongLetters: prevStats.wrongLetters + 1,
      }));
    }

    // **Scroll to the next word when required**
    const wordToScroll = wordsSpanRefsArray[wordIndex + 1]?.current;
    if (wordToScroll) {
      wordToScroll.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

  return (
    <div className="w-full h-[80vh] p-4 flex flex-col lg:flex-row items-center justify-start overflow-hidden">
      {/* Game Position Component */}
      <GamePosition waiting={waiting} handleWaiting={handleWaitingChange} />

      {/* Typing Text Display */}
      <div
        className="text-yellow-500 overflow-hidden bg-gray-900/50 rounded-lg p-4 w-[70%]  h-[60%] flex justify-center"
        onClick={focusOnInput}
      >
        <div className=" flex" id="carat-div">
          {Object.values(caratPosition).map((positionUser) => (
            <motion.div
              key={positionUser.email}
              style={{
                backgroundColor: positionUser.color,
                top: positionUser.top,
                left: positionUser.left,
                position: "relative",
                zIndex: positionUser.email == user.email ? "50" : "-50",
                width: "2px",
              }}
              className=" h-9"
              transition={{ duration: 0.075, ease: "easeInOut" }}
              layout
            ></motion.div>
          ))}
        </div>
        <div
          className="flex flex-wrap gap-2 text-3xl justify-start"
          id="wordsWrapper"
        >
          {wordsArray.map((word, index) => (
            <span
              ref={wordsSpanRefsArray[index]}
              key={index}
              className="inline-flex mr-6"
            >
              {word.map((letter, i) => (
                <span key={i} className="font-mono mr-2">
                  {letter}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Hidden Input Field */}
      <div id="hidden-input">
        <input
          type="text"
          className="opacity-0"
          style={{ position: "fixed", top: "-100px" }}
          placeholder="Start Typing..."
          id="input"
          ref={inputRef}
          onKeyDown={handleKeyDownAndCheck}
        />
      </div>
    </div>
  );
};

MultiplayerTyping.propTypes = {
  handleWordIndexChange: propTypes.func,
};

export default MultiplayerTyping;
