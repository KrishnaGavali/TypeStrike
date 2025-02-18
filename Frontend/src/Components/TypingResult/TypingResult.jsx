import PropTypes from "prop-types"; // Import PropTypes
import ResultChart from "./ResultChart";

const TypingResult = ({ Stats }) => {
  console.log(Stats);
  console.log("Fuck");
  return (
    <>
      <div
        className=" h-full w-full flex text-yellow-500 jetbrains-mono"
        id="typing-result-main-div"
      >
        <div
          className=" h-full w-1/4 flex flex-col border-r-2 border-solid border-r-yellow-500"
          id="stats-div"
        >
          <div className="  h-1/2 w-full flex flex-col p-5" id="netWPM-div">
            <div
              className=" text-gray-500 w-full h-[20%] text-2xl"
              id="wpm-title-div"
            >
              Net WPM :
            </div>
            <p
              className=" h-[80%] flex justify-center items-center text-6xl"
              id="wpmNo"
            >
              {Stats.netSpeed}
              <span className=" text-4xl ml-5">WPM</span>
            </p>
          </div>
          <div className="  h-1/2 w-full flex flex-col p-5" id="accuracy-div">
            <div
              className=" text-gray-500 w-full h-[20%] text-2xl"
              id="accuracy-title-div"
            >
              Accuracy :
            </div>
            <p
              className=" h-[80%] flex justify-center items-center text-6xl"
              id="accuracyNo"
            >
              {Stats.typingAccuracy.toFixed(2)}
              <span className=" text-4xl ml-5">%</span>
            </p>
          </div>
        </div>
        <div className=" h-full w-3/4 flex flex-col" id="graph-div">
          <ResultChart
            netArray={Stats.netSpeedArray}
            rawArray={Stats.rawSpeedArray}
          />
        </div>
      </div>
    </>
  );
};

// Define the propTypes
TypingResult.propTypes = {
  Stats: PropTypes.shape({
    noOfTypedWords: PropTypes.number.isRequired,
    noOfTypedLetters: PropTypes.number.isRequired,
    noOfCorrectTypedLetters: PropTypes.number.isRequired,
    noOfWrongTypedLetters: PropTypes.number.isRequired,
    rawSpeed: PropTypes.number.isRequired,
    netSpeed: PropTypes.number.isRequired,
    rawSpeedArray: PropTypes.arrayOf(PropTypes.number).isRequired,
    netSpeedArray: PropTypes.arrayOf(PropTypes.number).isRequired,
    typingAccuracy: PropTypes.number.isRequired,
  }).isRequired,
};

export default TypingResult;
