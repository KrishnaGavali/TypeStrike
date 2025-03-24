import React from "react";
import GameOverContext from "./GameOverContext";
import PropTypes from "prop-types";

const GameOverContextProvider = ({ children }) => {
  const [gameOver, setGameOver] = React.useState(false);

  return (
    <GameOverContext.Provider value={{ gameOver, setGameOver }}>
      {children}
    </GameOverContext.Provider>
  );
};

GameOverContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GameOverContextProvider;
