import React from "react";
import StartGameContext from "./StartGameContext";
import PropTypes from "prop-types";

const StartGameContextProvider = ({ children }) => {
  const [startGame, setStartGame] = React.useState(false);

  return (
    <StartGameContext.Provider value={{ startGame, setStartGame }}>
      {children}
    </StartGameContext.Provider>
  );
};

StartGameContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StartGameContextProvider;
