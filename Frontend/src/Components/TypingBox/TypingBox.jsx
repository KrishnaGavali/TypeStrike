import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  createRef,
} from "react";
import "./TypingBox.css";
import jsonPara from "./p1.json";
import { AnimatePresence, motion } from "motion/react";
import { LazyMotion, domAnimation } from "motion/react";
import TypingResult from "../TypingResult/TypingResult";
import { Popover } from "radix-ui";

const TypingBox = () => {
  // State variables
  const [isInFocus, setIsInFocus] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [caratPosition, setCaratPosition] = useState({ top: 0, left: 0 });
  const [typingStats, setTypingStats] = useState({
    noOfTypedWords: 0,
    noOfTypedLetters: 0,
    noOfCorrectTypedLetters: 0,
    noOfWrongTypedLetters: 0,
    rawSpeed: 0,
    netSpeed: 0,
    rawSpeedArray: [],
    netSpeedArray: [],
    typingAccuracy: 0,
  });

  const [testTime, setTestTime] = useState(30);
  const [currentTime, setCurrentTime] = useState(testTime);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showStats, setShowStats] = useState(false); // Controls visibility of stats

  const inputRef = useRef(null);

  // Memoized array of words split into letters
  const wordsArray = useMemo(() => {
    return jsonPara.paragraph
      .split(" ") // Split paragraph into words
      .map((word) => word.split(""));
  }, []);

  // Memoized array of refs for each word
  const wordsSpanRefsArray = useMemo(() => {
    return Array(wordsArray.length)
      .fill(0)
      .map(() => createRef(null));
  }, [wordsArray]);

  // Focus on input field
  const focusOnInput = useCallback(() => {
    inputRef.current?.focus();
    setIsInFocus(true);
  }, []);

  // Focus on input when component mounts
  useEffect(() => {
    focusOnInput();
  }, [focusOnInput]);

  // Handlers for focus and blur events
  const handleFocus = useCallback(() => setIsInFocus(true), []);
  const handleBlur = useCallback(() => setIsInFocus(false), []);

  // Update carat position based on current word and letter index
  const updateCaratPosition = useCallback((currentWord, currentLetterIndex) => {
    if (!currentWord) return;

    const wrapperRect = document
      .getElementById("typing-words")
      .getBoundingClientRect();
    let top, left;

    if (currentLetterIndex >= currentWord.childNodes.length) {
      const lastLetterRect =
        currentWord.childNodes[
          currentWord.childNodes.length - 1
        ].getBoundingClientRect();
      top = lastLetterRect.top - wrapperRect.top;
      left = lastLetterRect.left - wrapperRect.left + 20;
    } else {
      const letterRect =
        currentWord.childNodes[currentLetterIndex].getBoundingClientRect();
      top = letterRect.top - wrapperRect.top;
      left = letterRect.left - wrapperRect.left;
    }

    setCaratPosition({ top, left });
  }, []);

  // Handle key down events and update typing stats
  const handleKeyDownAndCheck = useCallback(
    (e) => {
      if (!inputRef.current) return;

      if (!isTimerRunning) {
        setIsTimerRunning(true);
      }

      e.preventDefault();

      const currentWord = wordsSpanRefsArray[currentWordIndex]?.current;

      const wordToScroll = wordsSpanRefsArray[currentWordIndex + 12]?.current;

      if (wordToScroll) {
        wordToScroll.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }

      if (!wordsArray.length || e.key === "Shift") return;

      if (e.key === "Backspace") {
        if (currentLetterIndex > 0) {
          const prevLetter = currentWord.childNodes[currentLetterIndex - 1];
          prevLetter.classList.remove("correct", "incorrect");
          setCurrentLetterIndex((prev) => prev - 1);
          updateCaratPosition(currentWord, currentLetterIndex - 1);
        }
        return;
      }

      if (e.key === " ") {
        if (
          currentWordIndex === wordsArray.length - 1 &&
          currentLetterIndex === currentWord.childNodes.length
        ) {
          setShowStats(true);
        }

        if (currentLetterIndex === currentWord.childNodes.length) {
          setCurrentWordIndex((prev) => {
            const newIndex = prev + 1;
            setCurrentLetterIndex(0);
            updateCaratPosition(wordsSpanRefsArray[newIndex]?.current, 0);
            return newIndex;
          });
          setTypingStats((prev) => ({
            ...prev,
            noOfTypedWords: prev.noOfTypedWords + 1,
          }));
        }
        return;
      }

      setTypingStats((prev) => ({
        ...prev,
        noOfTypedLetters: prev.noOfTypedLetters + 1,
      }));

      if (currentWord && currentLetterIndex < currentWord.childNodes.length) {
        const currentLetter = currentWord.childNodes[currentLetterIndex];
        currentLetter.classList.add(
          e.key === currentLetter.innerText ? "correct" : "incorrect"
        );

        setTypingStats((prev) => ({
          ...prev,
          noOfCorrectTypedLetters:
            e.key === currentLetter.innerText
              ? prev.noOfCorrectTypedLetters + 1
              : prev.noOfCorrectTypedLetters,
          noOfWrongTypedLetters:
            e.key !== currentLetter.innerText
              ? prev.noOfWrongTypedLetters + 1
              : prev.noOfWrongTypedLetters,
        }));

        setCurrentLetterIndex((prev) => prev + 1);
        updateCaratPosition(currentWord, currentLetterIndex + 1);
      }
    },
    [
      currentLetterIndex,
      currentWordIndex,
      updateCaratPosition,
      wordsArray.length,
      wordsSpanRefsArray,
      typingStats.noOfTypedLetters,
    ]
  );

  // Calculate typing accuracy
  const calculateAccuracy = () => {
    const { noOfTypedLetters, noOfCorrectTypedLetters } = typingStats;
    const accuracy = (noOfCorrectTypedLetters / noOfTypedLetters) * 100;
    return accuracy;
  };

  // Calculate typing speed
  const calculateSpeed = () => {
    const { noOfTypedLetters, noOfCorrectTypedLetters } = typingStats;

    // Calculate the time elapsed in minutes (time is in seconds, so divide by 60)
    const pastTime = (testTime - currentTime) / 60; // Convert time from seconds to minutes

    if (pastTime <= 0) {
      return { "Raw Speed": 0, "Net Speed": 0 }; // Prevent division by zero if pastTime is too small
    }

    // Calculate raw speed (noOfTypedLetters / 5 gives words per minute)
    const rawSpeed = noOfTypedLetters / 5 / pastTime;

    // Calculate net speed
    const netSpeed = noOfCorrectTypedLetters / 5 / pastTime;

    // Return speeds, rounding to two decimal places for better display
    const speed = {
      "Raw Speed": rawSpeed.toFixed(2),
      "Net Speed": netSpeed.toFixed(2),
    };

    return speed;
  };

  const resetTypingBox = (newTime = 30) => {
    setShowStats(false); // Hide TypingResult first

    setTypingStats({
      noOfTypedWords: 0,
      noOfTypedLetters: 0,
      noOfCorrectTypedLetters: 0,
      noOfWrongTypedLetters: 0,
      typingAccuracy: 0,
      rawSpeed: 0,
      netSpeed: 0,
      rawSpeedArray: [],
      netSpeedArray: [],
    });

    setCurrentTime(newTime);
    setIsTimerRunning(false);

    // Reset indices first
    setCurrentWordIndex(0);
    setCurrentLetterIndex(0);

    // Wait for state update before updating the caret position
    setTimeout(() => {
      focusOnInput();
      updateCaratPosition(wordsSpanRefsArray[0]?.current, 0);
    }, 10); // Small delay to ensure state is updated first

    wordsSpanRefsArray.forEach((wordRef) => {
      if (wordRef.current) {
        wordRef.current.childNodes.forEach((letter) => {
          letter.classList.remove("correct", "incorrect");
        });
      }
    });

    const wordToScroll = wordsSpanRefsArray[0]?.current;
    if (wordToScroll) {
      wordToScroll.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // Timer effect to update current time and typing stats
  useEffect(() => {
    if (currentTime > 0 && !showStats && isTimerRunning) {
      const timer = setInterval(() => {
        setCurrentTime((prev) => prev - 1);
      }, 1000);
      const speed = calculateSpeed();
      setTypingStats((prev) => ({
        ...prev,
        rawSpeed: parseInt(speed["Raw Speed"]).toFixed(2),
        netSpeed: parseInt(speed["Net Speed"]).toFixed(2),
        rawSpeedArray: [...prev.rawSpeedArray, speed["Raw Speed"]],
        netSpeedArray: [...prev.netSpeedArray, speed["Net Speed"]],
      }));

      return () => clearInterval(timer);
    } else if (currentTime === 0) {
      setTypingStats((prev) => ({
        ...prev,
        typingAccuracy: calculateAccuracy(),
      }));

      setShowStats(true);
      console.log("Time's up!");
      console.log("TypingStats : ", typingStats);
    }
  }, [currentTime, showStats, isTimerRunning]);

  useEffect(() => {
    console.log("Show Stats Changed, reRendering");
  }, [
    showStats,
    currentLetterIndex,
    currentWordIndex,
    caratPosition.top,
    caratPosition.left,
  ]);

  return (
    <>
      <LazyMotion features={domAnimation}>
        <div id="typingbox-div" className="h-96">
          <AnimatePresence mode="wait">
            {!showStats ? (
              <div
                id="main-typingBox-div"
                className={`relative flex jetbrains-mono items-center justify-center flex-grow h-96 flex-col mt-16`}
              >
                {!showStats && (
                  <div className="text-center w-20">
                    <input
                      ref={inputRef}
                      type="text"
                      className="opacity-0"
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDownAndCheck}
                    />
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {!showStats && (
                    <div className="flex justify-between w-[90%] mb-5">
                      <p className=" w-52 text-xl">
                        {typingStats.noOfTypedWords + " : Typed Words"}
                      </p>
                      <div className="flex justify-center gap-2 text-xl">
                        {[15, 30, 35, 40, 45, 60].map((time) => (
                          <button
                            key={time}
                            className={`${
                              testTime === time
                                ? "bg-yellow-400 text-gray-900"
                                : null
                            } px-2 py-1 rounded transition-all duration-300`}
                            onClick={() => {
                              setTestTime(time);
                              setCurrentTime(time);
                              setIsInFocus(true);
                              resetTypingBox(time);
                            }}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                      <p className="w-52 text-3xl flex justify-center">
                        <AnimatePresence mode="popLayout">
                          <motion.span
                            key={currentTime}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                          >
                            {currentTime}
                          </motion.span>
                        </AnimatePresence>
                      </p>
                    </div>
                  )}
                </AnimatePresence>
                <div
                  className={`relative w-[90%] ${
                    showStats ? "opacity-0" : null
                  } overflow-hidden h-[48%] rounded-md`}
                  onClick={focusOnInput}
                >
                  <motion.div
                    className={`h-[40px] w-[2px] bg-yellow-400 absolute ${
                      isInFocus ? "opacity-100" : "opacity-0"
                    }`}
                    transition={{ duration: 0.075, ease: "easeInOut" }}
                    style={{
                      top: `${caratPosition.top}px`,
                      left: `${caratPosition.left}px`,
                    }}
                    layout
                    id="carat"
                  ></motion.div>
                  <motion.div
                    className={`flex flex-wrap text-3xl transition-all duration-300 font-extralight ${
                      !isInFocus ? "blur-sm rounded-full" : null
                    }`}
                    id="typing-words"
                    layout
                  >
                    <AnimatePresence mode="wait">
                      {wordsArray.map((word, wordIndex) => (
                        <span
                          className="word mr-6"
                          key={wordIndex}
                          ref={wordsSpanRefsArray[wordIndex]}
                        >
                          {word.map((letter, letterIndex) => (
                            <span key={letterIndex}>{letter}</span>
                          ))}
                        </span>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            ) : (
              <motion.div
                className="h-full w-full mt-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <TypingResult Stats={typingStats} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className=" flex justify-center items-center">
          <motion.button
            className="z-50"
            onClick={() => resetTypingBox(testTime)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileTap={{ scale: 0.9, rotate: 360, opacity: 0.5 }}
            transition={{ duration: 0.3 }}
            layout
          >
            <img
              width="48"
              height="48"
              className="cursor-pointer"
              src="https://img.icons8.com/sf-black-filled/64/eab308/recurring-appointment.png"
              alt="recurring-appointment"
            />
          </motion.button>
          {showStats && (
            <Popover.Root>
              <Popover.Trigger className="z-50 ml-4">
                <motion.button
                  className="z-50 ml-4"
                  onClick={() => console.log("Save button clicked")}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  whileTap={{ scale: 0.9, opacity: 0.5 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <img
                    width="48"
                    height="48"
                    className="cursor-pointer"
                    src="https://img.icons8.com/sf-black-filled/64/eab308/save.png"
                    alt="save"
                  />
                </motion.button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content sideOffset={5}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      className=" bg-yellow-500 text-gray-700 rounded-md p-4 font-bold"
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      Please login to save your typing results
                    </motion.div>
                  </AnimatePresence>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          )}
        </div>
      </LazyMotion>
    </>
  );
};

export default TypingBox;
